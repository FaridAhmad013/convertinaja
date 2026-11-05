package image

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/rs/zerolog/log"
)

var (
	ErrEngineNotFound   = errors.New("libvips CLI binary not found")
	ErrExecutionFailed  = errors.New("libvips execution failed")
	ErrUnsupportedCodec = errors.New("unsupported image format codec")
)

type EncodeOptions struct {
	Quality        int  // 1-100
	StripMetadata  bool // strip EXIF/IPTC/XMP
	OptimizeCoding bool // optimize huffman tables for JPEG
	Lossless       bool // for WebP/PNG
}

type VipsEncoder struct {
	vipsBin      string
	thumbnailBin string
	hasVips      bool
}

func NewVipsEncoder() *VipsEncoder {
	vipsPath, errVips := exec.LookPath("vips")
	thumbPath, errThumb := exec.LookPath("vipsthumbnail")

	hasVips := errVips == nil && errThumb == nil
	if hasVips {
		log.Info().Str("vips", vipsPath).Str("vipsthumbnail", thumbPath).Msg("libvips CLI binaries detected and initialized")
	} else {
		log.Warn().Msg("libvips CLI binaries not found in PATH; falling back to Go native fallback where applicable")
	}

	return &VipsEncoder{
		vipsBin:      vipsPath,
		thumbnailBin: thumbPath,
		hasVips:      hasVips,
	}
}

func (e *VipsEncoder) HasVips() bool {
	return e.hasVips
}

// Convert formats or applies compression quality + metadata strip
func (e *VipsEncoder) Convert(ctx context.Context, inputPath, outputPath string, targetFormat Format, opts EncodeOptions) error {
	if e.hasVips {
		return e.convertWithVips(ctx, inputPath, outputPath, targetFormat, opts)
	}
	// ponytail: native fallback covers JPEG/PNG for local dev environments lacking libvips; upgrade to vips CLI in production container
	return e.convertNativeFallback(inputPath, outputPath, targetFormat, opts)
}

// Resize resizes image to bounding box (maxW x maxH) maintaining aspect ratio
func (e *VipsEncoder) Resize(ctx context.Context, inputPath, outputPath string, targetFormat Format, maxW, maxH int, opts EncodeOptions) error {
	if e.hasVips {
		return e.resizeWithVipsThumbnail(ctx, inputPath, outputPath, targetFormat, maxW, maxH, opts)
	}
	// ponytail: native fallback for basic dev environments
	return e.resizeNativeFallback(inputPath, outputPath, targetFormat, maxW, maxH, opts)
}

func (e *VipsEncoder) buildVipsTargetSpec(outputPath string, format Format, opts EncodeOptions) string {
	var params []string

	q := opts.Quality
	if q <= 0 {
		q = 80
	} else if q > 100 {
		q = 100
	}

	switch format {
	case FormatJPEG:
		params = append(params, fmt.Sprintf("Q=%d", q))
		if opts.StripMetadata {
			params = append(params, "strip=true")
		}
		if opts.OptimizeCoding {
			params = append(params, "optimize_coding=true")
		}
	case FormatWebP:
		if opts.Lossless {
			params = append(params, "lossless=true")
		} else {
			params = append(params, fmt.Sprintf("Q=%d", q))
		}
		if opts.StripMetadata {
			params = append(params, "strip=true")
		}
		params = append(params, "effort=4")
	case FormatPNG:
		// PNG is lossless compression level 0-9
		comp := 6
		if q < 60 {
			comp = 9
		}
		params = append(params, fmt.Sprintf("compression=%d", comp))
		if opts.StripMetadata {
			params = append(params, "strip=true")
		}
	case FormatAVIF:
		// AVIF Q scale
		params = append(params, fmt.Sprintf("Q=%d", q))
		if opts.StripMetadata {
			params = append(params, "strip=true")
		}
		params = append(params, "effort=4")
	default:
		if opts.StripMetadata {
			params = append(params, "strip=true")
		}
	}

	if len(params) == 0 {
		return outputPath
	}
	return fmt.Sprintf("%s[%s]", outputPath, strings.Join(params, ","))
}

func (e *VipsEncoder) convertWithVips(ctx context.Context, inputPath, outputPath string, targetFormat Format, opts EncodeOptions) error {
	targetSpec := e.buildVipsTargetSpec(outputPath, targetFormat, opts)

	execCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	cmd := exec.CommandContext(execCtx, e.vipsBin, "copy", inputPath, targetSpec)
	cmd.Env = append(os.Environ(), "VIPS_CONCURRENCY=2", "VIPS_DISC_THRESHOLD=50m")

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		log.Error().Err(err).Str("stderr", stderr.String()).Str("target", targetSpec).Msg("vips copy execution failed")
		return fmt.Errorf("%w: %s", ErrExecutionFailed, strings.TrimSpace(stderr.String()))
	}

	return nil
}

