package controllers

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/plug-it-services/plug-it/dto"
	"github.com/plug-it-services/plug-it/services"
	"github.com/spf13/viper"
)

func ConnectUser(c *gin.Context) {
	var body dto.ConnectUserBodyDto
	var user dto.UserDto

	c.ShouldBindJSON(&body)
	err := json.Unmarshal([]byte(c.GetHeader("user")), &user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "internal server error",
		})
		return
	}

	log.Println("user", user)
	log.Println("body", body)

	err = services.CreateUser(c, user.Id, body.ApiKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "internal server error",
		})
		return
	}

	requestBody, err := json.Marshal(map[string]int{"userId": user.Id})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "internal server error",
		})
		return
	}

	_, err = http.Post(viper.Get("PLUGS_SERVICE_LOGGED_IN_URL").(string), "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "internal server error",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
	})
}
