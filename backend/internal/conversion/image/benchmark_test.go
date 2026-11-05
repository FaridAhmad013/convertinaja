package image

import (
	"context"
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/jpeg"
	"image/png"
	"math"
	"os"
	"path/filepath"
	"testing"
	"time"
)

// Helper to generate a complex photographic pattern (wave frequencies + gradients)
func generatePhotoPattern(w, h int) *image.RGBA {
	img := image.NewRGBA(image.Rect(0, 0, w, h))
	for y := 0; y < h; y++ {
		for x := 0; x < w; x++ {
			// Multi-frequency wave simulating photographic landscape textures
			r := uint8((math.Sin(float64(x)/30.0)*0.5 + 0.5) * 200)
			g := uint8((math.Cos(float64(y)/25.0)*0.5 + 0.5) * 180 + float64(y%50))
			b := uint8((math.Sin(float64(x+y)/40.0)*0.5 + 0.5) * 220)
			img.SetRGBA(x, y, color.RGBA{R: r, G: g, B: b, A: 255})
		}
	}
	return img
}

// Helper to generate a UI Graphic with sharp shapes and transparency
func generateUIGraphic(w, h int) *image.NRGBA {
	img := image.NewNRGBA(image.Rect(0, 0, w, h))
	// Transparent background
	for y := 0; y < h; y++ {
		for x := 0; x < w; x++ {
			img.SetNRGBA(x, y, color.NRGBA{0, 0, 0, 0})
		}
	}
	// Solid badge card in center
	cardW, cardH := w*3/4, h*3/4
	cardX, cardY := w/8, h/8
	for y := cardY; y < cardY+cardH; y++ {
		for x := cardX; x < cardX+cardW; x++ {
			img.SetNRGBA(x, y, color.NRGBA{R: 37, G: 99, B: 235, A: 240}) // Brand blue with alpha
		}
	}
	// Sharp inner icon
	for y := cardY + 40; y < cardY+100; y++ {
		for x := cardX + 40; x < cardX+100; x++ {
			img.SetNRGBA(x, y, color.NRGBA{R: 255, G: 255, B: 255, A: 255})
		}
	}
	return img
}

// Helper to generate a high-contrast document screenshot with crisp text blocks
func generateTextDocument(w, h int) *image.RGBA {
	img := image.NewRGBA(image.Rect(0, 0, w, h))
	// White background
	draw.Draw(img, img.Bounds(), &image.Uniform{color.White}, image.Point{}, draw.Src)
	// Black text lines
	lineH := 8
	gap := 16
	for y := 60; y < h-60; y += lineH + gap {
		for x := 60; x < w-100; x++ {
			if (x/20)%3 != 0 { // Word block gaps
				for ly := 0; ly < lineH; ly++ {
					img.SetRGBA(x, y+ly, color.RGBA{R: 15, G: 23, B: 42, A: 255})
				}
			}
		}
	}
	return img
}

