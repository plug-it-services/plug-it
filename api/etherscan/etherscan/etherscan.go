package etherscan

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/plug-it-services/plug-it/dto"
)

func GetGasPrice(apiKey string) (int, error) {
	res, err := http.Get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=" + apiKey)
	if err != nil {
		return 0, err
	}

	defer res.Body.Close()

	var gasPrice dto.GasPriceDto
	if jsonErr := json.NewDecoder(res.Body).Decode(&gasPrice); jsonErr != nil {
		return 0, jsonErr
	}

	parsedGasPrice, err := strconv.Atoi(gasPrice.Result.SafeGasPrice)
	if err != nil {
		return 0, err
	}

	return parsedGasPrice, nil
}
