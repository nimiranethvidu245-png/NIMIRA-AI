const axios = require("axios");
const { analyzeMarket } = require("../lib/analysis");



async function getCandles(symbol) {

  const url =
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=15m&limit=100`;


  const res =
    await axios.get(url);


  return res.data.map(c => ({

    open: c[1],
    high: c[2],
    low: c[3],
    close: c[4],
    volume: c[5]

  }));

}




async function signalCommand(sock, msg, symbol) {


  try {


    const candles =
      await getCandles(symbol);


    const result =
      analyzeMarket(candles);



    const text =

`🤖 NIMIRA MD AI SIGNAL

PAIR: ${symbol}
TIMEFRAME: M15

SIGNAL: ${result.signal}

CONFIDENCE:
${result.confidence}

SCORE:
${result.score}

📊 INDICATORS
Trend: ${result.indicators.trend}
RSI: ${result.indicators.RSI}

🧠 ICT
Liquidity: ${result.ict.liquidity}
BOS: ${result.ict.BOS}

💎 SMC
Structure: ${result.smc.structure}

📐 FIB
Zone: ${result.fibonacci.zone}

📈 SNR
Zone: ${result.snr.zone.zone}

🌊 EWC
Bias: ${result.ewc.marketBias}

⚡ Volume
${result.volume.signal}

NIMIRA MD AI`;



    await sock.sendMessage(
      msg.key.remoteJid,
      { text }
    );


  } catch(e) {


    await sock.sendMessage(
      msg.key.remoteJid,
      {
        text:"❌ Signal error"
      }
    );


  }

}



module.exports = {

  signalCommand

};
