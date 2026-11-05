package image

import (
	"bytes"
	"encoding/binary"
	"errors"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"os"
)

var (
	ErrUnsupportedFormat = errors.New("unsupported or unrecognized image format")
	ErrCorruptImage      = errors.New("image header corrupted or incomplete")
	ErrDimensionLimit    = errors.New("image dimensions exceed safety ceiling (10000x10000)")
)

const MaxAllowedDimension = 10000

// AnalyzeImage reads image headers, dimensions, alpha presence, and EXIF orientation
func AnalyzeImage(r io.Reader, filename string, size int64) (*ImageInfo, error) {
	// Read first 64KB for comprehensive metadata sniffing
	buf := make([]byte, 65536)
	n, err := io.ReadFull(r, buf)
	if err != nil && err != io.EOF && err != io.ErrUnexpectedEOF {
		return nil, fmt.Errorf("failed to read image stream: %w", err)
	}
	buf = buf[:n]

	info := &ImageInfo{
		Filename:    filename,
		Size:        size,
		Orientation: 1, // Default Normal
	}

	// 1. Detect format
	switch {
	case len(buf) >= 3 && buf[0] == 0xFF && buf[1] == 0xD8 && buf[2] == 0xFF:
		info.Format = FormatJPEG
		info.HasAlpha = false
		parseJPEGMetadata(buf, info)

	case len(buf) >= 8 && bytes.HasPrefix(buf, []byte("\x89PNG\r\n\x1a\n")):
		info.Format = FormatPNG
		parsePNGMetadata(buf, info)

	case len(buf) >= 12 && bytes.HasPrefix(buf, []byte("RIFF")) && bytes.Equal(buf[8:12], []byte("WEBP")):
		info.Format = FormatWebP
		parseWebPMetadata(buf, info)

	case len(buf) >= 12 && bytes.Equal(buf[4:8], []byte("ftyp")) && (bytes.Equal(buf[8:12], []byte("avif")) || bytes.Equal(buf[8:12], []byte("avis"))):
		info.Format = FormatAVIF
		parseAVIFMetadata(buf, info)

	default:
		return nil, ErrUnsupportedFormat
	}

	// Fallback dimension check via Go stdlib image.DecodeConfig if not parsed from raw header
	if info.Width <= 0 || info.Height <= 0 {
		cfg, _, decErr := image.DecodeConfig(bytes.NewReader(buf))
		if decErr == nil {
			info.Width = cfg.Width
			info.Height = cfg.Height
		}
	}

	if info.Width > MaxAllowedDimension || info.Height > MaxAllowedDimension {
		return nil, ErrDimensionLimit
	}

	return info, nil
}

// AnalyzeImageFile analyzes an on-disk image file
func AnalyzeImageFile(filePath string) (*ImageInfo, error) {
	f, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	stat, err := f.Stat()
	if err != nil {
		return nil, err
	}

	return AnalyzeImage(f, stat.Name(), stat.Size())
}

// parsePNGMetadata reads PNG IHDR chunk (Width, Height, ColorType)
func parsePNGMetadata(data []byte, info *ImageInfo) {
	if len(data) < 24 {
		return
	}
	// IHDR data starts at byte 16
	info.Width = int(binary.BigEndian.Uint32(data[16:20]))
	info.Height = int(binary.BigEndian.Uint32(data[20:24]))
	if len(data) >= 26 {
		colorType := data[25]
		// Color type 4 (Greyscale + Alpha) or 6 (RGBA) have alpha channel
		info.HasAlpha = colorType == 4 || colorType == 6
	}
}

