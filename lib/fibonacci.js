function calculateFibonacci(high, low) {

  const diff = high - low;

  return {

    level_0: high,

    level_236: high - (diff * 0.236),

    level_382: high - (diff * 0.382),

    level_500: high - (diff * 0.500),

    level_618: high - (diff * 0.618),

    level_786: high - (diff * 0.786),

    level_100: low

  };

}


// Find recent swing high & low
function getSwing(candles, lookback = 50) {

  const recent =
    candles.slice(-lookback);


  const highs =
    recent.map(c => Number(c.high));

  const lows =
    recent.map(c => Number(c.low));


  return {

    high: Math.max(...highs),

    low: Math.min(...lows)

  };

}


// Fibonacci zone check
function fibonacciSignal(candles) {

  const swing =
    getSwing(candles);


  const fib =
    calculateFibonacci(
      swing.high,
      swing.low
    );


  const price =
    Number(candles.at(-1).close);


  let zone = "NONE";


  if(
    price <= fib.level_618 &&
    price >= fib.level_500
  ){

    zone = "GOLDEN_ZONE";

  }


  if(
    price <= fib.level_786 &&
    price >= fib.level_618
  ){

    zone = "DEEP_RETRACEMENT";

  }


  return {

    swing,

    fib,

    currentPrice: price,

    zone

  };

}



module.exports = {

  calculateFibonacci,

  getSwing,

  fibonacciSignal

};
