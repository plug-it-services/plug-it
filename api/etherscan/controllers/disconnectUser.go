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

func DisconnectUser(c *gin.Context) {
	var user dto.UserDto
	db := c.MustGet("db").(*gorm.DB)

	err := json.Unmarshal([]byte(c.GetHeader("user")), &user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "internal server error",
		})
		return
	}

	err = services.DeleteUser(db, user.Id)
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

	if err := services.DeleteAllCronByUserId(db, user.Id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "internal server error",
		})
		return
	}

	_, err = http.Post(viper.Get("PLUGS_SERVICE_LOGGED_OUT_URL").(string), "application/json", bytes.NewBuffer(requestBody))
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
