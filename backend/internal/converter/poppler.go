package converter

import (
	"bytes"
	"context"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/rs/zerolog/log"
)

type PopplerEngine struct {
	popplerBinDir  string
	ghostscriptBin string
}

func NewPopplerEngine(popplerBinDir, ghostscriptBin string) *PopplerEngine {
	if ghostscriptBin == "" {
		ghostscriptBin = "gs"
	}
	return &PopplerEngine{
		popplerBinDir:  popplerBinDir,
		ghostscriptBin: ghostscriptBin,
	}
}

// resolveBinary returns full path if binDir is specified, else plain binary name
func (p *PopplerEngine) resolveBinary(binName string) string {
	if p.popplerBinDir != "" {
		return filepath.Join(p.popplerBinDir, binName)
	}
	return binName
}

func (p *PopplerEngine) Execute(ctx context.Context, req ConversionJobRequest) (*ConversionResult, error) {
	if len(req.InputPaths) == 0 {
		return nil, ErrNoInputs
	}

	normAction := strings.ToLower(strings.ReplaceAll(req.Action, "_", "-"))

	switch normAction {
	case "merge", "merge-pdf":
		return p.mergePDF(ctx, req)
	case "split", "split-pdf":
		return p.splitPDF(ctx, req)
	case "compress", "compress-pdf":
		return p.compressPDF(ctx, req)
	case "pdf-to-jpg", "pdf-to-jpeg":
		return p.pdfToImage(ctx, req, "jpeg", "image/jpeg", ".jpg")
	case "pdf-to-png":
		return p.pdfToImage(ctx, req, "png", "image/png", ".png")
	case "pdf-to-txt":
		return p.pdfToText(ctx, req)
	case "pdf-to-md", "pdf-to-markdown":
		return p.pdfToMarkdown(ctx, req)
	case "pdf-to-html":
		return p.pdfToHtml(ctx, req)
	case "extract-pdf-images", "extract-images":
		return p.extractImages(ctx, req)
	case "jpg-to-png":
		return p.convertImageFormats(req, "png", "image/png", ".png")
	case "png-to-jpg", "png-to-jpeg":
		return p.convertImageFormats(req, "jpeg", "image/jpeg", ".jpg")
	case "image-to-webp", "img-to-webp", "jpg-to-webp", "png-to-webp":
		return p.imageToWebP(ctx, req)
	case "webp-to-jpg", "webp-to-jpeg":
		return p.webpToFormat(ctx, req, "jpeg", "image/jpeg", ".jpg")
	case "webp-to-png":
		return p.webpToFormat(ctx, req, "png", "image/png", ".png")
	case "jpg-to-pdf", "png-to-pdf", "image-to-pdf":
		return p.imagesToPDF(ctx, req)
	case "docx-to-pdf", "pptx-to-pdf", "xlsx-to-pdf", "odt-to-pdf", "doc-to-pdf", "ppt-to-pdf", "xls-to-pdf", "txt-to-pdf":
		return p.officeToPDF(ctx, req)
	default:
		return nil, fmt.Errorf("%w: %s", ErrUnsupportedAction, req.Action)
	}
}

// executeCommand wraps exec.CommandContext, executes in isolated Dir, logs stderr
func (p *PopplerEngine) executeCommand(ctx context.Context, dir, binary string, args ...string) error {
	// Check if executable exists in PATH or binDir
	if _, err := exec.LookPath(binary); err != nil {
		return fmt.Errorf("binary '%s' tidak ditemukan di sistem PATH. Pastikan Poppler/Ghostscript terpasang (misal: 'winget install oschwartz10612.Poppler' atau gunakan Docker): %w", binary, err)
	}

	cmd := exec.CommandContext(ctx, binary, args...)
	cmd.Dir = dir

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	log.Debug().
		Str("binary", binary).
		Strs("args", args).
		Str("dir", dir).
		Msg("Executing conversion subprocess")

	if err := cmd.Run(); err != nil {
		errMsg := strings.TrimSpace(stderr.String())
		log.Error().
			Err(err).
			Str("binary", binary).
			Str("stderr", errMsg).
			Msg("Engine command failed")
		if errMsg != "" {
			return fmt.Errorf("%w: %s", ErrExecutionFailed, errMsg)
		}
		return fmt.Errorf("%w: %v", ErrExecutionFailed, err)
	}

	return nil
}

