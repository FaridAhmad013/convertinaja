package image

import (
	"bytes"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/faridahmad013/convertinaja/internal/storage"
)

func setupTestImageHandler(t *testing.T) (*Handler, chi.Router, string) {
	t.Helper()
	tmpDir := t.TempDir()
	store, err := storage.New(filepath.Join(tmpDir, "storage"))
	if err != nil {
		t.Fatal(err)
	}

	encoder := NewVipsEncoder()
	opt := NewOptimizer(encoder)
	svc := NewService(store, opt)
	h := NewHandler(store, svc)

	r := chi.NewRouter()
	h.RegisterRoutes(r)

	return h, r, tmpDir
}

func TestHandlerAnalyzeAndOptimize(t *testing.T) {
	_, router, _ := setupTestImageHandler(t)
	jpegBytes := createTestJPEG(t, 400, 300)

	t.Run("POST /api/v1/image/analyze", func(t *testing.T) {
		body := &bytes.Buffer{}
		writer := multipart.NewWriter(body)
		part, err := writer.CreateFormFile("file", "photo.jpg")
		if err != nil {
			t.Fatal(err)
		}
		_, _ = part.Write(jpegBytes)
		_ = writer.Close()

		req := httptest.NewRequest(http.MethodPost, "/api/v1/image/analyze", body)
		req.Header.Set("Content-Type", writer.FormDataContentType())
		rec := httptest.NewRecorder()

		router.ServeHTTP(rec, req)

		if rec.Code != http.StatusOK {
			t.Fatalf("expected 200 OK, got %d: %s", rec.Code, rec.Body.String())
		}
	})

	t.Run("POST /api/v1/image/optimize", func(t *testing.T) {
		body := &bytes.Buffer{}
		writer := multipart.NewWriter(body)
		part, err := writer.CreateFormFile("files", "sample.jpg")
		if err != nil {
			t.Fatal(err)
		}
		_, _ = part.Write(jpegBytes)
		_ = writer.WriteField("mode", "smart")
		_ = writer.WriteField("output_format", "jpeg")
		_ = writer.Close()

		req := httptest.NewRequest(http.MethodPost, "/api/v1/image/optimize", body)
		req.Header.Set("Content-Type", writer.FormDataContentType())
		rec := httptest.NewRecorder()

		router.ServeHTTP(rec, req)

		if rec.Code != http.StatusOK {
			t.Fatalf("expected 200 OK, got %d: %s", rec.Code, rec.Body.String())
		}

		token := rec.Header().Get("X-Job-Token")
		if token == "" {
			t.Fatalf("expected X-Job-Token in response header")
		}
	})
}
