package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/plug-it-services/plug-it/dto"
	"github.com/plug-it-services/plug-it/services"
	"github.com/spf13/viper"
)

func ConnectUser(c *gin.Context) {
	var body dto.ConnectUserBodyDto
	var user dto.UserDto
	db := c.MustGet("db").(*gorm.DB)

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "bad request",
		})
		return
	}
	if err := json.Unmarshal([]byte(c.GetHeader("user")), &user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "internal server error",
		})
		return
	}

	if err := services.CreateUser(db, user.Id, body.ApiKey); err != nil {
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

	if _, err := http.Post(viper.Get("PLUGS_SERVICE_LOGGED_IN_URL").(string), "application/json", bytes.NewBuffer(requestBody)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "internal server error",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
	})
}
