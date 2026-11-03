package handler

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/faridahmad013/convertinaja/internal/service"
	"github.com/faridahmad013/convertinaja/internal/storage"
	"github.com/faridahmad013/convertinaja/internal/validator"
)

type ConversionHandler struct {
	storage    *storage.Storage
	jobService *service.JobService
}

func NewConversionHandler(store *storage.Storage, svc *service.JobService) *ConversionHandler {
	return &ConversionHandler{
		storage:    store,
		jobService: svc,
	}
}

func (h *ConversionHandler) RegisterRoutes(r chi.Router) {
	r.Route("/api/v1/conversions", func(r chi.Router) {
		r.Post("/", h.CreateJob)
		r.Get("/{id}", h.GetJobStatus)
		r.Get("/{id}/download", h.DownloadArtifact)
		r.Delete("/{id}", h.CancelJob)
	})
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

func extractToken(r *http.Request) string {
	token := r.Header.Get("X-Job-Token")
	if token == "" {
		token = r.URL.Query().Get("token")
	}
	return strings.TrimSpace(token)
}

// POST /api/v1/conversions
func (h *ConversionHandler) CreateJob(w http.ResponseWriter, r *http.Request) {
	// 55MB multipart parse ceiling
	if err := r.ParseMultipartForm(55 << 20); err != nil {
		writeError(w, http.StatusRequestEntityTooLarge, "Request payload exceeds size limit")
		return
	}

	action := strings.TrimSpace(r.FormValue("action"))
	if action == "" {
		writeError(w, http.StatusBadRequest, "Missing required 'action' parameter")
		return
	}

	var options map[string]interface{}
	if optStr := r.FormValue("options"); optStr != "" {
		_ = json.Unmarshal([]byte(optStr), &options)
	}

	formFiles := r.MultipartForm.File["files"]
	if len(formFiles) == 0 {
		writeError(w, http.StatusBadRequest, "No files uploaded")
		return
	}

	if len(formFiles) > 10 {
		writeError(w, http.StatusBadRequest, "Exceeded maximum of 10 files per conversion job")
		return
	}

	// Prepare job directory
	preliminaryJobID := uuid.New().String()
	var savedPaths []string

	for _, fileHeader := range formFiles {
		src, err := fileHeader.Open()
		if err != nil {
			_ = h.storage.CleanupJob(preliminaryJobID)
			writeError(w, http.StatusInternalServerError, "Failed to read uploaded file")
			return
		}

		// Inspect magic bytes and size
		_, headerBytes, valErr := validator.ValidateFileHeader(src, fileHeader.Size, action)
		if valErr != nil {
			src.Close()
			_ = h.storage.CleanupJob(preliminaryJobID)
			writeError(w, http.StatusBadRequest, fmt.Sprintf("File %q invalid: %v", fileHeader.Filename, valErr))
			return
		}

		// Save into job directory
		savedPath, saveErr := h.storage.SaveUploadedFile(preliminaryJobID, fileHeader.Filename, headerBytes, src)
		src.Close()
		if saveErr != nil {
			_ = h.storage.CleanupJob(preliminaryJobID)
			writeError(w, http.StatusInternalServerError, "Failed to persist uploaded file")
			return
		}

		savedPaths = append(savedPaths, savedPath)
	}

	job, err := h.jobService.CreateJob(r.Context(), action, savedPaths, options)
	if err != nil {
		_ = h.storage.CleanupJob(preliminaryJobID)
		writeError(w, http.StatusInternalServerError, "Failed to create conversion job")
		return
	}

	writeJSON(w, http.StatusAccepted, map[string]interface{}{
		"job_id":       job.ID,
		"access_token": job.AccessToken,
		"status":       job.Status,
		"action":       job.Action,
		"created_at":   job.CreatedAt,
	})
}

// GET /api/v1/conversions/{id}
func (h *ConversionHandler) GetJobStatus(w http.ResponseWriter, r *http.Request) {
	jobID := chi.URLParam(r, "id")
	token := extractToken(r)

	if token == "" {
		writeError(w, http.StatusUnauthorized, "Missing access token")
		return
	}

	record, err := h.jobService.GetJob(jobID, token)
	if err != nil {
		if errors.Is(err, service.ErrInvalidToken) {
			writeError(w, http.StatusUnauthorized, "Invalid job access token")
			return
		}
		writeError(w, http.StatusNotFound, "Job not found or expired")
		return
	}

	resp := map[string]interface{}{
		"job_id":     record.ID,
		"status":     record.Status,
		"action":     record.Action,
		"created_at": record.CreatedAt,
		"expires_at": record.ExpiresAt,
	}

	if record.Status == service.StatusCompleted {
		resp["download_url"] = fmt.Sprintf("/api/v1/conversions/%s/download?token=%s", record.ID, record.AccessToken)
		if record.BatchArchivePath != "" {
			resp["batch_download_url"] = fmt.Sprintf("/api/v1/conversions/%s/download?token=%s&batch=1", record.ID, record.AccessToken)
		}
		resp["file_size"] = record.FileSize
		resp["completed_at"] = record.CompletedAt
	} else if record.Status == service.StatusFailed {
		resp["error_message"] = record.ErrorMessage
	}

	writeJSON(w, http.StatusOK, resp)
}

// GET /api/v1/conversions/{id}/download
func (h *ConversionHandler) DownloadArtifact(w http.ResponseWriter, r *http.Request) {
	jobID := chi.URLParam(r, "id")
	token := extractToken(r)
	isBatch := r.URL.Query().Get("batch") == "1"

	if token == "" {
		writeError(w, http.StatusUnauthorized, "Missing access token")
		return
	}

	filePath, mimeType, filename, err := h.jobService.GetDownloadArtifact(jobID, token, isBatch)
	if err != nil {
		if errors.Is(err, service.ErrInvalidToken) {
			writeError(w, http.StatusUnauthorized, "Invalid job access token")
			return
		}
		if errors.Is(err, service.ErrJobNotCompleted) {
			writeError(w, http.StatusConflict, "Job has not completed yet")
			return
		}
		writeError(w, http.StatusNotFound, "Artifact not found or expired")
		return
	}

	if mimeType != "" {
		w.Header().Set("Content-Type", mimeType)
	}

	outFilename := filename
	if !isBatch {
		ext := filepath.Ext(filePath)
		outFilename = fmt.Sprintf("converted-document%s", ext)
	}

	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%s"`, outFilename))
	http.ServeFile(w, r, filePath)
}

// DELETE /api/v1/conversions/{id}
func (h *ConversionHandler) CancelJob(w http.ResponseWriter, r *http.Request) {
	jobID := chi.URLParam(r, "id")
	token := extractToken(r)

	if token == "" {
		writeError(w, http.StatusUnauthorized, "Missing access token")
		return
	}

	if err := h.jobService.CancelJob(jobID, token); err != nil {
		if errors.Is(err, service.ErrInvalidToken) {
			writeError(w, http.StatusUnauthorized, "Invalid access token")
			return
		}
		writeError(w, http.StatusNotFound, "Job not found")
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"job_id": jobID,
		"status": "purged",
	})
}
