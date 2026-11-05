package image

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/faridahmad013/convertinaja/internal/storage"
)

var (
	ErrJobNotFound     = errors.New("image optimization job not found or expired")
	ErrInvalidToken    = errors.New("unauthorized image job token")
	ErrJobNotCompleted = errors.New("image optimization job still processing")
)

type ImageJobRecord struct {
	ID             string
	AccessToken    string
	Mode           string
	Status         string // "processing", "completed", "failed"
	InputPaths     []string
	Results        []OptimizeResult
	ZipPath        string
	CreatedAt      time.Time
	ExpiresAt      time.Time
}

type Service struct {
	storage   *storage.Storage
	optimizer *Optimizer
	mu        sync.RWMutex
	jobs      map[string]*ImageJobRecord
}

func NewService(store *storage.Storage, opt *Optimizer) *Service {
	svc := &Service{
		storage:   store,
		optimizer: opt,
		jobs:      make(map[string]*ImageJobRecord),
	}

	go svc.startCleanupWorker(2 * time.Minute)
	return svc
}

func generateToken() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

func (s *Service) ProcessBatch(ctx context.Context, jobID string, inputPaths []string, req OptimizeRequest) (*BatchOptimizeResult, string, error) {
	if jobID == "" {
		jobID = uuid.New().String()
	}
	token := generateToken()
	now := time.Now()

	jobDir, err := s.storage.CreateJobDir(jobID)
	if err != nil {
		return nil, "", fmt.Errorf("failed to create job dir: %w", err)
	}

	record := &ImageJobRecord{
		ID:          jobID,
		AccessToken: token,
		Mode:        req.Mode,
		Status:      "processing",
		InputPaths:  inputPaths,
		CreatedAt:   now,
		ExpiresAt:   now.Add(10 * time.Minute),
	}

	s.mu.Lock()
	s.jobs[jobID] = record
	s.mu.Unlock()

	var results []OptimizeResult
	var successfulPaths []string
	var totalOrig, totalOpt int64

	for i, inPath := range inputPaths {
		itemRes, optErr := s.optimizer.Optimize(ctx, inPath, jobDir, req)
		if optErr != nil {
			log.Error().Err(optErr).Str("path", inPath).Msg("Image item optimization failed")
			results = append(results, OptimizeResult{
				Status:       "failed",
				ErrorMessage: optErr.Error(),
			})
			continue
		}

		itemRes.DownloadURL = fmt.Sprintf("/api/v1/image/download/%s?token=%s&index=%d", jobID, token, i)
		itemRes.PreviewURL = fmt.Sprintf("/api/v1/image/download/%s?token=%s&index=%d&inline=1", jobID, token, i)

		results = append(results, *itemRes)
		successfulPaths = append(successfulPaths, itemRes.OutputPath)
		totalOrig += itemRes.Original.Size
		totalOpt += itemRes.Optimized.Size
	}

	// Immediate cleanup of raw uploaded input files
	for _, inPath := range inputPaths {
		_ = os.Remove(inPath)
	}

	// Create zip archive if multiple successful files
	var zipPath string
	if len(successfulPaths) > 1 {
		zName := fmt.Sprintf("optimized_%s.zip", jobID[:8])
		zPath, zErr := s.storage.CreateCustomZipArchive(jobID, successfulPaths, zName)
		if zErr == nil {
			zipPath = zPath
		}
	}

	s.mu.Lock()
	record.Status = "completed"
	record.Results = results
	record.ZipPath = zipPath
	s.mu.Unlock()

	totalSaved := totalOrig - totalOpt
	var totalRed float64
	if totalOrig > 0 {
		totalRed = float64(totalSaved) / float64(totalOrig) * 100
	}

	batchRes := &BatchOptimizeResult{
		JobID:          jobID,
		Status:         "completed",
		TotalOriginal:  totalOrig,
		TotalOptimized: totalOpt,
		TotalSaved:     totalSaved,
		TotalReduction: totalRed,
		Items:          results,
		CreatedAt:      now,
	}

	if zipPath != "" {
		batchRes.ZipDownloadURL = fmt.Sprintf("/api/v1/image/download/%s/zip?token=%s", jobID, token)
	}

	return batchRes, token, nil
}

func (s *Service) GetArtifact(jobID, token string, index int, isZip bool) (string, string, string, error) {
	s.mu.RLock()
	record, exists := s.jobs[jobID]
	s.mu.RUnlock()

	if !exists || time.Now().After(record.ExpiresAt) {
		return "", "", "", ErrJobNotFound
	}
	if record.AccessToken != token {
		return "", "", "", ErrInvalidToken
	}

	if isZip {
		if record.ZipPath == "" {
			return "", "", "", errors.New("zip archive not available")
		}
		return record.ZipPath, "application/zip", filepath.Base(record.ZipPath), nil
	}

	if index >= 0 && index < len(record.Results) {
		res := record.Results[index]
		if res.Status == "completed" && res.OutputPath != "" {
			return res.OutputPath, res.MimeType, filepath.Base(res.OutputPath), nil
		}
	}

	// Default to first completed result
	for _, res := range record.Results {
		if res.Status == "completed" && res.OutputPath != "" {
			return res.OutputPath, res.MimeType, filepath.Base(res.OutputPath), nil
		}
	}

	return "", "", "", errors.New("no downloadable image artifact available")
}

func (s *Service) startCleanupWorker(interval time.Duration) {
	ticker := time.NewTicker(interval)
	for range ticker.C {
		s.mu.Lock()
		now := time.Now()
		for id, rec := range s.jobs {
			if now.After(rec.ExpiresAt) {
				_ = s.storage.CleanupJob(id)
				delete(s.jobs, id)
			}
		}
		s.mu.Unlock()
	}
}
