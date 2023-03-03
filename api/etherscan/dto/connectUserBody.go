package dto

type ConnectUserBodyDto struct {
	ApiKey string `json:"apiKey" binding:"required"`
}
