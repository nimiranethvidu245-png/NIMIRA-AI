const axios = require("axios");

async function getPrice(symbol) {
  try {

    const url =
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;

    const response = await axios.get(url);

    return {
      symbol: response.data.symbol,
      price: Number(response.data.price)
    };

  } catch (error) {

    return {
      error: "Invalid symbol or API error"
    };

  }
}

module.exports = {
  getPrice
};