// 1. Merge PDF
func (p *PopplerEngine) mergePDF(ctx context.Context, req ConversionJobRequest) (*ConversionResult, error) {
	outPath := filepath.Join(req.OutputDir, "merged.pdf")
	args := append([]string{}, req.InputPaths...)
	args = append(args, outPath)

	bin := p.resolveBinary("pdfunite")
	if err := p.executeCommand(ctx, req.OutputDir, bin, args...); err != nil {
		return nil, err
	}

	return &ConversionResult{
		OutputPaths: []string{outPath},
		PrimaryPath: outPath,
		MimeType:    "application/pdf",
		IsArchive:   false,
	}, nil
}

// 2. Split PDF
func (p *PopplerEngine) splitPDF(ctx context.Context, req ConversionJobRequest) (*ConversionResult, error) {
	inPath := req.InputPaths[0]
	outPattern := filepath.Join(req.OutputDir, "page-%d.pdf")

	args := []string{}
	// Check optional page options
	if req.Options != nil {
		if first, ok := req.Options["firstPage"].(int); ok && first > 0 {
			args = append(args, "-f", strconv.Itoa(first))
		}
		if last, ok := req.Options["lastPage"].(int); ok && last > 0 {
			args = append(args, "-l", strconv.Itoa(last))
		}
	}
	args = append(args, inPath, outPattern)

	bin := p.resolveBinary("pdfseparate")
	if err := p.executeCommand(ctx, req.OutputDir, bin, args...); err != nil {
		return nil, err
	}

	matches, _ := filepath.Glob(filepath.Join(req.OutputDir, "page-*.pdf"))
	if len(matches) == 0 {
		return nil, fmt.Errorf("no split pages were generated")
	}

	return &ConversionResult{
		OutputPaths: matches,
		PrimaryPath: matches[0],
		MimeType:    "application/pdf",
		IsArchive:   len(matches) > 1,
	}, nil
}

// 3. Compress PDF (via Ghostscript)
func (p *PopplerEngine) compressPDF(ctx context.Context, req ConversionJobRequest) (*ConversionResult, error) {
	inPath := req.InputPaths[0]
	outPath := filepath.Join(req.OutputDir, "compressed.pdf")

	pdfSetting := "/screen" // default low/medium size
	if req.Options != nil {
		if level, ok := req.Options["compressionLevel"].(string); ok {
			switch level {
			case "low":
				pdfSetting = "/prepress" // high quality
			case "high":
				pdfSetting = "/screen" // smaller size
			default:
				pdfSetting = "/ebook" // balanced
			}
		}
	}

	args := []string{
		"-sDEVICE=pdfwrite",
		"-dCompatibilityLevel=1.4",
		fmt.Sprintf("-dPDFSETTINGS=%s", pdfSetting),
		"-dNOPAUSE",
		"-dQUIET",
		"-dBATCH",
		fmt.Sprintf("-sOutputFile=%s", outPath),
		inPath,
	}

	if err := p.executeCommand(ctx, req.OutputDir, p.ghostscriptBin, args...); err != nil {
		return nil, err
	}

	return &ConversionResult{
		OutputPaths: []string{outPath},
		PrimaryPath: outPath,
		MimeType:    "application/pdf",
		IsArchive:   false,
	}, nil
}

// 4. PDF to Image (JPG / PNG)
func (p *PopplerEngine) pdfToImage(ctx context.Context, req ConversionJobRequest, formatFlag, mimeType, ext string) (*ConversionResult, error) {
	inPath := req.InputPaths[0]
	prefix := filepath.Join(req.OutputDir, "page")

	// Default: HD Print Quality (300 DPI)
	dpi := 300
	if req.Options != nil {
		if d, ok := req.Options["dpi"].(float64); ok && d > 0 {
			dpi = int(d)
		} else if d, ok := req.Options["dpi"].(int); ok && d > 0 {
			dpi = d
		}
	}

	args := []string{
		fmt.Sprintf("-%s", formatFlag),
		"-r", strconv.Itoa(dpi),
	}

	// For JPEG, configure crisp quality (default 95%)
	if formatFlag == "jpeg" {
		jpegQuality := 95
		if req.Options != nil {
			if q, ok := req.Options["jpegQuality"].(float64); ok && q > 0 {
				jpegQuality = int(q)
			} else if q, ok := req.Options["jpegQuality"].(int); ok && q > 0 {
				jpegQuality = q
			}
		}
		args = append(args, "-jpegopt", fmt.Sprintf("quality=%d", jpegQuality))
	}

	args = append(args, inPath, prefix)

	bin := p.resolveBinary("pdftoppm")
	if err := p.executeCommand(ctx, req.OutputDir, bin, args...); err != nil {
		return nil, err
	}

	matches, _ := filepath.Glob(filepath.Join(req.OutputDir, "page-*"+ext))
	if len(matches) == 0 {
		return nil, fmt.Errorf("no rendered images were generated")
	}

	return &ConversionResult{
		OutputPaths: matches,
		PrimaryPath: matches[0],
		MimeType:    mimeType,
		IsArchive:   len(matches) > 1,
	}, nil
}

