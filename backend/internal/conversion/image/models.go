package image

import "time"

type Format string

const (
	FormatJPEG Format = "jpeg"
	FormatPNG  Format = "png"
	FormatWebP Format = "webp"
	FormatAVIF Format = "avif"
	FormatAuto Format = "auto"
)

type QualityStrategy string

const (
	StrategyBalanced   QualityStrategy = "balanced"
	StrategyAggressive QualityStrategy = "aggressive"
	StrategyVisualHQ   QualityStrategy = "visual_hq"
)

type ImageInfo struct {
	Filename    string `json:"filename,omitempty"`
	Format      Format `json:"format"`
	Size        int64  `json:"size"`
	Width       int    `json:"width"`
	Height      int    `json:"height"`
	HasAlpha    bool   `json:"has_alpha"`
	Orientation int    `json:"orientation"`
}

type TargetSizeConfig struct {
	Value int64  `json:"value"` // e.g. 300
	Unit  string `json:"unit"`  // "KB" or "MB"
}

func (t TargetSizeConfig) InBytes() int64 {
	if t.Unit == "MB" || t.Unit == "mb" {
		return t.Value * 1024 * 1024
	}
	return t.Value * 1024
}

type OptimizeRequest struct {
	Mode                string            `json:"mode"`                  // "smart", "manual", "target_size"
	OutputFormat        Format            `json:"output_format"`         // "auto", "jpeg", "png", "webp", "avif"
	TargetSize          *TargetSizeConfig `json:"target_size,omitempty"` // optional target size
	Quality             int               `json:"quality,omitempty"`     // 1-100 (defaults by strategy)
	MaxWidth            int               `json:"max_width,omitempty"`
	MaxHeight           int               `json:"max_height,omitempty"`
	MaintainAspectRatio bool              `json:"maintain_aspect_ratio"`
	RemoveMetadata      bool              `json:"remove_metadata"`
	QualityStrategy     QualityStrategy   `json:"quality_strategy,omitempty"`
}

type OptimizeResult struct {
	Status           string    `json:"status"` // "completed", "failed"
	Original         ImageInfo `json:"original"`
	Optimized        ImageInfo `json:"optimized"`
	ReductionPercent float64   `json:"reduction_percent"`
	SavedBytes       int64     `json:"saved_bytes"`
	TargetReached    bool      `json:"target_reached"`
	OutputPath       string    `json:"-"`
	MimeType         string    `json:"-"`
	DownloadURL      string    `json:"download_url"`
	PreviewURL       string    `json:"preview_url,omitempty"`
	ErrorMessage     string    `json:"error_message,omitempty"`
}

type BatchOptimizeResult struct {
	JobID         string            `json:"job_id"`
	Status        string            `json:"status"`
	TotalOriginal int64             `json:"total_original_bytes"`
	TotalOptimized int64            `json:"total_optimized_bytes"`
	TotalSaved    int64             `json:"total_saved_bytes"`
	TotalReduction float64          `json:"total_reduction_percent"`
	Items         []OptimizeResult  `json:"items"`
	ZipDownloadURL string           `json:"zip_download_url,omitempty"`
	CreatedAt     time.Time         `json:"created_at"`
}
