package validator

import (
	"bytes"
	"errors"
	"io"
	"path/filepath"
	"strings"
)

const (
	MaxPDFImageSizeBytes = 10 * 1024 * 1024 // 10 MB limit
	MaxOfficeSizeBytes    = 10 * 1024 * 1024 // 10 MB limit
)

var (
	ErrFileTooLarge      = errors.New("file size exceeds maximum allowed limit")
	ErrUnsupportedFormat = errors.New("unsupported or corrupted file format")
	ErrInvalidFileName   = errors.New("invalid file name")
)

type FileType string

const (
	FileTypePDF     FileType = "pdf"
	FileTypeJPEG    FileType = "jpeg"
	FileTypePNG     FileType = "png"
	FileTypeWebP    FileType = "webp"
	FileTypeOffice  FileType = "office"
	FileTypeText    FileType = "text"
	FileTypeUnknown FileType = "unknown"
)

// isPlainText checks whether the header bytes contain printable text / ASCII / UTF-8
func isPlainText(data []byte) bool {
	if len(data) == 0 {
		return false
	}
	for _, b := range data {
		if b < 0x09 || (b > 0x0D && b < 0x20 && b != 0x1B) {
			return false
		}
	}
	return true
}

// SniffFileType inspects the first 512 bytes for genuine magic bytes
func SniffFileType(header []byte) FileType {
	if len(header) < 4 {
		return FileTypeUnknown
	}

	// PDF: %PDF-
	if bytes.HasPrefix(header, []byte("%PDF-")) {
		return FileTypePDF
	}

	// JPEG: FF D8 FF
	if len(header) >= 3 && header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF {
		return FileTypeJPEG
	}

	// PNG: 89 50 4E 47 0D 0A 1A 0A
	if bytes.HasPrefix(header, []byte("\x89PNG\r\n\x1a\n")) {
		return FileTypePNG
	}

	// WebP: RIFF....WEBP
	if len(header) >= 12 && bytes.HasPrefix(header, []byte("RIFF")) && bytes.Equal(header[8:12], []byte("WEBP")) {
		return FileTypeWebP
	}

	// Office OOXML (DOCX, XLSX, PPTX) / ODF: starts with PK\x03\x04 (ZIP signature)
	if bytes.HasPrefix(header, []byte("PK\x03\x04")) {
		return FileTypeOffice
	}

	// Plain text
	if isPlainText(header) {
		return FileTypeText
	}

	return FileTypeUnknown
}

// ValidateFileHeader validates size and magic byte signatures
func ValidateFileHeader(r io.Reader, reportedSize int64, expectedAction string) (FileType, []byte, error) {
	// 1. Initial size boundary check
	if reportedSize > MaxPDFImageSizeBytes {
		return FileTypeUnknown, nil, ErrFileTooLarge
	}

	// 2. Read first 512 bytes for sniffing
	header := make([]byte, 512)
	n, err := io.ReadFull(r, header)
	if err != nil && err != io.EOF && err != io.ErrUnexpectedEOF {
		return FileTypeUnknown, nil, err
	}
	header = header[:n]

	detected := SniffFileType(header)
	if detected == FileTypeUnknown {
		return FileTypeUnknown, nil, ErrUnsupportedFormat
	}

	// 3. Action-specific constraints
	normAction := strings.ToLower(strings.ReplaceAll(expectedAction, "_", "-"))
	switch {
	case normAction == "compress-pdf" || strings.HasPrefix(normAction, "pdf-to-") || strings.HasPrefix(normAction, "merge") || strings.HasPrefix(normAction, "split") || strings.HasPrefix(normAction, "extract-"):
		if detected != FileTypePDF {
			return detected, nil, errors.New("aksi ini membutuhkan dokumen PDF yang valid")
		}
	case normAction == "jpg-to-pdf" || normAction == "png-to-pdf" || normAction == "image-to-pdf":
		if detected != FileTypeJPEG && detected != FileTypePNG && detected != FileTypeWebP {
			return detected, nil, errors.New("aksi ini membutuhkan berkas gambar yang valid (JPG, PNG, atau WebP)")
		}
	case normAction == "jpg-to-png":
		if detected != FileTypeJPEG {
			return detected, nil, errors.New("aksi ini membutuhkan berkas gambar JPG/JPEG yang valid")
		}
	case normAction == "png-to-jpg":
		if detected != FileTypePNG {
			return detected, nil, errors.New("aksi ini membutuhkan berkas gambar PNG yang valid")
		}
	case normAction == "image-to-webp" || normAction == "img-to-webp" || normAction == "compress-image":
		if detected != FileTypeJPEG && detected != FileTypePNG && detected != FileTypeWebP {
			return detected, nil, errors.New("aksi ini membutuhkan berkas gambar (JPG, PNG, atau WebP)")
		}
	case normAction == "webp-to-jpg" || normAction == "webp-to-png":
		if detected != FileTypeWebP {
			return detected, nil, errors.New("aksi ini membutuhkan gambar berformat WebP")
		}
	case strings.HasSuffix(normAction, "-to-pdf") && (strings.HasPrefix(normAction, "docx") || strings.HasPrefix(normAction, "pptx") || strings.HasPrefix(normAction, "xlsx") || strings.HasPrefix(normAction, "odt") || strings.HasPrefix(normAction, "doc") || strings.HasPrefix(normAction, "ppt") || strings.HasPrefix(normAction, "xls")):
		if detected != FileTypeOffice {
			return detected, nil, errors.New("aksi ini membutuhkan berkas dokumen Office yang valid (DOCX, PPTX, XLSX, ODT)")
		}
	case normAction == "txt-to-pdf":
		if detected != FileTypeText {
			return detected, nil, errors.New("aksi ini membutuhkan berkas teks (.txt)")
		}
	}

	return detected, header, nil
}

// SanitizeFilename prevents path traversal and returns safe base name
func SanitizeFilename(rawName string) string {
	base := filepath.Base(rawName)
	base = strings.ReplaceAll(base, "..", "")
	base = strings.ReplaceAll(base, "/", "")
	base = strings.ReplaceAll(base, "\\", "")
	base = strings.TrimSpace(base)
	if base == "" || base == "." {
		return "unnamed_file"
	}
	return base
}
