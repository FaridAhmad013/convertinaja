package handler_test

import (
	"bytes"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/faridahmad013/convertinaja/internal/converter"
	"github.com/faridahmad013/convertinaja/internal/handler"
	"github.com/faridahmad013/convertinaja/internal/service"
	"github.com/faridahmad013/convertinaja/internal/storage"
)

func setupTestRouter(t *testing.T) chi.Router {
	tmpDir := filepath.Join(os.TempDir(), "convertinaja_test")
	store, err := storage.New(tmpDir)
	if err != nil {
		t.Fatalf("failed to init storage: %v", err)
	}

	engine := converter.NewPopplerEngine("", "gs")
	jobService := service.NewJobService(store, engine)
	h := handler.NewConversionHandler(store, jobService)

	router := chi.NewRouter()
	h.RegisterRoutes(router)
	return router
}

func TestUploadInvalidMime(t *testing.T) {
	router := setupTestRouter(t)

	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)
	_ = writer.WriteField("action", "merge-pdf")

	part, err := writer.CreateFormFile("files", "test.txt")
	if err != nil {
		t.Fatalf("failed to create form file: %v", err)
	}
	_, _ = part.Write([]byte("plain text not a pdf"))
	_ = writer.Close()

	req := httptest.NewRequest(http.MethodPost, "/api/v1/conversions", &buf)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected status 400 Bad Request, got %d. Body: %s", rec.Code, rec.Body.String())
	}
}

func TestGetJobUnauthorized(t *testing.T) {
	router := setupTestRouter(t)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/conversions/random-uuid?token=wrong-token", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	// Either 404 (not found) or 401 (unauthorized)
	if rec.Code != http.StatusNotFound && rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 or 404, got %d", rec.Code)
	}
}

func TestUploadValidPDFJobAccepted(t *testing.T) {
	router := setupTestRouter(t)

	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)
	_ = writer.WriteField("action", "merge-pdf")

	part, err := writer.CreateFormFile("files", "sample.pdf")
	if err != nil {
		t.Fatalf("failed to create form file: %v", err)
	}
	// Genuine %PDF- magic bytes header
	_, _ = part.Write([]byte("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF"))
	_ = writer.Close()

	req := httptest.NewRequest(http.MethodPost, "/api/v1/conversions", &buf)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusAccepted {
		t.Fatalf("expected 202 Accepted, got %d. Body: %s", rec.Code, rec.Body.String())
	}
}
