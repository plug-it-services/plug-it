package services

import (
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/plug-it-services/plug-it/models"
)

func CreateCron(c *gin.Context, userId int, id int) error {
	db := c.MustGet("db").(*gorm.DB)

	cron := models.Cron{
		UserId: userId,
		Id:     id,
	}
	err := db.Create(&cron).Error
	if err != nil {
		return err
	}
	return nil
}

func DeleteCron(c *gin.Context, id int) error {
	db := c.MustGet("db").(*gorm.DB)

	var cron models.Cron
	if err := db.First(&cron, id).Error; err != nil {
		return err
	}
	db.Delete(&cron)
	return nil
}

func FindCronById(c *gin.Context, id int) (models.Cron, error) {
	db := c.MustGet("db").(*gorm.DB)

	var cron models.Cron
	if cron := db.First(&cron, id); cron.Error != nil {
		return models.Cron{}, cron.Error
	}
	return cron, nil
}
