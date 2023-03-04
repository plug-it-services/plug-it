package services

import (
	"github.com/jinzhu/gorm"
	"github.com/plug-it-services/plug-it/models"
)

func CreateCron(db *gorm.DB, userId int, id int) error {
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

func DeleteCron(db *gorm.DB, id int) error {
	var cron models.Cron
	if err := db.First(&cron, id).Error; err != nil {
		return err
	}
	db.Delete(&cron)
	return nil
}

func FindCronById(db *gorm.DB, id int) (models.Cron, error) {
	var cron models.Cron
	if cron := db.First(&cron, id); cron.Error != nil {
		return models.Cron{}, cron.Error
	}
	return cron, nil
}
