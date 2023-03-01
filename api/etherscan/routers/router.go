package routers

import (
	"github.com/gin-gonic/gin"
)

func Router(r *gin.Engine) {
	publicRouter(r)
}