func (e *VipsEncoder) resizeWithVipsThumbnail(ctx context.Context, inputPath, outputPath string, targetFormat Format, maxW, maxH int, opts EncodeOptions) error {
	targetSpec := e.buildVipsTargetSpec(outputPath, targetFormat, opts)

	execCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	sizeParam := fmt.Sprintf("%dx%d", maxW, maxH)
	if maxH <= 0 {
		sizeParam = strconv.Itoa(maxW)
	}

	// vipsthumbnail input.jpg --size 1920x1080 --auto-rotate -o output.webp[Q=80,strip=true]
	cmd := exec.CommandContext(execCtx, e.thumbnailBin, inputPath, "--size", sizeParam, "--auto-rotate", "-o", targetSpec)
	cmd.Env = append(os.Environ(), "VIPS_CONCURRENCY=2", "VIPS_DISC_THRESHOLD=50m")

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		log.Error().Err(err).Str("stderr", stderr.String()).Str("size", sizeParam).Msg("vipsthumbnail execution failed")
		return fmt.Errorf("%w: %s", ErrExecutionFailed, strings.TrimSpace(stderr.String()))
	}

	return nil
}

// Fallback when libvips is absent on host (e.g. Windows dev without libvips-tools installed)
func (e *VipsEncoder) convertNativeFallback(inputPath, outputPath string, targetFormat Format, opts EncodeOptions) error {
	inF, err := os.Open(inputPath)
	if err != nil {
		return err
	}
	defer inF.Close()

	img, _, err := image.Decode(inF)
	if err != nil {
		return fmt.Errorf("failed to decode image for fallback: %w", err)
	}

	outF, err := os.Create(outputPath)
	if err != nil {
		return err
	}
	defer outF.Close()

	q := opts.Quality
	if q <= 0 {
		q = 80
	}

	switch targetFormat {
	case FormatJPEG:
		return jpeg.Encode(outF, img, &jpeg.Options{Quality: q})
	case FormatPNG:
		return png.Encode(outF, img)
	default:
		// When WebP/AVIF requested in dev environment without libvips, encode as PNG/JPEG with notice
		log.Warn().Str("format", string(targetFormat)).Msg("Format requires libvips in production; using JPEG fallback in dev")
		return jpeg.Encode(outF, img, &jpeg.Options{Quality: q})
	}
}

func (e *VipsEncoder) resizeNativeFallback(inputPath, outputPath string, targetFormat Format, maxW, maxH int, opts EncodeOptions) error {
	inF, err := os.Open(inputPath)
	if err != nil {
		return err
	}
	defer inF.Close()

	src, _, err := image.Decode(inF)
	if err != nil {
		return err
	}

	bounds := src.Bounds()
	srcW := bounds.Dx()
	srcH := bounds.Dy()

	// Aspect ratio maintaining resize calculation
	newW, newH := CalculateTargetDimensions(srcW, srcH, maxW, maxH)
	if newW == srcW && newH == srcH {
		return e.convertNativeFallback(inputPath, outputPath, targetFormat, opts)
	}

	// Nearest-neighbor / bilinear downsample for fallback
	dst := image.NewRGBA(image.Rect(0, 0, newW, newH))
	for y := 0; y < newH; y++ {
		for x := 0; x < newW; x++ {
			srcX := x * srcW / newW
			srcY := y * srcH / newH
			dst.Set(x, y, src.At(bounds.Min.X+srcX, bounds.Min.Y+srcY))
		}
	}

	outF, err := os.Create(outputPath)
	if err != nil {
		return err
	}
	defer outF.Close()

	q := opts.Quality
	if q <= 0 {
		q = 80
	}

	switch targetFormat {
	case FormatPNG:
		return png.Encode(outF, dst)
	default:
		return jpeg.Encode(outF, dst, &jpeg.Options{Quality: q})
	}
}

// CalculateTargetDimensions keeps aspect ratio and prevents upscaling
func CalculateTargetDimensions(origW, origH, maxW, maxH int) (int, int) {
	if origW <= 0 || origH <= 0 {
		return origW, origH
	}
	if maxW <= 0 && maxH <= 0 {
		return origW, origH
	}

	// Prevent accidental upscaling
	if (maxW <= 0 || maxW >= origW) && (maxH <= 0 || maxH >= origH) {
		return origW, origH
	}

	ratioW := float64(maxW) / float64(origW)
	ratioH := float64(maxH) / float64(origH)

	ratio := ratioW
	if maxW <= 0 {
		ratio = ratioH
	} else if maxH > 0 && ratioH < ratioW {
		ratio = ratioH
	}

	targetW := int(float64(origW) * ratio)
	targetH := int(float64(origH) * ratio)

	if targetW < 1 {
		targetW = 1
	}
	if targetH < 1 {
		targetH = 1
	}

	return targetW, targetH
}

func GetExtensionForFormat(f Format) string {
	switch f {
	case FormatJPEG:
		return ".jpg"
	case FormatPNG:
		return ".png"
	case FormatWebP:
		return ".webp"
	case FormatAVIF:
		return ".avif"
	default:
		return ".jpg"
	}
}

func GetMimeTypeForFormat(f Format) string {
	switch f {
	case FormatJPEG:
		return "image/jpeg"
	case FormatPNG:
		return "image/png"
	case FormatWebP:
		return "image/webp"
	case FormatAVIF:
		return "image/avif"
	default:
		return "image/jpeg"
	}
}

func SanitizeJobFileName(baseName string) string {
	base := filepath.Base(baseName)
	ext := filepath.Ext(base)
	clean := strings.TrimSuffix(base, ext)
	clean = strings.ReplaceAll(clean, " ", "_")
	clean = strings.ReplaceAll(clean, "..", "")
	if clean == "" {
		return "optimized"
	}
	return clean
}
