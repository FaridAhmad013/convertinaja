package main

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"

	"github.com/faridahmad013/convertinaja/internal/config"
	imageOpt "github.com/faridahmad013/convertinaja/internal/conversion/image"
	"github.com/faridahmad013/convertinaja/internal/converter"
	"github.com/faridahmad013/convertinaja/internal/handler"
	"github.com/faridahmad013/convertinaja/internal/middleware"
	"github.com/faridahmad013/convertinaja/internal/service"
	"github.com/faridahmad013/convertinaja/internal/storage"
)

func main() {
	_ = godotenv.Load()

	zerolog.TimeFieldFormat = time.RFC3339

	cfg := config.Load()

	store, err := storage.New(cfg.StorageDir)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to initialize storage")
	}

	engine := converter.NewPopplerEngine(cfg.PopplerBinDir, cfg.GhostscriptBin)
	jobService := service.NewJobService(store, engine)
	convHandler := handler.NewConversionHandler(store, jobService)

	// Image Optimization Engine & Handler
	vipsEncoder := imageOpt.NewVipsEncoder()
	imageOptimizer := imageOpt.NewOptimizer(vipsEncoder)
	imageService := imageOpt.NewService(store, imageOptimizer)
	imageHandler := imageOpt.NewHandler(store, imageService)

	router := chi.NewRouter()

	router.Use(chiMiddleware.RequestID)
	router.Use(chiMiddleware.RealIP)
	router.Use(chiMiddleware.Recoverer)
	router.Use(middleware.CORS)
	router.Use(chiMiddleware.Timeout(120 * time.Second))

	router.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]string{
			"status":  "ok",
			"service": "convertinaja-api",
		})
	})

	convHandler.RegisterRoutes(router)
	imageHandler.RegisterRoutes(router)

	server := &http.Server{
		Addr:         ":" + cfg.AppPort,
		Handler:      router,
		ReadTimeout:  60 * time.Second,
		WriteTimeout: 300 * time.Second,
		IdleTimeout:  300 * time.Second,
	}

	log.Info().
		Str("port", cfg.AppPort).
		Str("env", cfg.AppEnv).
		Str("storage", cfg.StorageDir).
		Msg("ConvertinAja API server is starting")

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal().Err(err).Msg("Failed to start server")
	}
}
