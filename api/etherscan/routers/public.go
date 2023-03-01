package routers

import (
	"github.com/gin-gonic/gin"
	"github.com/plug-it-services/plug-it/controllers"
	"github.com/plug-it-services/plug-it/middlewares"
)

func publicRouter(r *gin.Engine) {
	group := r.Group("/public")
	{
		group.POST("/disconnect", controllers.DisconnectUser)
		group.POST("/apiKey", middlewares.ConnectUserBodyMiddleware, controllers.ConnectUser)
	}
}
