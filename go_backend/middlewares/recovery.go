package middlewares

import (
	"fmt"
	"net/http"
	"runtime/debug"

	"syncflow/logger"
	"syncflow/services/alerts"
	"syncflow/utils"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func Recovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				logger.Error("Recovery from panic",
					zap.Any("error", err),
					zap.String("stack", string(debug.Stack())),
				)

				// Send alert
				alerts.Error(fmt.Sprintf("Panic recovered: %v\nStack: %s", err, string(debug.Stack())))

				utils.Error(c, http.StatusInternalServerError, "Internal Server Error")
			}
		}()
		c.Next()
	}
}
