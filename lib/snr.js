// Malaysian SNR
// Support & Resistance
// Zone Flip
// Rejection Detection


function findSupportResistance(candles, lookback = 50) {

  const data =
    candles.slice(-lookback);


  const highs =
    data.map(c => Number(c.high));

  const lows =
    data.map(c => Number(c.low));


  const resistance =
    Math.max(...highs);


  const support =
    Math.min(...lows);


  return {

    support,

    resistance

  };

}




function detectZone(candles) {


  const sr =
    findSupportResistance(candles);


  const price =
    Number(candles.at(-1).close);



  let zone = "MIDDLE";



  if(
    price <= sr.support * 1.002
  ){

    zone = "SUPPORT_ZONE";

  }



  if(
    price >= sr.resistance * 0.998
  ){

    zone = "RESISTANCE_ZONE";

  }



  return {

    zone,

    support:sr.support,

    resistance:sr.resistance,

    price

  };

}




// Candle rejection
function rejectionSignal(candles){

  const last =
    candles.at(-1);


  const body =
    Math.abs(
      Number(last.close) -
      Number(last.open)
    );


  const lowerWick =
    Math.min(
      Number(last.open),
      Number(last.close)
    )
    -
    Number(last.low);



  const upperWick =
    Number(last.high)
    -
    Math.max(
      Number(last.open),
      Number(last.close)
    );



  if(lowerWick > body * 2){

    return "BULLISH_REJECTION";

  }



  if(upperWick > body * 2){

    return "BEARISH_REJECTION";

  }



  return "NO_REJECTION";

}




function snrAnalysis(candles){

  return {

    levels:
      findSupportResistance(candles),

    zone:
      detectZone(candles),

    rejection:
      rejectionSignal(candles)

  };

}



module.exports = {

  snrAnalysis,

  findSupportResistance,

  detectZone,

  rejectionSignal

};
