package main

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/plug-it-services/plug-it/controllers"
	"github.com/plug-it-services/plug-it/middlewares"
	"github.com/plug-it-services/plug-it/models"
	"github.com/spf13/viper"
)

func startServer() {
	r := gin.Default()

	config := cors.DefaultConfig()
  	config.AllowOrigins = []string{viper.Get("CORS_ORIGIN").(string)}
	config.AllowCredentials = true

 	 router.Use(cors.New(config))

	r.Use(cors.Default(cors.Config{
		AllowOrigins:     []string{viper.Get("CORS_ORIGIN").(string)},
		AllowCredentials: true,
		AllowMethods:     []string{"OPTIONS", "GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{},
	}))

	r.POST("/public/disconnect", controllers.DisconnectUser)
	r.POST("/public/apiKey", middlewares.ConnectUserBodyMiddleware, controllers.ConnectUser)

	err := r.Run(":" + viper.Get("PORT").(string))
	if err != nil {
		return
	}
}

func initRequest() {
	content, err := ioutil.ReadFile("./config/etherscan.json")
	if err != nil {
		log.Fatal("Error when opening file: ", err)
	}

	_, err = http.Post(viper.Get("PLUGS_SERVICE_INITIALIZE_URL").(string), "application/json", bytes.NewBuffer(content))
	if err != nil {
		os.Exit(1)
	}
}

func main() {
	viper.SetConfigFile(".env")
	viper.ReadInConfig()

	models.SetupModels()
	initRequest()
	startServer()
}
