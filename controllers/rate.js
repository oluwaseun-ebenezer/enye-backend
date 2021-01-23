// The currency rate conversion controller.

const axios = require('axios');
const url = require('url');
const { request } = require('../app');

exports.getRates = async (req, res) => {

    try {

        axios.get('https://api.exchangeratesapi.io/latest').then(response => {

            let currencies = [];
            const baseCurrency = url.parse(req.url,true).query.base;
            const currencyPair = url.parse(req.url,true).query.currency.split(',');

            for (const key in response.data.rates) {
                currencies.push(key);
            }

            // adding the base currency from the exchangeratesapi to the pool of currencies
            currencies.push(response.data.base);
            response.data.rates[response.data.base] = 1;

            // checking if the base currency passed to the api exists
            for (const currenciesKey in currencies){
                if (baseCurrency == currencies[currenciesKey]){
                    break;
                } else {
                    if (currencies.length - 1 == currenciesKey){
                        return res.status(400).json({
                            message: `${baseCurrency} is not an acceptable as a base currency here!`
                        });
                        break;
                    }
                    continue;
                }
            }

            // checking if the currency pairs passed to the api exists
            for (const key in currencyPair){
                for (const currenciesKey in currencies){
                    if (currencyPair[key] == currencies[currenciesKey]){
                        break;
                    } else {
                        if (currencies.length - 1 == currenciesKey){
                            return res.status(400).json({
                                message: `${currencyPair[key]} is not an acceptable currency here!`
                            });
                            break;
                        }
                        continue;
                    }
                }
            }

            // The conversion process starts here
            const apiRates = response.data.rates;
            let newRates = {};
            const conversionUnit = (1 / apiRates[baseCurrency]);

            for (const key in apiRates) {
                newRates[key] = parseFloat(Number.parseFloat(apiRates[key] * conversionUnit).toPrecision(8));
            }

            // remove the requested base currency from the rates
            delete newRates[baseCurrency];

            // extracting the rates needed for response
            let rates = {};

            for (const key in currencyPair) {
                rates[currencyPair[key]] = newRates[currencyPair[key]];
            }

            return res.status(200).json({
                results: {
                    base: baseCurrency,
                    date: response.data.date,
                    rates
                }
            });

        }).catch((error) => {
            return res.status(500).json({
                message: 'There was an unexpected error!'
            });
        })
    } catch {

        return res.status(500).json({
            message: 'There was an unexpected error!'
        });

    }
};
