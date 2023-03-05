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

func GetBlockNumber(apiKey string, timestamp string) (string, error) {
	res, err := http.Get("https://api.etherscan.io/api?module=block&action=getblocknobytime&closest=before&timestamp=" + timestamp + "&apikey=" + apiKey)
	if err != nil {
		return "", err
	}

	defer res.Body.Close()

	var blockNumber dto.BlockNumberDto
	if jsonErr := json.NewDecoder(res.Body).Decode(&blockNumber); jsonErr != nil {
		return "", jsonErr
	}

	return blockNumber.BlockNumber, nil
}

func GetTotalSupply(apiKey string, contractAddress string) (string, error) {
	res, err := http.Get("https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=" + contractAddress + "&apikey=" + apiKey)
	if err != nil {
		return "", err
	}

	defer res.Body.Close()

	var totalSupply dto.TotalSupplyDto
	if jsonErr := json.NewDecoder(res.Body).Decode(&totalSupply); jsonErr != nil {
		return "", jsonErr
	}

	return totalSupply.TotalSupply, nil
}

func GetBalance(apiKey string, contractAddress string, address string) (string, error) {
	res, err := http.Get("https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" + contractAddress + "&address=" + address + "&apikey=" + apiKey)
	if err != nil {
		return "", err
	}

	defer res.Body.Close()

	var balance dto.TokenBalanceDto
	if jsonErr := json.NewDecoder(res.Body).Decode(&balance); jsonErr != nil {
		return "", jsonErr
	}

	return balance.TokenBalance, nil
}
