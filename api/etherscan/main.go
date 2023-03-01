package main

import (
	"github.com/gin-gonic/gin"
	"github.com/plug-it-services/plug-it/models"
	"github.com/plug-it-services/plug-it/routers"
	"github.com/spf13/viper"
)

func startServer() {
	r := gin.New()

	routers.Router(r)

	err := r.Run(":" + viper.Get("PORT").(string))
	if err != nil {
		return
	}
}

func main() {
	viper.SetConfigFile(".env")
	viper.ReadInConfig()

	models.SetupModels()
	startServer()
}
