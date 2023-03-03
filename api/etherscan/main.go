package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/plug-it-services/plug-it/middlewares"
	"github.com/plug-it-services/plug-it/models"
	"github.com/plug-it-services/plug-it/rabbitmq"
	"github.com/plug-it-services/plug-it/routers"
	"github.com/spf13/viper"
)

func startServer() {
	r := gin.Default()

	r.Use(middlewares.CORSMiddleware())

	viper_user := viper.Get("POSTGRES_USER")
	viper_password := viper.Get("POSTGRES_PASSWORD")
	viper_db := viper.Get("POSTGRES_DB")
	viper_host := viper.Get("POSTGRES_HOST")
	viper_port := viper.Get("POSTGRES_PORT")

	conname := fmt.Sprintf("host=%v port=%v user=%v dbname=%v password=%v sslmode=disable", viper_host, viper_port, viper_user, viper_db, viper_password)
	r.Use(models.SetupModels(conname))

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

	RabbitMQService, err := rabbitmq.New(viper.Get("RABBITMQ_URL").(string))
	if err != nil {
		log.Fatal("Error when connecting to RabbitMQ: ", err)
	}
	defer RabbitMQService.Disconnect()

	initRequest()
	startServer()
}
