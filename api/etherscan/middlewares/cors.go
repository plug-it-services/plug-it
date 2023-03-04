package middlewares

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", viper.Get("CORS_ORIGIN").(string))
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Length,Content-Type,crsf-token")
		c.Header("Access-Control-Allow-Methods", "POST, PUT, DELETE, OPTIONS, GET")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
