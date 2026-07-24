// NIMIRA MD AI ANALYSIS ENGINE

const { getIndicators } = require("./indicators");
const { fibonacciSignal } = require("./fibonacci");
const { ictAnalysis } = require("./ict");
const { smcAnalysis } = require("./smc");
const { snrAnalysis } = require("./snr");
const { volumeSignal } = require("./volume");
const { ewcAnalysis } = require("./ewc");



function analyzeMarket(candles) {


  const indicators =
    getIndicators(candles);


  const fibonacci =
    fibonacciSignal(candles);


  const ict =
    ictAnalysis(candles);


  const smc =
    smcAnalysis(candles);


  const snr =
    snrAnalysis(candles);


  const volume =
    volumeSignal(candles);


  const ewc =
    ewcAnalysis(candles);



  let score = 0;



  // Indicators
  if(indicators.trend === "BULLISH")
    score += 1;


  if(indicators.trend === "BEARISH")
    score -= 1;



  if(indicators.RSI > 50)
    score += 1;


  if(indicators.RSI < 50)
    score -= 1;



  // Fibonacci

  if(
    fibonacci.zone === "GOLDEN_ZONE"
  )
    score += 1;



  // ICT

  if(
    ict.liquidity ===
    "BULLISH_LIQUIDITY_SWEEP"
  )
    score += 1;


  if(
    ict.liquidity ===
    "BEARISH_LIQUIDITY_SWEEP"
  )
    score -= 1;



  // SMC

  if(
    smc.orderBlock.type ===
    "BULLISH_ORDER_BLOCK"
  )
    score += 1;


  if(
    smc.orderBlock.type ===
    "BEARISH_ORDER_BLOCK"
  )
    score -= 1;



  // SNR

  if(
    snr.zone.zone ===
    "SUPPORT_ZONE"
  )
    score += 1;


  if(
    snr.zone.zone ===
    "RESISTANCE_ZONE"
  )
    score -= 1;



  // EWC

  if(
    ewc.marketBias === "BUY"
  )
    score += 1;


  if(
    ewc.marketBias === "SELL"
  )
    score -= 1;




  let signal = "WAIT";


  if(score >= 4)
    signal = "BUY";


  if(score <= -4)
    signal = "SELL";



  return {

    signal,

    confidence:
      Math.min(
        Math.abs(score) * 10 + 50,
        95
      ) + "%",


    score,


    indicators,

    fibonacci,

    ict,

    smc,

    snr,

    volume,

    ewc

  };


}



module.exports = {

  analyzeMarket

};
