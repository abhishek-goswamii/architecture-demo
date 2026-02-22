package logger

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

const LoggerKey = "logger"

var L *zap.Logger

func Init(env string) {
	var config zap.Config

	if env == "production" {
		config = zap.NewProductionConfig()
	} else {
		config = zap.NewDevelopmentConfig()
		config.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	}

	var err error
	// We use AddCallerSkip(1) so that the log shows the caller of our wrapper functions
	L, err = config.Build(zap.AddCallerSkip(1))
	if err != nil {
		panic(err)
	}
}

// GetLoggerFromContext retrieves the context-aware logger from the Gin context.
// If not found, it returns the global logger.
func GetLoggerFromContext(c *gin.Context) *zap.Logger {
	if l, exists := c.Get(LoggerKey); exists {
		if logger, ok := l.(*zap.Logger); ok {
			return logger
		}
	}
	return L
}

func Info(msg string, fields ...zap.Field) {
	L.Info(msg, fields...)
}

func Error(msg string, fields ...zap.Field) {
	L.Error(msg, fields...)
}

func Warn(msg string, fields ...zap.Field) {
	L.Warn(msg, fields...)
}

func Fatal(msg string, fields ...zap.Field) {
	L.Fatal(msg, fields...)
}

func Debug(msg string, fields ...zap.Field) {
	L.Debug(msg, fields...)
}

func Sync() error {
	if L != nil {
		return L.Sync()
	}
	return nil
}
