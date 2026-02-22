package middlewares

import (
	"time"

	"syncflow/logger"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery

		// 1. Generate Request ID
		reqId := uuid.New().String()
		c.Header("X-Request-ID", reqId)

		// 2. Create child logger with request_id
		l := logger.L.With(zap.String("request_id", reqId))

		// 3. Store logger in context
		c.Set(logger.LoggerKey, l)

		c.Next()

		latency := time.Since(start)
		status := c.Writer.Status()

		// 4. Use the context logger for final log
		l.Info("Request completed",
			zap.Int("status", status),
			zap.String("method", c.Request.Method),
			zap.String("path", path),
			zap.String("query", query),
			zap.String("ip", c.ClientIP()),
			zap.Duration("latency", latency),
			zap.String("user-agent", c.Request.UserAgent()),
		)
	}
}
