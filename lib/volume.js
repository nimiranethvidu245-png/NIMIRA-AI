// Volume Profile
// POC (Point of Control)
// High Volume Node
// Low Volume Node


function calculateVolumeProfile(candles, bins = 20) {


  const prices =
    candles.map(
      c => Number(c.close)
    );


  const volumes =
    candles.map(
      c => Number(c.volume)
    );


  const minPrice =
    Math.min(...prices);


  const maxPrice =
    Math.max(...prices);



  const step =
    (maxPrice - minPrice) / bins;



  let profile = [];



  for(let i = 0; i < bins; i++){

    profile.push({

      low:
        minPrice + (step * i),

      high:
        minPrice + (step * (i+1)),

      volume:0

    });

  }



  candles.forEach(candle => {


    const price =
      Number(candle.close);


    const volume =
      Number(candle.volume);



    let index =
      Math.floor(
        (price - minPrice) / step
      );



    if(index >= bins)
      index = bins - 1;


    if(index < 0)
      index = 0;



    profile[index].volume += volume;


  });



  // Point Of Control
  const POC =
    profile.reduce(
      (a,b)=>
        a.volume > b.volume ? a : b
    );



  return {

    POC,

    profile

  };


}





function volumeSignal(candles){


  const data =
    calculateVolumeProfile(candles);



  const price =
    Number(
      candles.at(-1).close
    );



  if(
    price >= data.POC.low &&
    price <= data.POC.high
  ){

    return {

      signal:"POC_ZONE",

      message:
      "Price is inside high volume area"

    };

  }



  return {

    signal:"NORMAL",

    message:
    "Price away from POC"

  };


}




module.exports = {

  calculateVolumeProfile,

  volumeSignal

};
