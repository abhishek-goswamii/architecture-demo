package database

import (
	"syncflow/entities"
	"syncflow/logger"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

func RunMigrations(db *gorm.DB) error {
	logger.Info("Running database migrations...")
	err := db.AutoMigrate(
		&entities.User{},
	)
	if err != nil {
		logger.Error("Migration failed", zap.Error(err))
		return err
	}
	logger.Info("Migrations completed successfully")
	return nil
}
