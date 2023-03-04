package services

import (
	"github.com/jinzhu/gorm"
	"github.com/plug-it-services/plug-it/models"
)

func CreateUser(db *gorm.DB, userId int, apiKey string) error {
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

func DeleteUser(db *gorm.DB, id int) error {
	var user models.User
	if err := db.First(&user, id).Error; err != nil {
		return err
	}
	db.Delete(&user)
	return nil
}

func FindUserById(db *gorm.DB, id int) (models.User, error) {
	var user models.User
	if user := db.First(&user, id); user.Error != nil {
		return models.User{}, user.Error
	}
	return user, nil
}
