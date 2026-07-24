const axios = require("axios");
const { analyzeMarket } = require("./analysis");
const { calculateRisk } = require("./risk");


async function getAllCoins(){

    const res = await axios.get(
        "https://api.binance.com/api/v3/exchangeInfo"
    );


    return res.data.symbols
    .filter(
        x =>
        x.quoteAsset === "USDT" &&
        x.status === "TRADING"
    )
    .map(x=>x.symbol);

}



async function getCandles(symbol){


    const res = await axios.get(

`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=15m&limit=100`

    );


    return res.data.map(c=>({

        open:c[1],
        high:c[2],
        low:c[3],
        close:c[4],
        volume:c[5]

    }));

}



async function scanMarket(){


    const coins =
    await getAllCoins();


    let signals=[];


    for(const coin of coins){


        try{


            const candles =
            await getCandles(coin);


            const result =
            analyzeMarket(candles);



            if(
                result.signal !== "WAIT"
            ){


                const price =
                candles.at(-1).close;


                const risk =
                calculateRisk(
                    price,
                    result.signal
                );


                signals.push({

                    coin,

                    signal:
                    result.signal,

                    confidence:
                    result.confidence,

                    risk

                });


            }


        }
        catch(e){

        }


    }


    return signals;


}



module.exports = {

    scanMarket

};
