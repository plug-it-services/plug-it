package models

type Cron struct {
	Id      int    `json:"id" gorm:"primary_key"`
	CronId  int    `json:"cronId"`
	UserId  int    `json:"userId"`
	PlugId  string `json:"plugId"`
	Data    string `json:"data"`
	EventId string `json:"eventId"`
}
