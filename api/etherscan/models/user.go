package models

type User struct {
	Id     int    `json:"id" gorm:"primary_key"`
	ApiKey string `json:"apiKey"`
}
