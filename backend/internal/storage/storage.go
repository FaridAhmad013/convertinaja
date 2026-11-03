package storage

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/google/uuid"
	"github.com/faridahmad013/convertinaja/internal/validator"
)

type Storage struct {
	baseDir string
}

func New(baseDir string) (*Storage, error) {
	if err := os.MkdirAll(baseDir, 0750); err != nil {
		return nil, fmt.Errorf("failed to create storage base directory: %w", err)
	}
	return &Storage{baseDir: baseDir}, nil
}

func (s *Storage) GetJobDir(jobID string) string {
	return filepath.Join(s.baseDir, jobID)
}

func (s *Storage) CreateJobDir(jobID string) (string, error) {
	dir := s.GetJobDir(jobID)
	if err := os.MkdirAll(dir, 0750); err != nil {
		return "", fmt.Errorf("failed to create job directory: %w", err)
	}
	return dir, nil
}

// SaveUploadedFile saves prefixed header + remaining reader stream into an isolated job file
func (s *Storage) SaveUploadedFile(jobID, originalName string, header []byte, r io.Reader) (string, error) {
	jobDir, err := s.CreateJobDir(jobID)
	if err != nil {
		return "", err
	}

	sanitized := validator.SanitizeFilename(originalName)
	storedName := fmt.Sprintf("%s_%s", uuid.New().String()[:8], sanitized)
	filePath := filepath.Join(jobDir, storedName)

	file, err := os.OpenFile(filePath, os.O_CREATE|os.O_WRONLY, 0600)
	if err != nil {
		return "", fmt.Errorf("failed to open destination file: %w", err)
	}
	defer file.Close()

	if len(header) > 0 {
		if _, err := file.Write(header); err != nil {
			return "", fmt.Errorf("failed to write header: %w", err)
		}
	}

	if _, err := io.Copy(file, r); err != nil {
		return "", fmt.Errorf("failed to stream file payload: %w", err)
	}

	return filePath, nil
}

// CleanupJob immediately removes the entire job workspace directory
func (s *Storage) CleanupJob(jobID string) error {
	dir := s.GetJobDir(jobID)
	return os.RemoveAll(dir)
}

// CreateZipArchive bundles multiple output files into a single ZIP archive for batch download
func (s *Storage) CreateZipArchive(jobID string, filePaths []string) (string, error) {
	return s.CreateCustomZipArchive(jobID, filePaths, "bundle.zip")
}

// CreateCustomZipArchive bundles given file paths into a specified zip archive name inside job directory
func (s *Storage) CreateCustomZipArchive(jobID string, filePaths []string, zipName string) (string, error) {
	jobDir := s.GetJobDir(jobID)
	zipPath := filepath.Join(jobDir, zipName)

	zipFile, err := os.Create(zipPath)
	if err != nil {
		return "", fmt.Errorf("failed to create zip file: %w", err)
	}
	defer zipFile.Close()

	w := zip.NewWriter(zipFile)
	defer w.Close()

	for _, path := range filePaths {
		info, statErr := os.Stat(path)
		if statErr != nil || info.IsDir() {
			continue
		}

		f, openErr := os.Open(path)
		if openErr != nil {
			return "", openErr
		}

		header, headerErr := zip.FileInfoHeader(info)
		if headerErr != nil {
			f.Close()
			return "", headerErr
		}
		header.Name = filepath.Base(path)
		header.Method = zip.Deflate

		writer, createErr := w.CreateHeader(header)
		if createErr != nil {
			f.Close()
			return "", createErr
		}

		if _, copyErr := io.Copy(writer, f); copyErr != nil {
			f.Close()
			return "", copyErr
		}
		f.Close()
	}

	return zipPath, nil
}
