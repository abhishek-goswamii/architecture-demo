package routes

import (
	"syncflow/controllers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, userController *controllers.UserController) {
	api := r.Group("/api")
	{
		users := api.Group("/users")
		{
			users.POST("/", userController.CreateUser)
			users.GET("/:id", userController.GetUser)
		}
	}
}
