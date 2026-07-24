const {
  EMA,
  RSI,
  MACD
} = require("technicalindicators");


// EMA
function calculateEMA(prices, period = 50) {

  return EMA.calculate({
    period,
    values: prices
  });

}


// RSI
function calculateRSI(prices, period = 14) {

  return RSI.calculate({
    period,
    values: prices
  });

}


// MACD
function calculateMACD(prices) {

  return MACD.calculate({
    values: prices,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  });

}


// Volume Profile
function calculateVolumeProfile(candles, bins = 20) {

  const prices = candles.map(
    c => Number(c.close)
  );

  const volumes = candles.map(
    c => Number(c.volume)
  );


  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);


  const range =
    (maxPrice - minPrice) / bins;


  let profile = [];


  for (let i = 0; i < bins; i++) {

    profile.push({

      low: minPrice + (range * i),

      high: minPrice + (range * (i + 1)),

      volume: 0

    });

  }


  candles.forEach((candle)=>{

    const price = Number(candle.close);
    const volume = Number(candle.volume);


    let index = Math.floor(
      (price - minPrice) / range
    );


    if(index >= bins)
      index = bins - 1;


    if(index < 0)
      index = 0;


    profile[index].volume += volume;

  });


  const POC = profile.reduce(
    (a,b)=>
      a.volume > b.volume ? a : b
  );


  return {
    POC,
    profile
  };

}



// Main Indicator Engine
function getIndicators(candles) {


  const closes = candles.map(
    c => Number(c.close)
  );


  const ema20 =
    calculateEMA(closes,20);


  const ema50 =
    calculateEMA(closes,50);


  const ema200 =
    calculateEMA(closes,200);


  const rsi =
    calculateRSI(closes);


  const macd =
    calculateMACD(closes);


  const volumeProfile =
    calculateVolumeProfile(candles);



  let trend = "NEUTRAL";


  if(
    ema20.at(-1) >
    ema50.at(-1)
  ){

    trend="BULLISH";

  }


  if(
    ema20.at(-1) <
    ema50.at(-1)
  ){

    trend="BEARISH";

  }



  return {

    trend,

    EMA20: ema20.at(-1),

    EMA50: ema50.at(-1),

    EMA200: ema200.at(-1),

    RSI: rsi.at(-1),

    MACD: macd.at(-1),

    VolumeProfile: volumeProfile

  };


}



module.exports = {

  getIndicators,

  calculateEMA,

  calculateRSI,

  calculateMACD,

  calculateVolumeProfile

};
