package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/plug-it-services/plug-it/dto"
)

func ConnectUserBodyMiddleware(c *gin.Context) {
	data := &dto.ConnectUserBodyDto{}

	if err := c.ShouldBindJSON(data); err != nil {
		c.JSON(http.StatusBadRequest, "body is not valid")
		c.Abort()
		return
	}
	c.Next()
}
