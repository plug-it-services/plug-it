package services

import (
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/plug-it-services/plug-it/models"
)

func CreateUser(c *gin.Context, userId int, apiKey string) error {
	db := c.MustGet("db").(*gorm.DB)

	user := models.User{
		ApiKey: apiKey,
		Id:     userId,
	}
	err := db.Create(&user).Error
	if err != nil {
		return err
	}
	return nil
}

func DeleteUser(c *gin.Context, id int) error {
	db := c.MustGet("db").(*gorm.DB)

	var user models.User
	if err := db.First(&user, id).Error; err != nil {
		return err
	}
	db.Delete(&user)
	return nil
}

func FindUserById(c *gin.Context, id int) (models.User, error) {
	db := c.MustGet("db").(*gorm.DB)

	var user models.User
	if user := db.First(&user, id); user.Error != nil {
		return models.User{}, user.Error
	}
	return user, nil
}
