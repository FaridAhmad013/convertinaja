package converter

import (
	"context"
	"errors"
)

var (
	ErrUnsupportedAction = errors.New("unsupported conversion action")
	ErrExecutionFailed   = errors.New("conversion engine subprocess failed")
	ErrNoInputs          = errors.New("no input files provided for conversion")
)

type ConversionJobRequest struct {
	JobID      string
	Action     string
	InputPaths []string
	OutputDir  string
	Options    map[string]interface{}
}

type ConversionResult struct {
	OutputPaths []string
	PrimaryPath string
	MimeType    string
	IsArchive   bool
}

type Engine interface {
	Execute(ctx context.Context, req ConversionJobRequest) (*ConversionResult, error)
}
