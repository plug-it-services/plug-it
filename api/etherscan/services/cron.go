package services

import (
	"github.com/jinzhu/gorm"
	"github.com/plug-it-services/plug-it/models"
)

func CreateCron(db *gorm.DB, userId int, id int, plugId string, data string, eventId string) error {
	cron := models.Cron{
		UserId:  userId,
		CronId:  id,
		PlugId:  plugId,
		Data:    data,
		EventId: eventId,
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
	if cron := db.Where("cronId = ?", id).First(&cron); cron.Error != nil {
		return models.Cron{}, cron.Error
	}
	return cron, nil
}

func FindCronByPlugId(db *gorm.DB, plugId string) (models.Cron, error) {
	var cron models.Cron
	if cron := db.Where("plugId = ?", plugId).First(&cron); cron.Error != nil {
		return models.Cron{}, cron.Error
	}
	return cron, nil
}

func DeleteAllCronByUserId(db *gorm.DB, userId int) error {
	var crons []models.Cron
	if err := db.Where("userId = ?", userId).Find(&crons).Error; err != nil {
		return err
	}
	for _, cron := range crons {
		db.Delete(&cron)
	}
	return nil
}

func GetAllCrons(db *gorm.DB) ([]models.Cron, error) {
	var crons []models.Cron
	if err := db.Find(&crons).Error; err != nil {
		return nil, err
	}
	return crons, nil
}

func UpdateCronId(db *gorm.DB, id int, cronId int) error {
	var cron models.Cron
	if err := db.First(&cron, id).Error; err != nil {
		return err
	}
	cron.CronId = cronId
	db.Save(&cron)
	return nil
}
