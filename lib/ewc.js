// NIMIRA MD
// Elliott Wave Concept (EWC)
// Basic wave structure confirmation


function analyzeMomentum(candles) {

  let bullish = 0;
  let bearish = 0;


  for(let i = 1; i < candles.length; i++) {

    const current =
      Number(candles[i].close);

    const previous =
      Number(candles[i-1].close);


    if(current > previous)
      bullish++;


    if(current < previous)
      bearish++;

  }


  if(bullish > bearish)
    return "BULLISH";


  if(bearish > bullish)
    return "BEARISH";


  return "NEUTRAL";

}




function detectWavePhase(candles) {

  const trend =
    analyzeMomentum(
      candles.slice(-20)
    );


  if(trend === "BULLISH") {

    return {

      phase:"ACCUMULATION_TO_MARKUP",

      bias:"BUY"

    };

  }


  if(trend === "BEARISH") {

    return {

      phase:"DISTRIBUTION_TO_MARKDOWN",

      bias:"SELL"

    };

  }


  return {

    phase:"CORRECTION",

    bias:"WAIT"

  };

}




function ewcAnalysis(candles) {

  const result =
    detectWavePhase(candles);


  return {

    concept:"EWC",

    phase:result.phase,

    marketBias:result.bias

  };

}



module.exports = {

  ewcAnalysis,

  detectWavePhase

};
