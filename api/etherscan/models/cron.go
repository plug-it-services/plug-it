package models

type Cron struct {
	Id     int `json:"id" gorm:"primary_key"`
	UserId int `json:"userId"`
}
