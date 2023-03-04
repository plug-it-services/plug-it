package etherscan

import (
	"encoding/json"
	"net/http"

	"github.com/plug-it-services/plug-it/dto"
)

func GetGasPrice(apiKey string) (string, error) {
	res, err := http.Get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=" + apiKey)
	if err != nil {
		return "", err
	}

	defer res.Body.Close()

	var gasPrice dto.GasPriceDto
	if jsonErr := json.NewDecoder(res.Body).Decode(&gasPrice); jsonErr != nil {
		return "", jsonErr
	}

	return gasPrice.Result.SafeGasPrice, nil
}
