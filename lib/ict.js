// ICT Concepts
// Liquidity Sweep
// BOS
// CHoCH
// FVG (Fair Value Gap)


function detectLiquiditySweep(candles) {

  const last = candles.at(-1);
  const previous = candles.at(-2);


  if (
    Number(last.low) < Number(previous.low) &&
    Number(last.close) > Number(previous.low)
  ) {

    return "BULLISH_LIQUIDITY_SWEEP";

  }


  if (
    Number(last.high) > Number(previous.high) &&
    Number(last.close) < Number(previous.high)
  ) {

    return "BEARISH_LIQUIDITY_SWEEP";

  }


  return "NO_SWEEP";

}



function detectBOS(candles) {

  const last = candles.at(-1);

  const highs =
    candles.map(c => Number(c.high));

  const lows =
    candles.map(c => Number(c.low));


  const previousHigh =
    Math.max(...highs.slice(0,-1));


  const previousLow =
    Math.min(...lows.slice(0,-1));



  if(
    Number(last.close) > previousHigh
  ){

    return "BULLISH_BOS";

  }


  if(
    Number(last.close) < previousLow
  ){

    return "BEARISH_BOS";

  }


  return "NO_BOS";

}




function detectCHoCH(candles) {

  const bos =
    detectBOS(candles);


  if(bos === "BULLISH_BOS") {

    return "BULLISH_CHOCH";

  }


  if(bos === "BEARISH_BOS") {

    return "BEARISH_CHOCH";

  }


  return "NO_CHOCH";

}




// Fair Value Gap
function detectFVG(candles) {


  const c1 = candles.at(-3);
  const c3 = candles.at(-1);



  if(
    Number(c1.high) <
    Number(c3.low)
  ){

    return {

      type:"BULLISH_FVG",

      zone:{
        low:c1.high,
        high:c3.low
      }

    };

  }



  if(
    Number(c1.low) >
    Number(c3.high)
  ){

    return {

      type:"BEARISH_FVG",

      zone:{
        low:c3.high,
        high:c1.low
      }

    };

  }


  return {

    type:"NO_FVG"

  };

}




function ictAnalysis(candles){

  return {

    liquidity:
      detectLiquiditySweep(candles),

    BOS:
      detectBOS(candles),

    CHoCH:
      detectCHoCH(candles),

    FVG:
      detectFVG(candles)

  };

}



module.exports = {

  ictAnalysis,

  detectLiquiditySweep,

  detectBOS,

  detectCHoCH,

  detectFVG

};