func TestBenchmarkRealImageArchetypes(t *testing.T) {
	tmpDir := t.TempDir()
	encoder := NewVipsEncoder()
	opt := NewOptimizer(encoder)

	type BenchmarkFixture struct {
		Name        string
		Category    string
		Path        string
		OriginalW   int
		OriginalH   int
		OriginalKB  float64
		TargetReq   OptimizeRequest
	}

	// 1. High-resolution Photo (3200x2400)
	photoImg := generatePhotoPattern(3200, 2400)
	photoPath := filepath.Join(tmpDir, "sample_photo.jpg")
	fPhoto, _ := os.Create(photoPath)
	_ = jpeg.Encode(fPhoto, photoImg, &jpeg.Options{Quality: 95})
	_ = fPhoto.Close()
	stPhoto, _ := os.Stat(photoPath)

	// 2. Graphic with Transparency (1200x900)
	graphicImg := generateUIGraphic(1200, 900)
	graphicPath := filepath.Join(tmpDir, "sample_graphic.png")
	fGraphic, _ := os.Create(graphicPath)
	_ = png.Encode(fGraphic, graphicImg)
	_ = fGraphic.Close()
	stGraphic, _ := os.Stat(graphicPath)

	// 3. Document / Screenshot (1920x1080)
	docImg := generateTextDocument(1920, 1080)
	docPath := filepath.Join(tmpDir, "sample_doc.png")
	fDoc, _ := os.Create(docPath)
	_ = png.Encode(fDoc, docImg)
	_ = fDoc.Close()
	stDoc, _ := os.Stat(docPath)

	fixtures := []BenchmarkFixture{
		{
			Name:       "Foto Kamera Resolusi Tinggi",
			Category:   "Photo (High-res)",
			Path:       photoPath,
			OriginalW:  3200,
			OriginalH:  2400,
			OriginalKB: float64(stPhoto.Size()) / 1024.0,
			TargetReq: OptimizeRequest{
				Mode:                "smart",
				OutputFormat:        FormatJPEG,
				MaxWidth:            1600, // Medium preset
				MaxHeight:           1200,
				QualityStrategy:     StrategyBalanced,
				RemoveMetadata:      true,
				MaintainAspectRatio: true,
			},
		},
		{
			Name:       "Foto dengan Target Ketat (≤ 300 KB)",
			Category:   "Photo (Target Size)",
			Path:       photoPath,
			OriginalW:  3200,
			OriginalH:  2400,
			OriginalKB: float64(stPhoto.Size()) / 1024.0,
			TargetReq: OptimizeRequest{
				Mode:         "target_size",
				OutputFormat: FormatJPEG,
				TargetSize: &TargetSizeConfig{
					Value: 300,
					Unit:  "KB",
				},
				MaintainAspectRatio: true,
				RemoveMetadata:      true,
			},
		},
		{
			Name:       "Grafis UI dengan Transparansi",
			Category:   "Graphic Alpha (PNG)",
			Path:       graphicPath,
			OriginalW:  1200,
			OriginalH:  900,
			OriginalKB: float64(stGraphic.Size()) / 1024.0,
			TargetReq: OptimizeRequest{
				Mode:                "smart",
				OutputFormat:        FormatPNG,
				QualityStrategy:     StrategyBalanced,
				MaintainAspectRatio: true,
				RemoveMetadata:      true,
			},
		},
		{
			Name:       "Tangkapan Layar Teks / Dokumen",
			Category:   "Document / Text",
			Path:       docPath,
			OriginalW:  1920,
			OriginalH:  1080,
			OriginalKB: float64(stDoc.Size()) / 1024.0,
			TargetReq: OptimizeRequest{
				Mode:                "smart",
				OutputFormat:        FormatPNG,
				QualityStrategy:     StrategyBalanced,
				MaintainAspectRatio: true,
				RemoveMetadata:      true,
			},
		},
	}

	fmt.Println("\n=========================================================================================")
	fmt.Println("                       CONVERTINAJA IMAGE OPTIMIZATION BENCHMARK                         ")
	fmt.Println("=========================================================================================")
	fmt.Printf("%-32s | %-12s | %-12s | %-9s | %-8s | %s\n", "Karakter Gambar", "Sebelum", "Sesudah", "Hemat (%)", "Waktu", "Status Target")
	fmt.Println("-----------------------------------------------------------------------------------------")

	for _, fix := range fixtures {
		start := time.Now()
		res, err := opt.Optimize(context.Background(), fix.Path, tmpDir, fix.TargetReq)
		elapsed := time.Since(start)

		if err != nil {
			t.Fatalf("Benchmark error on %s: %v", fix.Name, err)
		}

		optKB := float64(res.Optimized.Size) / 1024.0
		targetStatus := "Optimal HD"
		if fix.TargetReq.TargetSize != nil {
			if res.TargetReached {
				targetStatus = "Tercapai ✓"
			} else {
				targetStatus = "Batas Kualitas"
			}
		}

		beforeStr := fmt.Sprintf("%.1fKB (%dx%d)", fix.OriginalKB, fix.OriginalW, fix.OriginalH)
		afterStr := fmt.Sprintf("%.1fKB (%dx%d)", optKB, res.Optimized.Width, res.Optimized.Height)

		fmt.Printf("%-32s | %-12s | %-12s | %8.1f%% | %6dms | %s\n",
			fix.Name,
			beforeStr,
			afterStr,
			res.ReductionPercent,
			elapsed.Milliseconds(),
			targetStatus,
		)

		if res.Optimized.Size <= 0 {
			t.Errorf("optimized size must be > 0 for %s", fix.Name)
		}
	}
	fmt.Println("=========================================================================================")
}
