// Smart Money Concepts (SMC)
// Market Structure
// Order Block
// Supply & Demand
// Breaker Block


function marketStructure(candles) {

  const last = candles.at(-1);
  const previous = candles.at(-2);


  if (
    Number(last.high) > Number(previous.high) &&
    Number(last.low) > Number(previous.low)
  ) {

    return "HIGHER_HIGH_HIGHER_LOW";

  }


  if (
    Number(last.high) < Number(previous.high) &&
    Number(last.low) < Number(previous.low)
  ) {

    return "LOWER_HIGH_LOWER_LOW";

  }


  return "RANGE";

}




// Order Block detection (basic)
function detectOrderBlock(candles) {

  const last = candles.at(-1);
  const previous = candles.at(-2);


  // Bullish Order Block
  if(
    Number(previous.close) < Number(previous.open) &&
    Number(last.close) > Number(previous.high)
  ){

    return {

      type:"BULLISH_ORDER_BLOCK",

      zone:{
        high:Number(previous.high),
        low:Number(previous.low)
      }

    };

  }



  // Bearish Order Block
  if(
    Number(previous.close) > Number(previous.open) &&
    Number(last.close) < Number(previous.low)
  ){

    return {

      type:"BEARISH_ORDER_BLOCK",

      zone:{
        high:Number(previous.high),
        low:Number(previous.low)
      }

    };

  }


  return {

    type:"NO_ORDER_BLOCK"

  };

}




// Supply & Demand zones
function detectSupplyDemand(candles) {

  const recent =
    candles.slice(-20);


  const highs =
    recent.map(c=>Number(c.high));


  const lows =
    recent.map(c=>Number(c.low));



  return {

    supply:{
      high:Math.max(...highs),
      low:Math.max(...highs)-((Math.max(...highs)-Math.min(...lows))*0.2)
    },


    demand:{
      high:Math.min(...lows)+((Math.max(...highs)-Math.min(...lows))*0.2),
      low:Math.min(...lows)
    }

  };

}




function smcAnalysis(candles){

  return {

    structure:
      marketStructure(candles),

    orderBlock:
      detectOrderBlock(candles),

    zones:
      detectSupplyDemand(candles)

  };

}



module.exports = {

  smcAnalysis,

  marketStructure,

  detectOrderBlock,

  detectSupplyDemand

};
