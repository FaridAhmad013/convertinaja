package validator

import (
	"bytes"
	"errors"
	"io"
	"path/filepath"
	"strings"
)

const (
	MaxPDFImageSizeBytes = 50 * 1024 * 1024 // 50 MB
	MaxOfficeSizeBytes    = 30 * 1024 * 1024 // 30 MB
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
	FileTypeUnknown FileType = "unknown"
)

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
	if strings.HasPrefix(expectedAction, "merge") ||
		strings.HasPrefix(expectedAction, "split") ||
		strings.HasPrefix(expectedAction, "compress") ||
		strings.HasPrefix(expectedAction, "pdf_to") ||
		strings.HasPrefix(expectedAction, "pdf-to") ||
		strings.HasPrefix(expectedAction, "extract_") ||
		strings.HasPrefix(expectedAction, "extract-") {
		if detected != FileTypePDF {
			return detected, nil, errors.New("action requires valid PDF document")
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