// 5. PDF to Text
func (p *PopplerEngine) pdfToText(ctx context.Context, req ConversionJobRequest) (*ConversionResult, error) {
	inPath := req.InputPaths[0]
	outPath := filepath.Join(req.OutputDir, "document.txt")

	args := []string{inPath, outPath}
	bin := p.resolveBinary("pdftotext")
	if err := p.executeCommand(ctx, req.OutputDir, bin, args...); err != nil {
		return nil, err
	}

	return &ConversionResult{
		OutputPaths: []string{outPath},
		PrimaryPath: outPath,
		MimeType:    "text/plain; charset=utf-8",
		IsArchive:   false,
	}, nil
}

// 5b. PDF to Markdown (.md)
func (p *PopplerEngine) pdfToMarkdown(ctx context.Context, req ConversionJobRequest) (*ConversionResult, error) {
	inPath := req.InputPaths[0]
	tempTxt := filepath.Join(req.OutputDir, "temp_extracted.txt")
	outPath := filepath.Join(req.OutputDir, "document.md")

	args := []string{"-layout", inPath, tempTxt}
	bin := p.resolveBinary("pdftotext")
	if err := p.executeCommand(ctx, req.OutputDir, bin, args...); err != nil {
		return nil, err
	}
	defer os.Remove(tempTxt)

	raw, err := os.ReadFile(tempTxt)
	if err != nil {
		return nil, err
	}

	// Format text lines cleanly into Markdown document
	lines := strings.Split(string(raw), "\n")
	var mdLines []string
	for _, l := range lines {
		trimmed := strings.TrimRight(l, " \t\r")
		mdLines = append(mdLines, trimmed)
	}
	content := strings.Join(mdLines, "\n")
	if err := os.WriteFile(outPath, []byte(content), 0644); err != nil {
		return nil, err
	}

	return &ConversionResult{
		OutputPaths: []string{outPath},
		PrimaryPath: outPath,
		MimeType:    "text/markdown; charset=utf-8",
		IsArchive:   false,
	}, nil
}

// 6. PDF to HTML
func (p *PopplerEngine) pdfToHtml(ctx context.Context, req ConversionJobRequest) (*ConversionResult, error) {
	inPath := req.InputPaths[0]
	outPath := filepath.Join(req.OutputDir, "document.html")

	args := []string{"-noframes", inPath, outPath}
	bin := p.resolveBinary("pdftohtml")
	if err := p.executeCommand(ctx, req.OutputDir, bin, args...); err != nil {
		return nil, err
	}

	return &ConversionResult{
		OutputPaths: []string{outPath},
		PrimaryPath: outPath,
		MimeType:    "text/html; charset=utf-8",
		IsArchive:   false,
	}, nil
}

// 7. Extract Images
func (p *PopplerEngine) extractImages(ctx context.Context, req ConversionJobRequest) (*ConversionResult, error) {
	inPath := req.InputPaths[0]
	prefix := filepath.Join(req.OutputDir, "extracted_img")

	args := []string{"-png", inPath, prefix}
	bin := p.resolveBinary("pdfimages")
	if err := p.executeCommand(ctx, req.OutputDir, bin, args...); err != nil {
		return nil, err
	}

	matches, _ := filepath.Glob(filepath.Join(req.OutputDir, "extracted_img-*.png"))
	if len(matches) == 0 {
		return nil, fmt.Errorf("no embedded images found in document")
	}

	return &ConversionResult{
		OutputPaths: matches,
		PrimaryPath: matches[0],
		MimeType:    "image/png",
		IsArchive:   len(matches) > 1,
	}, nil
}

