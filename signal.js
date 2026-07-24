const axios = require("axios");
const { analyzeMarket } = require("../lib/analysis");
const { calculateRisk } = require("../lib/risk");


// Binance Futures candles
async function getCandles(symbol) {

    symbol = symbol.toUpperCase();


    const url =
    `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=15m&limit=100`;


    const res =
    await axios.get(url);


    return res.data.map(c => ({

        open: Number(c[1]),
        high: Number(c[2]),
        low: Number(c[3]),
        close: Number(c[4]),
        volume: Number(c[5])

    }));

}




async function signalCommand(sock, msg, args) {


    try {


        if(!args[0]){

            return sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
                    "❌ Coin එක දෙන්න\n\nExample:\n.signal BTCUSDT"
                }
            );

        }



        const symbol =
        args[0].toUpperCase();



        const candles =
        await getCandles(symbol);



        const result =
        analyzeMarket(candles);



        const price =
        candles.at(-1).close;



        const risk =
        calculateRisk(
            price,
            result.signal
        );




        const text =

`🤖 NIMIRA MD FUTURES AI

PAIR:
${symbol}

TIMEFRAME:
15M

SIGNAL:
${result.signal}

CONFIDENCE:
${result.confidence}


💰 TRADE PLAN

ENTRY:
${risk.entry}

STOP LOSS:
${risk.stopLoss}

TAKE PROFIT 1:
${risk.takeProfit1}

TAKE PROFIT 2:
${risk.takeProfit2}



📊 INDICATORS

EMA:
${result.indicators.trend}

RSI:
${result.indicators.RSI}


🧠 ICT

Liquidity:
${result.ict.liquidity}

BOS:
${result.ict.BOS}

FVG:
${result.ict.FVG.type}



💎 SMC

Structure:
${result.smc.structure}

Order Block:
${result.smc.orderBlock.type}



📐 FIBONACCI

Zone:
${result.fibonacci.zone}



📈 SNR

Zone:
${result.snr.zone.zone}



📊 VOLUME PROFILE

${result.volume.signal}



🌊 EWC

Bias:
${result.ewc.marketBias}



⚡ NIMIRA MD`;



        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text
            }
        );


    }
    catch(err){


        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
                "❌ Invalid coin or Binance Futures error"
            }
        );


    }

}



module.exports = {
    signalCommand
};
