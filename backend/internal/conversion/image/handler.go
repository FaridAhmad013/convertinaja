package image

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/faridahmad013/convertinaja/internal/storage"
	"github.com/faridahmad013/convertinaja/internal/validator"
)

type Handler struct {
	storage *storage.Storage
	service *Service
}

func NewHandler(store *storage.Storage, svc *Service) *Handler {
	return &Handler{
		storage: store,
		service: svc,
	}
}

func (h *Handler) RegisterRoutes(r chi.Router) {
	r.Route("/api/v1/image", func(r chi.Router) {
		r.Post("/analyze", h.AnalyzeImage)
		r.Post("/optimize", h.Optimize)
		r.Post("/optimize/batch", h.Optimize) // alias for multiple
		r.Get("/download/{id}", h.Download)
		r.Get("/download/{id}/zip", h.DownloadZip)
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

// POST /api/v1/image/analyze
func (h *Handler) AnalyzeImage(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(30 << 20); err != nil {
		writeError(w, http.StatusRequestEntityTooLarge, "File exceeds upload limit (30MB)")
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		writeError(w, http.StatusBadRequest, "Missing 'file' field in multipart form")
		return
	}
	defer file.Close()

	info, err := AnalyzeImage(file, header.Filename, header.Size)
	if err != nil {
		writeError(w, http.StatusBadRequest, fmt.Sprintf("Analysis failed: %v", err))
		return
	}

	writeJSON(w, http.StatusOK, info)
}

// POST /api/v1/image/optimize
func (h *Handler) Optimize(w http.ResponseWriter, r *http.Request) {
	// 55MB multipart ceiling
	if err := r.ParseMultipartForm(55 << 20); err != nil {
		writeError(w, http.StatusRequestEntityTooLarge, "Request payload exceeds size limit (55MB)")
		return
	}

	formFiles := r.MultipartForm.File["files"]
	if len(formFiles) == 0 {
		if single := r.MultipartForm.File["file"]; len(single) > 0 {
			formFiles = single
		}
	}

	if len(formFiles) == 0 {
		writeError(w, http.StatusBadRequest, "No files uploaded")
		return
	}

	if len(formFiles) > 10 {
		writeError(w, http.StatusBadRequest, "Exceeded maximum limit of 10 files per batch")
		return
	}

	// Parse request configuration
	req := OptimizeRequest{
		Mode:                "smart",
		OutputFormat:        FormatAuto,
		MaintainAspectRatio: true,
		RemoveMetadata:      true,
		QualityStrategy:     StrategyBalanced,
	}

	if configStr := r.FormValue("config"); configStr != "" {
		_ = json.Unmarshal([]byte(configStr), &req)
	} else {
		// Fallback parse individual form fields
		if mode := r.FormValue("mode"); mode != "" {
			req.Mode = mode
		}
		if outFmt := r.FormValue("output_format"); outFmt != "" {
			req.OutputFormat = Format(strings.ToLower(outFmt))
		}
		if qStr := r.FormValue("quality"); qStr != "" {
			if q, err := strconv.Atoi(qStr); err == nil {
				req.Quality = q
			}
		}
		if wStr := r.FormValue("max_width"); wStr != "" {
			if mw, err := strconv.Atoi(wStr); err == nil {
				req.MaxWidth = mw
			}
		}
		if hStr := r.FormValue("max_height"); hStr != "" {
			if mh, err := strconv.Atoi(hStr); err == nil {
				req.MaxHeight = mh
			}
		}
		if targetValStr := r.FormValue("target_size_value"); targetValStr != "" {
			if val, err := strconv.ParseInt(targetValStr, 10, 64); err == nil && val > 0 {
				unit := strings.ToUpper(r.FormValue("target_size_unit"))
				if unit == "" {
					unit = "KB"
				}
				req.TargetSize = &TargetSizeConfig{
					Value: val,
					Unit:  unit,
				}
			}
		}
	}

	preliminaryJobID := uuid.New().String()
	var savedPaths []string

	for _, fileHeader := range formFiles {
		src, err := fileHeader.Open()
		if err != nil {
			_ = h.storage.CleanupJob(preliminaryJobID)
			writeError(w, http.StatusInternalServerError, "Failed to read uploaded file")
			return
		}

		ft, headerBytes, valErr := validator.ValidateFileHeader(src, fileHeader.Size, "image-to-webp")
		if valErr != nil || (ft != validator.FileTypeJPEG && ft != validator.FileTypePNG && ft != validator.FileTypeWebP) {
			src.Close()
			_ = h.storage.CleanupJob(preliminaryJobID)
			writeError(w, http.StatusBadRequest, fmt.Sprintf("File %q is not a supported image format", fileHeader.Filename))
			return
		}

		savedPath, saveErr := h.storage.SaveUploadedFile(preliminaryJobID, fileHeader.Filename, headerBytes, src)
		src.Close()
		if saveErr != nil {
			_ = h.storage.CleanupJob(preliminaryJobID)
			writeError(w, http.StatusInternalServerError, "Failed to store uploaded file")
			return
		}

		savedPaths = append(savedPaths, savedPath)
	}

	batchRes, token, err := h.service.ProcessBatch(r.Context(), preliminaryJobID, savedPaths, req)
	if err != nil {
		_ = h.storage.CleanupJob(preliminaryJobID)
		log.Error().Err(err).Msg("Image batch optimization error")
		writeError(w, http.StatusInternalServerError, "Image optimization process failed")
		return
	}

	w.Header().Set("X-Job-Token", token)
	writeJSON(w, http.StatusOK, batchRes)
}

// GET /api/v1/image/download/{id}
func (h *Handler) Download(w http.ResponseWriter, r *http.Request) {
	jobID := chi.URLParam(r, "id")
	token := r.Header.Get("X-Job-Token")
	if token == "" {
		token = r.URL.Query().Get("token")
	}

	if token == "" {
		writeError(w, http.StatusUnauthorized, "Missing access token")
		return
	}

	index := -1
	if idxStr := r.URL.Query().Get("index"); idxStr != "" {
		if parsed, err := strconv.Atoi(idxStr); err == nil {
			index = parsed
		}
	}

	isInline := r.URL.Query().Get("inline") == "1"

	filePath, mimeType, filename, err := h.service.GetArtifact(jobID, token, index, false)
	if err != nil {
		if errors.Is(err, ErrInvalidToken) {
			writeError(w, http.StatusUnauthorized, "Invalid job token")
			return
		}
		writeError(w, http.StatusNotFound, "Image artifact not found or expired")
		return
	}

	if mimeType != "" {
		w.Header().Set("Content-Type", mimeType)
	}

	disposition := "attachment"
	if isInline {
		disposition = "inline"
	}

	w.Header().Set("Content-Disposition", fmt.Sprintf(`%s; filename="%s"`, disposition, filepath.Base(filename)))
	http.ServeFile(w, r, filePath)
}

// GET /api/v1/image/download/{id}/zip
func (h *Handler) DownloadZip(w http.ResponseWriter, r *http.Request) {
	jobID := chi.URLParam(r, "id")
	token := r.Header.Get("X-Job-Token")
	if token == "" {
		token = r.URL.Query().Get("token")
	}

	if token == "" {
		writeError(w, http.StatusUnauthorized, "Missing access token")
		return
	}

	filePath, mimeType, filename, err := h.service.GetArtifact(jobID, token, -1, true)
	if err != nil {
		if errors.Is(err, ErrInvalidToken) {
			writeError(w, http.StatusUnauthorized, "Invalid job token")
			return
		}
		writeError(w, http.StatusNotFound, "ZIP archive not found or expired")
		return
	}

	w.Header().Set("Content-Type", mimeType)
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%s"`, filepath.Base(filename)))
	http.ServeFile(w, r, filePath)
}