// 8. Convert Image Formats (JPG <-> PNG via Go Standard Library)
func (p *PopplerEngine) convertImageFormats(req ConversionJobRequest, targetFormat, mimeType, ext string) (*ConversionResult, error) {
	var outputs []string
	for i, inPath := range req.InputPaths {
		inFile, err := os.Open(inPath)
		if err != nil {
			return nil, err
		}

		img, _, err := image.Decode(inFile)
		inFile.Close()
		if err != nil {
			return nil, fmt.Errorf("gagal membaca berkas gambar %s: %w", filepath.Base(inPath), err)
		}

		baseName := strings.TrimSuffix(filepath.Base(inPath), filepath.Ext(inPath))
		outFileName := fmt.Sprintf("%s%s", baseName, ext)
		if len(req.InputPaths) > 1 {
			outFileName = fmt.Sprintf("converted_%d_%s%s", i+1, baseName, ext)
		}
		outPath := filepath.Join(req.OutputDir, outFileName)

		outFile, err := os.Create(outPath)
		if err != nil {
			return nil, err
		}

		if targetFormat == "png" {
			err = png.Encode(outFile, img)
		} else {
			err = jpeg.Encode(outFile, img, &jpeg.Options{Quality: 95})
		}
		outFile.Close()
		if err != nil {
			return nil, fmt.Errorf("gagal mengekspor gambar ke format %s: %w", targetFormat, err)
		}

		outputs = append(outputs, outPath)
	}

	return &ConversionResult{
		OutputPaths: outputs,
		PrimaryPath: outputs[0],
		MimeType:    mimeType,
		IsArchive:   len(outputs) > 1,
	}, nil
}

// 9. Images to PDF (via LibreOffice Headless & Poppler pdfunite)
func (p *PopplerEngine) imagesToPDF(ctx context.Context, req ConversionJobRequest) (*ConversionResult, error) {
	var intermediatePDFs []string
	libreBin := "libreoffice"

	for i, inPath := range req.InputPaths {
		args := []string{
			"--headless",
			"--convert-to", "pdf",
			"--outdir", req.OutputDir,
			inPath,
		}

		if err := p.executeCommand(ctx, req.OutputDir, libreBin, args...); err != nil {
			return nil, err
		}

		baseName := strings.TrimSuffix(filepath.Base(inPath), filepath.Ext(inPath))
		pdfPath := filepath.Join(req.OutputDir, fmt.Sprintf("%s.pdf", baseName))
		if _, err := os.Stat(pdfPath); err == nil {
			intermediatePDFs = append(intermediatePDFs, pdfPath)
		} else {
			matches, _ := filepath.Glob(filepath.Join(req.OutputDir, "*.pdf"))
			if len(matches) > i {
				intermediatePDFs = append(intermediatePDFs, matches[i])
			}
		}
	}

	if len(intermediatePDFs) == 0 {
		return nil, fmt.Errorf("gagal mengonversi gambar menjadi PDF")
	}

	if len(intermediatePDFs) == 1 {
		return &ConversionResult{
			OutputPaths: intermediatePDFs,
			PrimaryPath: intermediatePDFs[0],
			MimeType:    "application/pdf",
			IsArchive:   false,
		}, nil
	}

	// Merge multiple image PDFs into one
	finalMerged := filepath.Join(req.OutputDir, "images_merged.pdf")
	mergeArgs := append([]string{}, intermediatePDFs...)
	mergeArgs = append(mergeArgs, finalMerged)
	bin := p.resolveBinary("pdfunite")
	if err := p.executeCommand(ctx, req.OutputDir, bin, mergeArgs...); err != nil {
		return nil, err
	}

	return &ConversionResult{
		OutputPaths: []string{finalMerged},
		PrimaryPath: finalMerged,
		MimeType:    "application/pdf",
		IsArchive:   false,
	}, nil
}

