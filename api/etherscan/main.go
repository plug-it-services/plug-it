package main

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/plug-it-services/plug-it/models"
	"github.com/plug-it-services/plug-it/routers"
	"github.com/spf13/viper"
)

func startServer() {
	r := gin.New()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{
		"http://localhost:3000",
		"http://localhost:3001",
		viper.Get("CORS_ORIGIN").(string),
	}
	corsConfig.AllowCredentials = true

	r.Use(cors.New(corsConfig))
	routers.Router(r)

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
