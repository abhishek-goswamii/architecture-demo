package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"syncflow/config"
	"syncflow/controllers"
	"syncflow/database"
	"syncflow/dbops"
	"syncflow/logger"
	"syncflow/middlewares"
	"syncflow/routes"
	"syncflow/services"
	"syncflow/services/alerts"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func main() {
	// 1. Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		fmt.Printf("Failed to load config: %v\n", err)
		os.Exit(1)
	}

	// 2. Initialize Logger
	logger.Init(cfg.Environment)
	defer logger.Sync()

	// 3. Initialize Alert Service
	alerts.Init(cfg.DiscordAlertsEnabled, alerts.NewDiscordNotifier(cfg.DiscordWebhookURL))

	logger.Info("Starting server", zap.String("port", cfg.Port), zap.String("env", cfg.Environment))

	// 4. Initialize Database
	db, err := database.InitDB(cfg)
	if err != nil {
		logger.Fatal("Could not connect to database", zap.Error(err))
	}

	// 5. Setup Dependency Injection
	userDBOps := dbops.NewUserDBOps(db)
	userService := services.NewUserService(userDBOps)
	userController := controllers.NewUserController(userService)

	// 6. Setup Gin Engine
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()

	// 7. Register Global Middlewares
	r.Use(middlewares.Logger())
	r.Use(middlewares.Recovery())

	// 8. Register Routes
	routes.RegisterRoutes(r, userController)

	// 9. Configure HTTP Server
	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// 10. Start Server in a goroutine
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("listen", zap.Error(err))
		}
	}()

	// 11. Graceful Shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Info("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatal("Server forced to shutdown", zap.Error(err))
	}


	logger.Info("Server exiting")
}