// 10. Office Documents to PDF (via LibreOffice Headless)
func (p *PopplerEngine) officeToPDF(ctx context.Context, req ConversionJobRequest) (*ConversionResult, error) {
	var outputs []string
	libreBin := "libreoffice"

	for _, inPath := range req.InputPaths {
		args := []string{
			"--headless",
			"--convert-to", "pdf",
			"--outdir", req.OutputDir,
			inPath,
		}

		if err := p.executeCommand(ctx, req.OutputDir, libreBin, args...); err != nil {
			return nil, err
		}

		baseName := strings.TrimSuffix(filepath.Base(inPath), filepath.Ext(inPath))
		expectedPDF := filepath.Join(req.OutputDir, fmt.Sprintf("%s.pdf", baseName))

		if _, err := os.Stat(expectedPDF); err == nil {
			outputs = append(outputs, expectedPDF)
		} else {
			matches, _ := filepath.Glob(filepath.Join(req.OutputDir, "*.pdf"))
			if len(matches) > 0 {
				outputs = append(outputs, matches[len(matches)-1])
			}
		}
	}

	if len(outputs) == 0 {
		return nil, fmt.Errorf("konversi dokumen Office tidak menghasilkan berkas PDF")
	}

	return &ConversionResult{
		OutputPaths: outputs,
		PrimaryPath: outputs[0],
		MimeType:    "application/pdf",
		IsArchive:   len(outputs) > 1,
	}, nil
}

// 11. Image to WebP (via Google cwebp CLI)
func (p *PopplerEngine) imageToWebP(ctx context.Context, req ConversionJobRequest) (*ConversionResult, error) {
	var outputs []string
	cwebpBin := "cwebp"

	quality := 85
	if req.Options != nil {
		if q, ok := req.Options["quality"].(int); ok && q > 0 {
			quality = q
		}
	}

	for i, inPath := range req.InputPaths {
		baseName := strings.TrimSuffix(filepath.Base(inPath), filepath.Ext(inPath))
		outFileName := fmt.Sprintf("%s.webp", baseName)
		if len(req.InputPaths) > 1 {
			outFileName = fmt.Sprintf("converted_%d_%s.webp", i+1, baseName)
		}
		outPath := filepath.Join(req.OutputDir, outFileName)

		args := []string{
			"-q", strconv.Itoa(quality),
			inPath,
			"-o", outPath,
		}

		if err := p.executeCommand(ctx, req.OutputDir, cwebpBin, args...); err != nil {
			return nil, err
		}

		outputs = append(outputs, outPath)
	}

	return &ConversionResult{
		OutputPaths: outputs,
		PrimaryPath: outputs[0],
		MimeType:    "image/webp",
		IsArchive:   len(outputs) > 1,
	}, nil
}

// 12. WebP to JPG / PNG (via Google dwebp CLI)
func (p *PopplerEngine) webpToFormat(ctx context.Context, req ConversionJobRequest, format, mimeType, ext string) (*ConversionResult, error) {
	var outputs []string
	dwebpBin := "dwebp"

	for i, inPath := range req.InputPaths {
		baseName := strings.TrimSuffix(filepath.Base(inPath), filepath.Ext(inPath))
		outFileName := fmt.Sprintf("%s%s", baseName, ext)
		if len(req.InputPaths) > 1 {
			outFileName = fmt.Sprintf("converted_%d_%s%s", i+1, baseName, ext)
		}
		outPath := filepath.Join(req.OutputDir, outFileName)

		if format == "png" {
			args := []string{inPath, "-o", outPath}
			if err := p.executeCommand(ctx, req.OutputDir, dwebpBin, args...); err != nil {
				return nil, err
			}
			outputs = append(outputs, outPath)
			continue
		}

		// Convert WebP -> temp PNG -> JPEG via Go stdlib
		tempPNG := filepath.Join(req.OutputDir, fmt.Sprintf("temp_%d.png", i))
		if err := p.executeCommand(ctx, req.OutputDir, dwebpBin, inPath, "-o", tempPNG); err != nil {
			return nil, err
		}
		defer os.Remove(tempPNG)

		pngFile, err := os.Open(tempPNG)
		if err != nil {
			return nil, err
		}
		img, _, err := image.Decode(pngFile)
		pngFile.Close()
		if err != nil {
			return nil, err
		}

		outFile, err := os.Create(outPath)
		if err != nil {
			return nil, err
		}
		err = jpeg.Encode(outFile, img, &jpeg.Options{Quality: 95})
		outFile.Close()
		if err != nil {
			return nil, err
		}

		outputs = append(outputs, outPath)
	}

	return &ConversionResult{
		OutputPaths: outputs,
		PrimaryPath: outputs[0],
		MimeType:    mimeType,
		IsArchive:   len(outputs) > 1,
	}, nil
}
