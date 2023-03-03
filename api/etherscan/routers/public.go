package routers

import (
	"github.com/gin-gonic/gin"
	"github.com/plug-it-services/plug-it/controllers"
)

func publicRouter(r *gin.Engine) {
	group := r.Group("/public")
	{
		group.POST("/disconnect", controllers.DisconnectUser)
		group.POST("/apiKey", controllers.ConnectUser)
	}
}
