package converter

import (
	"context"
	"errors"
	"testing"
)

func TestAllCatalogActionsAreSupported(t *testing.T) {
	engine := NewPopplerEngine("", "")

	actions := []string{
		"merge-pdf",
		"split-pdf",
		"compress-pdf",
		"pdf-to-jpg",
		"pdf-to-png",
		"pdf-to-txt",
		"pdf-to-md",
		"pdf-to-html",
		"extract-pdf-images",
		"jpg-to-pdf",
		"png-to-pdf",
		"jpg-to-png",
		"png-to-jpg",
		"image-to-webp",
		"img-to-webp",
		"webp-to-jpg",
		"webp-to-png",
		"docx-to-pdf",
		"xlsx-to-pdf",
		"pptx-to-pdf",
		"odt-to-pdf",
		"txt-to-pdf",
	}

	for _, action := range actions {
		t.Run(action, func(t *testing.T) {
			req := ConversionJobRequest{
				Action:     action,
				InputPaths: []string{"dummy.input"},
				OutputDir:  t.TempDir(),
			}

			_, err := engine.Execute(context.Background(), req)
			if errors.Is(err, ErrUnsupportedAction) {
				t.Fatalf("Engine reported ErrUnsupportedAction for valid catalog action: %s", action)
			}
		})
	}
}
