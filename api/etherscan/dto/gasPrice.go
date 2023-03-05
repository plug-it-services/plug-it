package dto

type GasPriceDtoResult struct {
	SafeGasPrice string `json:"SafeGasPrice"`
}

type GasPriceDto struct {
	Result GasPriceDtoResult `json:"result"`
}
