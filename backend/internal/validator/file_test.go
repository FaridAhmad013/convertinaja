package validator

import (
	"bytes"
	"testing"
)

func TestSniffFileType(t *testing.T) {
	pdfHeader := []byte("%PDF-1.7\r\n...")
	if SniffFileType(pdfHeader) != FileTypePDF {
		t.Fatalf("expected PDF, got %v", SniffFileType(pdfHeader))
	}

	pngHeader := []byte("\x89PNG\r\n\x1a\n\x00\x00")
	if SniffFileType(pngHeader) != FileTypePNG {
		t.Fatalf("expected PNG, got %v", SniffFileType(pngHeader))
	}

	jpegHeader := []byte{0xFF, 0xD8, 0xFF, 0xE0}
	if SniffFileType(jpegHeader) != FileTypeJPEG {
		t.Fatalf("expected JPEG, got %v", SniffFileType(jpegHeader))
	}

	fakeHeader := []byte("plain text content")
	if SniffFileType(fakeHeader) != FileTypeUnknown {
		t.Fatalf("expected Unknown for plain text, got %v", SniffFileType(fakeHeader))
	}
}

func TestSanitizeFilename(t *testing.T) {
	cases := []struct {
		input    string
		expected string
	}{
		{"../../etc/passwd", "passwd"},
		{"report.pdf", "report.pdf"},
		{"..\\..\\windows\\system32\\cmd.exe", "cmd.exe"},
		{"   ", "unnamed_file"},
	}

	for _, c := range cases {
		got := SanitizeFilename(c.input)
		if got != c.expected {
			t.Errorf("SanitizeFilename(%q) = %q, expected %q", c.input, got, c.expected)
		}
	}
}

func TestValidateFileHeader(t *testing.T) {
	validPDF := bytes.NewReader([]byte("%PDF-1.4\n1 0 obj..."))
	detected, _, err := ValidateFileHeader(validPDF, 1024, "merge")
	if err != nil || detected != FileTypePDF {
		t.Fatalf("expected valid PDF, got detected=%s, err=%v", detected, err)
	}

	oversized := bytes.NewReader([]byte("%PDF-1.4"))
	_, _, err = ValidateFileHeader(oversized, MaxPDFImageSizeBytes+1, "merge")
	if err != ErrFileTooLarge {
		t.Fatalf("expected ErrFileTooLarge, got %v", err)
	}
}
