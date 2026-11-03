package service

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"os"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/faridahmad013/convertinaja/internal/converter"
	"github.com/faridahmad013/convertinaja/internal/storage"
)

var (
	ErrJobNotFound     = errors.New("conversion job not found or expired")
	ErrInvalidToken    = errors.New("unauthorized job access token")
	ErrJobNotCompleted = errors.New("conversion job has not completed yet")
)

type JobStatus string

const (
	StatusPending    JobStatus = "pending"
	StatusQueued     JobStatus = "queued"
	StatusProcessing JobStatus = "processing"
	StatusCompleted  JobStatus = "completed"
	StatusFailed     JobStatus = "failed"
	StatusExpired    JobStatus = "expired"
)

type JobRecord struct {
	ID               string
	AccessToken      string
	Action           string
	Status           JobStatus
	InputFilePaths   []string
	ResultPaths      []string
	PrimaryPath      string
	BatchArchivePath string
	MimeType         string
	FileSize         int64
	ErrorMessage     string
	CreatedAt        time.Time
	CompletedAt      *time.Time
	ExpiresAt        time.Time
}

type JobService struct {
	storage *storage.Storage
	engine  converter.Engine
	mu      sync.RWMutex
	jobs    map[string]*JobRecord
}

func NewJobService(store *storage.Storage, engine converter.Engine) *JobService {
	svc := &JobService{
		storage: store,
		engine:  engine,
		jobs:    make(map[string]*JobRecord),
	}

	// Background ticker for 60-minute TTL cleanup
	go svc.startRetentionWorker(10 * time.Minute)

	return svc
}

func generateSecureToken() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

func (s *JobService) CreateJob(ctx context.Context, action string, inputPaths []string, options map[string]interface{}) (*JobRecord, error) {
	jobID := uuid.New().String()
	token := generateSecureToken()
	now := time.Now()

	record := &JobRecord{
		ID:             jobID,
		AccessToken:    token,
		Action:         action,
		Status:         StatusQueued,
		InputFilePaths: inputPaths,
		CreatedAt:      now,
		ExpiresAt:      now.Add(60 * time.Minute),
	}

	s.mu.Lock()
	s.jobs[jobID] = record
	s.mu.Unlock()

	// Launch async conversion worker
	go s.processJob(jobID, action, inputPaths, options)

	return record, nil
}

func (s *JobService) processJob(jobID, action string, inputPaths []string, options map[string]interface{}) {
	s.mu.Lock()
	record, exists := s.jobs[jobID]
	if !exists {
		s.mu.Unlock()
		return
	}
	record.Status = StatusProcessing
	s.mu.Unlock()

	jobDir := s.storage.GetJobDir(jobID)
	// Timeout context: 120s max
	ctx, cancel := context.WithTimeout(context.Background(), 120*time.Second)
	defer cancel()

	req := converter.ConversionJobRequest{
		JobID:      jobID,
		Action:     action,
		InputPaths: inputPaths,
		OutputDir:  jobDir,
		Options:    options,
	}

	result, err := s.engine.Execute(ctx, req)

	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now()
	if err != nil {
		log.Error().Err(err).Str("jobID", jobID).Msg("Job conversion execution failed")
		record.Status = StatusFailed
		record.ErrorMessage = err.Error()
		// Cleanup raw inputs on failure
		_ = s.storage.CleanupJob(jobID)
		return
	}

	record.Status = StatusCompleted
	record.CompletedAt = &now
	record.ResultPaths = result.OutputPaths
	record.PrimaryPath = result.PrimaryPath
	record.MimeType = result.MimeType

	// If multiple outputs, create zip bundle
	if len(result.OutputPaths) > 1 {
		zipPath, zipErr := s.storage.CreateZipArchive(jobID, result.OutputPaths)
		if zipErr == nil {
			record.BatchArchivePath = zipPath
		}
	}

	// Calculate output file size
	if info, statErr := os.Stat(record.PrimaryPath); statErr == nil {
		record.FileSize = info.Size()
	}

	log.Info().
		Str("jobID", jobID).
		Str("action", action).
		Int("outputCount", len(result.OutputPaths)).
		Msg("Job conversion completed successfully")
}

func (s *JobService) GetJob(jobID, token string) (*JobRecord, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	record, exists := s.jobs[jobID]
	if !exists || time.Now().After(record.ExpiresAt) {
		return nil, ErrJobNotFound
	}

	if record.AccessToken != token {
		return nil, ErrInvalidToken
	}

	return record, nil
}

func (s *JobService) GetDownloadArtifact(jobID, token string, isBatch bool) (filePath string, mimeType string, filename string, err error) {
	record, err := s.GetJob(jobID, token)
	if err != nil {
		return "", "", "", err
	}

	if record.Status != StatusCompleted {
		return "", "", "", ErrJobNotCompleted
	}

	if isBatch && record.BatchArchivePath != "" {
		return record.BatchArchivePath, "application/zip", fmt.Sprintf("bundle-%s.zip", jobID[:8]), nil
	}

	return record.PrimaryPath, record.MimeType, "converted_document", nil
}

func (s *JobService) CancelJob(jobID, token string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	record, exists := s.jobs[jobID]
	if !exists {
		return ErrJobNotFound
	}

	if record.AccessToken != token {
		return ErrInvalidToken
	}

	_ = s.storage.CleanupJob(jobID)
	delete(s.jobs, jobID)
	return nil
}

func (s *JobService) startRetentionWorker(interval time.Duration) {
	ticker := time.NewTicker(interval)
	for range ticker.C {
		s.sweepExpiredJobs()
	}
}

func (s *JobService) sweepExpiredJobs() {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now()
	for id, job := range s.jobs {
		if now.After(job.ExpiresAt) {
			_ = s.storage.CleanupJob(id)
			delete(s.jobs, id)
			log.Debug().Str("jobID", id).Msg("Purged expired job")
		}
	}
}
