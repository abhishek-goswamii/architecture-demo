package main

import (
	"fmt"
	"os"

	"syncflow/config"
	"syncflow/database"
	"syncflow/logger"
	"go.uber.org/zap"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		fmt.Printf("Failed to load config: %v\n", err)
		os.Exit(1)
	}

	logger.Init(cfg.Environment)
	defer logger.Sync()

	logger.Info("Running standalone migration...")

	db, err := database.InitDB(cfg)
	if err != nil {
		logger.Fatal("Could not connect to database", zap.Error(err))
	}

	if err := database.RunMigrations(db); err != nil {
		logger.Fatal("Migration failed", zap.Error(err))
	}

	logger.Info("Migration finished successfully")
}
