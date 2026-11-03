package converter

import (
	"bytes"
	"context"
	"fmt"
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