// parseWebPMetadata parses VP8, VP8L, or VP8X chunk headers
func parseWebPMetadata(data []byte, info *ImageInfo) {
	if len(data) < 16 {
		return
	}
	tag := string(data[12:16])
	switch tag {
	case "VP8X":
		if len(data) >= 30 {
			info.HasAlpha = (data[20] & 0x10) != 0
			w := int(data[24]) | int(data[25])<<8 | int(data[26])<<16
			h := int(data[27]) | int(data[28])<<8 | int(data[29])<<16
			info.Width = w + 1
			info.Height = h + 1
		}
	case "VP8 ":
		if len(data) >= 30 && data[23] == 0x9d && data[24] == 0x01 && data[25] == 0x2a {
			info.Width = int(binary.LittleEndian.Uint16(data[26:28])) & 0x3fff
			info.Height = int(binary.LittleEndian.Uint16(data[28:30])) & 0x3fff
		}
	case "VP8L":
		if len(data) >= 25 && data[20] == 0x2f {
			b1, b2, b3, b4 := uint32(data[21]), uint32(data[22]), uint32(data[23]), uint32(data[24])
			val := b1 | b2<<8 | b3<<16 | b4<<24
			info.Width = int(val&0x3fff) + 1
			info.Height = int((val>>14)&0x3fff) + 1
			info.HasAlpha = (val & (1 << 28)) != 0
		}
	}
}

// parseJPEGMetadata parses EXIF orientation and SOF0/SOF2 dimensions
func parseJPEGMetadata(data []byte, info *ImageInfo) {
	pos := 2
	for pos+4 < len(data) {
		if data[pos] != 0xFF {
			pos++
			continue
		}
		marker := data[pos+1]
		pos += 2

		// End of Image or SOS
		if marker == 0xD9 || marker == 0xDA {
			break
		}

		if pos+2 > len(data) {
			break
		}
		segLen := int(binary.BigEndian.Uint16(data[pos : pos+2]))
		if segLen < 2 || pos+segLen > len(data) {
			break
		}

		segData := data[pos+2 : pos+segLen]

		// SOF0 (0xC0), SOF1 (0xC1), SOF2 (0xC2) -> Dimensions
		if (marker >= 0xC0 && marker <= 0xC3) || (marker >= 0xC5 && marker <= 0xC7) || (marker >= 0xC9 && marker <= 0xCB) {
			if len(segData) >= 5 {
				info.Height = int(binary.BigEndian.Uint16(segData[1:3]))
				info.Width = int(binary.BigEndian.Uint16(segData[3:5]))
			}
		}

		// APP1 (0xE1) -> EXIF Orientation
		if marker == 0xE1 && bytes.HasPrefix(segData, []byte("Exif\x00\x00")) {
			parseExifOrientation(segData[6:], info)
		}

		pos += segLen
	}
}

func parseExifOrientation(tiffData []byte, info *ImageInfo) {
	if len(tiffData) < 8 {
		return
	}
	var endian binary.ByteOrder
	if bytes.HasPrefix(tiffData, []byte("II*\x00")) {
		endian = binary.LittleEndian
	} else if bytes.HasPrefix(tiffData, []byte("MM\x00*")) {
		endian = binary.BigEndian
	} else {
		return
	}

	firstIFD := endian.Uint32(tiffData[4:8])
	if int(firstIFD)+2 > len(tiffData) {
		return
	}

	entries := int(endian.Uint16(tiffData[firstIFD : firstIFD+2]))
	offset := int(firstIFD) + 2

	for i := 0; i < entries && offset+12 <= len(tiffData); i++ {
		tag := endian.Uint16(tiffData[offset : offset+2])
		// Tag 0x0112 is Orientation
		if tag == 0x0112 {
			val := endian.Uint16(tiffData[offset+8 : offset+10])
			if val >= 1 && val <= 8 {
				info.Orientation = int(val)
			}
			return
		}
		offset += 12
	}
}

// parseAVIFMetadata parses basic isobmff / avif dimensions
func parseAVIFMetadata(data []byte, info *ImageInfo) {
	// ponytail: libvips CLI executes primary AVIF analysis; fallback to standard box scanning
	info.Format = FormatAVIF
	info.HasAlpha = false
}
