package image

import (
	"bytes"
	"context"
	"image"
	"image/color"
	"image/jpeg"
	"image/png"
	"os"
	"path/filepath"
	"testing"
)

func createTestPNG(t *testing.T, w, h int, hasAlpha bool) []byte {
	t.Helper()
	img := image.NewNRGBA(image.Rect(0, 0, w, h))
	for y := 0; y < h; y++ {
		for x := 0; x < w; x++ {
			a := uint8(255)
			if hasAlpha && (x+y)%2 == 0 {
				a = 128
			}
			img.SetNRGBA(x, y, color.NRGBA{R: uint8(x % 256), G: uint8(y % 256), B: 100, A: a})
		}
	}
	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		t.Fatalf("failed to encode test png: %v", err)
	}
	return buf.Bytes()
}

func createTestJPEG(t *testing.T, w, h int) []byte {
	t.Helper()
	img := image.NewRGBA(image.Rect(0, 0, w, h))
	for y := 0; y < h; y++ {
		for x := 0; x < w; x++ {
			img.SetRGBA(x, y, color.RGBA{R: uint8(x % 256), G: uint8(y % 256), B: 200, A: 255})
		}
	}
	var buf bytes.Buffer
	if err := jpeg.Encode(&buf, img, &jpeg.Options{Quality: 90}); err != nil {
		t.Fatalf("failed to encode test jpeg: %v", err)
	}
	return buf.Bytes()
}

func TestAnalyzer(t *testing.T) {
	t.Run("PNG with alpha", func(t *testing.T) {
		pngData := createTestPNG(t, 200, 150, true)
		info, err := AnalyzeImage(bytes.NewReader(pngData), "test.png", int64(len(pngData)))
		if err != nil {
			t.Fatalf("AnalyzeImage failed: %v", err)
		}
		if info.Format != FormatPNG {
			t.Errorf("expected format png, got %s", info.Format)
		}
		if info.Width != 200 || info.Height != 150 {
			t.Errorf("expected 200x150, got %dx%d", info.Width, info.Height)
		}
		if !info.HasAlpha {
			t.Errorf("expected has_alpha true")
		}
	})

	t.Run("JPEG without alpha", func(t *testing.T) {
		jpgData := createTestJPEG(t, 320, 240)
		info, err := AnalyzeImage(bytes.NewReader(jpgData), "test.jpg", int64(len(jpgData)))
		if err != nil {
			t.Fatalf("AnalyzeImage failed: %v", err)
		}
		if info.Format != FormatJPEG {
			t.Errorf("expected format jpeg, got %s", info.Format)
		}
		if info.Width != 320 || info.Height != 240 {
			t.Errorf("expected 320x240, got %dx%d", info.Width, info.Height)
		}
		if info.HasAlpha {
			t.Errorf("expected has_alpha false")
		}
	})
}

func TestCalculateTargetDimensions(t *testing.T) {
	tests := []struct {
		name       string
		origW      int
		origH      int
		maxW       int
		maxH       int
		wantW      int
		wantH      int
	}{
		{"Downscale width bound", 4000, 3000, 2000, 0, 2000, 1500},
		{"Downscale height bound", 4000, 3000, 0, 1500, 2000, 1500},
		{"Aspect ratio preserved with both bounds", 4000, 3000, 1920, 1080, 1440, 1080},
		{"Never upscale width", 800, 600, 1920, 1080, 800, 600},
		{"Zero bounds no change", 800, 600, 0, 0, 800, 600},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotW, gotH := CalculateTargetDimensions(tt.origW, tt.origH, tt.maxW, tt.maxH)
			if gotW != tt.wantW || gotH != tt.wantH {
				t.Errorf("CalculateTargetDimensions() = (%d, %d), want (%d, %d)", gotW, gotH, tt.wantW, tt.wantH)
			}
		})
	}
}

func TestOptimizerTargetSize(t *testing.T) {
	tmpDir := t.TempDir()
	jpgBytes := createTestJPEG(t, 800, 600)
	inPath := filepath.Join(tmpDir, "sample.jpg")
	if err := os.WriteFile(inPath, jpgBytes, 0600); err != nil {
		t.Fatal(err)
	}

	encoder := NewVipsEncoder()
	opt := NewOptimizer(encoder)

	req := OptimizeRequest{
		Mode:         "target_size",
		OutputFormat: FormatJPEG,
		TargetSize: &TargetSizeConfig{
			Value: 10, // 10 KB target
			Unit:  "KB",
		},
		MaintainAspectRatio: true,
		RemoveMetadata:      true,
	}

	res, err := opt.Optimize(context.Background(), inPath, tmpDir, req)
	if err != nil {
		t.Fatalf("Optimize failed: %v", err)
	}

	if res.Optimized.Size <= 0 {
		t.Fatalf("expected optimized size > 0, got %d", res.Optimized.Size)
	}

	if res.Optimized.Width > 800 || res.Optimized.Height > 600 {
		t.Errorf("accidental upscaling detected: %dx%d", res.Optimized.Width, res.Optimized.Height)
	}
}
