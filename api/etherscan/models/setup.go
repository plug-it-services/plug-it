package models

import (
	"log"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres" // using postgres sql
)

func SetupModels(connection string) *gorm.DB {
	db, err := gorm.Open("postgres", connection)
	if err != nil {
		log.Panic("Failed to connect to database!")
	}
	db.AutoMigrate(&User{})
	db.AutoMigrate(&Cron{})

	return db
}
