package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port                 string
	DBHost               string
	DBPort               string
	DBUser               string
	DBPassword           string
	DBName               string
	Environment          string
	DiscordWebhookURL    string
	DiscordAlertsEnabled bool
}

func LoadConfig() (*Config, error) {
	// Load .env file, ignore error if it doesn't exist (can use env vars directly)
	_ = godotenv.Load()

	conf := &Config{
		Port:                 getEnv("PORT", "4400"),
		DBHost:               getEnv("DB_HOST", "localhost"),
		DBPort:               getEnv("DB_PORT", "5432"),
		DBUser:               getEnv("DB_USER", "postgres"),
		DBPassword:           getEnv("DB_PASSWORD", "postgres"),
		DBName:               getEnv("DB_NAME", "syncflow"),
		Environment:          getEnv("ENVIRONMENT", "development"),
		DiscordWebhookURL:    getEnv("DISCORD_WEBHOOK_URL", ""),
		DiscordAlertsEnabled: getEnv("DISCORD_ALERTS_ENABLED", "0") == "1",
	}

	if conf.DBHost == "" || conf.DBUser == "" {
		return nil, fmt.Errorf("missing essential configuration")
	}

	return conf, nil
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
