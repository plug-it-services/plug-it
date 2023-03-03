package models

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres" // using postgres sql
)

func SetupModels(connection string) gin.HandlerFunc {
	db, err := gorm.Open("postgres", connection)
	if err != nil {
		log.Panic("Failed to connect to database!")
	}
	db.AutoMigrate(&User{})

	return func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	}
}
