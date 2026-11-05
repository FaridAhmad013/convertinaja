package image

import (
	"context"
	"fmt"
	"math"
	"os"
	"path/filepath"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

type Optimizer struct {
	encoder *VipsEncoder
}

func NewOptimizer(encoder *VipsEncoder) *Optimizer {
	if encoder == nil {
		encoder = NewVipsEncoder()
	}
	return &Optimizer{encoder: encoder}
}

// Optimize executes image optimization based on request mode and options
func (o *Optimizer) Optimize(ctx context.Context, inputPath, outputDir string, req OptimizeRequest) (*OptimizeResult, error) {
	initialInfo, err := AnalyzeImageFile(inputPath)
	if err != nil {
		return nil, fmt.Errorf("failed to analyze input image: %w", err)
	}

	result := &OptimizeResult{
		Status:   "completed",
		Original: *initialInfo,
	}

	// 1. Resolve output format
	targetFormat := o.resolveTargetFormat(initialInfo, req)

	// 2. Resolve dimensions (prevent upscaling, maintain aspect ratio)
	targetW, targetH := o.resolveDimensions(initialInfo, req)

	// 3. Target size optimization vs standard optimization
	if req.TargetSize != nil && req.TargetSize.Value > 0 {
		return o.optimizeForTargetSize(ctx, inputPath, outputDir, initialInfo, targetFormat, targetW, targetH, req)
	}

	// Standard optimization
	quality := o.resolveQuality(targetFormat, req)
	opts := EncodeOptions{
		Quality:        quality,
		StripMetadata:  req.RemoveMetadata,
		OptimizeCoding: true,
	}

	ext := GetExtensionForFormat(targetFormat)
	baseClean := SanitizeJobFileName(initialInfo.Filename)
	outFileName := fmt.Sprintf("%s_opt_%s%s", baseClean, uuid.New().String()[:6], ext)
	outPath := filepath.Join(outputDir, outFileName)

	if targetW < initialInfo.Width || targetH < initialInfo.Height {
		err = o.encoder.Resize(ctx, inputPath, outPath, targetFormat, targetW, targetH, opts)
	} else {
		err = o.encoder.Convert(ctx, inputPath, outPath, targetFormat, opts)
	}

	if err != nil {
		return nil, fmt.Errorf("optimization failed: %w", err)
	}

	// 4. Inspect result
	stat, err := os.Stat(outPath)
	if err != nil {
		return nil, fmt.Errorf("failed to stat optimized output: %w", err)
	}

	optInfo, _ := AnalyzeImageFile(outPath)
	if optInfo == nil {
		optInfo = &ImageInfo{
			Format: targetFormat,
			Width:  targetW,
			Height: targetH,
			Size:   stat.Size(),
		}
	} else {
		optInfo.Size = stat.Size()
	}

	result.Optimized = *optInfo
	result.OutputPath = outPath
	result.MimeType = GetMimeTypeForFormat(targetFormat)
	result.SavedBytes = initialInfo.Size - stat.Size()
	if initialInfo.Size > 0 {
		reduction := (float64(result.SavedBytes) / float64(initialInfo.Size)) * 100
		result.ReductionPercent = math.Round(reduction*100) / 100
	}
	result.TargetReached = true

	return result, nil
}

// resolveTargetFormat picks optimal format based on transparency and user preference
func (o *Optimizer) resolveTargetFormat(info *ImageInfo, req OptimizeRequest) Format {
	if req.OutputFormat != "" && req.OutputFormat != FormatAuto {
		// Rule: Do not convert transparent image to JPEG without transparent handling
		if info.HasAlpha && req.OutputFormat == FormatJPEG {
			log.Warn().Msg("Input has transparency but JPEG requested; transparency will flatten")
		}
		return req.OutputFormat
	}

	// Auto mode
	if info.HasAlpha {
		// Prefer WebP for alpha when engine available, else preserve PNG
		if o.encoder.HasVips() {
			return FormatWebP
		}
		return FormatPNG
	}

	// Photos (opaque)
	if o.encoder.HasVips() {
		return FormatWebP
	}
	return info.Format
}

func (o *Optimizer) resolveDimensions(info *ImageInfo, req OptimizeRequest) (int, int) {
	maxW := req.MaxWidth
	maxH := req.MaxHeight

	// In Smart Optimize mode with no explicit dimensions, downscale ultra-large images > 2560px
	if (req.Mode == "smart" || req.Mode == "") && maxW <= 0 && maxH <= 0 {
		if info.Width > 2560 || info.Height > 2560 {
			maxW = 2560
			maxH = 2560
		}
	}

	return CalculateTargetDimensions(info.Width, info.Height, maxW, maxH)
}

func (o *Optimizer) resolveQuality(format Format, req OptimizeRequest) int {
	if req.Quality > 0 {
		return req.Quality
	}

	switch req.QualityStrategy {
	case StrategyAggressive:
		switch format {
		case FormatJPEG:
			return 70
		case FormatWebP:
			return 68
		case FormatAVIF:
			return 55
		default:
			return 70
		}
	case StrategyVisualHQ:
		switch format {
		case FormatJPEG:
			return 88
		case FormatWebP:
			return 85
		case FormatAVIF:
			return 75
		default:
			return 85
		}
	default: // StrategyBalanced
		switch format {
		case FormatJPEG:
			return 80
		case FormatWebP:
			return 80
		case FormatAVIF:
			return 65
		default:
			return 80
		}
	}
}

// optimizeForTargetSize conducts bounded candidate search for target byte size
func (o *Optimizer) optimizeForTargetSize(ctx context.Context, inputPath, outputDir string, initialInfo *ImageInfo, targetFormat Format, baseW, baseH int, req OptimizeRequest) (*OptimizeResult, error) {
	targetBytes := req.TargetSize.InBytes()
	result := &OptimizeResult{
		Status:   "completed",
		Original: *initialInfo,
	}

	ext := GetExtensionForFormat(targetFormat)
	baseClean := SanitizeJobFileName(initialInfo.Filename)

	// Step 1: If original is already <= target size, strip metadata only
	if initialInfo.Size <= targetBytes {
		outFileName := fmt.Sprintf("%s_target_%s%s", baseClean, uuid.New().String()[:6], ext)
		outPath := filepath.Join(outputDir, outFileName)
		_ = o.encoder.Convert(ctx, inputPath, outPath, targetFormat, EncodeOptions{
			Quality:       85,
			StripMetadata: true,
		})
		stat, _ := os.Stat(outPath)
		result.OutputPath = outPath
		result.MimeType = GetMimeTypeForFormat(targetFormat)
		result.Optimized = *initialInfo
		if stat != nil {
			result.Optimized.Size = stat.Size()
		}
		result.SavedBytes = initialInfo.Size - result.Optimized.Size
		result.ReductionPercent = 0
		result.TargetReached = true
		return result, nil
	}

	// Step 2: Bounded candidates (Quality search + gradual downscale if required)
	// Try up to 4 candidates to keep CPU efficient
	type candidateSpec struct {
		w       int
		h       int
		quality int
	}

	specs := []candidateSpec{
		{w: baseW, h: baseH, quality: 80},
		{w: baseW, h: baseH, quality: 65},
		{w: baseW, h: baseH, quality: 48},
	}

	// If large dimension, add moderate resolution downscale candidate
	if baseW > 1600 || baseH > 1600 {
		downW, downH := CalculateTargetDimensions(baseW, baseH, 1600, 1600)
		specs = append(specs, candidateSpec{w: downW, h: downH, quality: 68})
	}
	if baseW > 1280 || baseH > 1280 {
		downW, downH := CalculateTargetDimensions(baseW, baseH, 1280, 1280)
		specs = append(specs, candidateSpec{w: downW, h: downH, quality: 60})
	}

	var bestPath string
	var bestSize int64 = math.MaxInt64
	var bestInfo *ImageInfo
	targetHit := false

	var tempFiles []string
	defer func() {
		for _, tf := range tempFiles {
			if tf != bestPath {
				_ = os.Remove(tf)
			}
		}
	}()

	for _, spec := range specs {
		candidateFile := fmt.Sprintf("%s_c%d_%s%s", baseClean, spec.quality, uuid.New().String()[:6], ext)
		candidatePath := filepath.Join(outputDir, candidateFile)
		tempFiles = append(tempFiles, candidatePath)

		opts := EncodeOptions{
			Quality:        spec.quality,
			StripMetadata:  true,
			OptimizeCoding: true,
		}

		var runErr error
		if spec.w < initialInfo.Width || spec.h < initialInfo.Height {
			runErr = o.encoder.Resize(ctx, inputPath, candidatePath, targetFormat, spec.w, spec.h, opts)
		} else {
			runErr = o.encoder.Convert(ctx, inputPath, candidatePath, targetFormat, opts)
		}

		if runErr != nil {
			continue
		}

		st, stErr := os.Stat(candidatePath)
		if stErr != nil {
			continue
		}

		curSize := st.Size()
		if curSize <= targetBytes {
			// Found candidate under target! Keep the highest quality one that fits
			bestPath = candidatePath
			bestSize = curSize
			bestInfo = &ImageInfo{
				Format:   targetFormat,
				Width:    spec.w,
				Height:   spec.h,
				Size:     curSize,
				HasAlpha: initialInfo.HasAlpha,
			}
			targetHit = true
			break
		}

		// Track smallest candidate so far as fallback
		if curSize < bestSize {
			bestSize = curSize
			bestPath = candidatePath
			bestInfo = &ImageInfo{
				Format:   targetFormat,
				Width:    spec.w,
				Height:   spec.h,
				Size:     curSize,
				HasAlpha: initialInfo.HasAlpha,
			}
		}
	}

	if bestPath == "" {
		return nil, fmt.Errorf("unable to generate valid optimization candidate")
	}

	result.OutputPath = bestPath
	result.MimeType = GetMimeTypeForFormat(targetFormat)
	result.Optimized = *bestInfo
	result.SavedBytes = initialInfo.Size - bestSize
	if initialInfo.Size > 0 {
		reduction := (float64(result.SavedBytes) / float64(initialInfo.Size)) * 100
		result.ReductionPercent = math.Round(reduction*100) / 100
	}
	result.TargetReached = targetHit

	return result, nil
}
