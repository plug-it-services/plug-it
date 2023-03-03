package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/plug-it-services/plug-it/middlewares"
	"github.com/plug-it-services/plug-it/models"
	"github.com/plug-it-services/plug-it/rabbitmq"
	"github.com/plug-it-services/plug-it/routers"
	"github.com/spf13/viper"
)

func initRequest() {
	content, err := ioutil.ReadFile("./config/etherscan.json")
	if err != nil {
		log.Fatal("Error when opening file: ", err)
	}

	_, err = http.Post(viper.Get("PLUGS_SERVICE_INITIALIZE_URL").(string), "application/json", bytes.NewBuffer(content))
	if err != nil {
		log.Fatal("Error when sending init request: ", err)
	}
}

func initGin() {
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
		log.Fatal("Error when starting server: ", err)
		return
	}
}

func initViper() {
	viper.SetConfigFile(".env")
	viper.ReadInConfig()
}

func initRabbitmq(RabbitMQService *rabbitmq.RabbitMQService) {
	err := RabbitMQService.CreateQueue("plug_event_etherscan_initialize", "amq.direct")
	if err != nil {
		log.Fatal("Error when creating queue: ", err)
	}
	err = RabbitMQService.CreateQueue("plug_action_etherscan_triggers", "amq.direct")
	if err != nil {
		log.Fatal("Error when creating queue: ", err)
	}

	err = RabbitMQService.CreateConsumer("plug_event_etherscan_initialize", rabbitmq.EventConsumer)
	if err != nil {
		log.Fatal("Error when creating consumer: ", err)
	}
	err = RabbitMQService.CreateConsumer("plug_action_etherscan_triggers", rabbitmq.ActionConsumer)
	if err != nil {
		log.Fatal("Error when creating consumer: ", err)
	}
}

func main() {
	initViper()

	RabbitMQService, err := rabbitmq.New(viper.Get("RABBITMQ_URL").(string))
	if err != nil {
		log.Fatal("Error when connecting to RabbitMQ: ", err)
	}
	defer RabbitMQService.Close()

	initRabbitmq(RabbitMQService)

	initRequest()
	initGin()
}
