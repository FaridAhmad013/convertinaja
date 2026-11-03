package config

import (
	"os"
	"path/filepath"
)

type Config struct {
	AppPort        string
	AppEnv         string
	StorageDir     string
	PopplerBinDir  string
	GhostscriptBin string
}

func Load() *Config {
	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}

	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development"
	}

	storageDir := os.Getenv("STORAGE_DIR")
	if storageDir == "" {
		storageDir = filepath.Join(os.TempDir(), "convertinaja", "jobs")
	}

	popplerBinDir := os.Getenv("POPPLER_BIN_DIR")
	gsBin := os.Getenv("GHOSTSCRIPT_BIN")
	if gsBin == "" {
		gsBin = "gs"
	}

	return &Config{
		AppPort:        port,
		AppEnv:         env,
		StorageDir:     storageDir,
		PopplerBinDir:  popplerBinDir,
		GhostscriptBin: gsBin,
	}
}
