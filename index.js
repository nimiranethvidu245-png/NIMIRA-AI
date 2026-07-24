require("dotenv").config();

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const pino = require("pino");

async function startBot() {

  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    browser: ["NIMIRA MD", "Chrome", "1.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection } = update;

    if (connection === "open") {
      console.log("✅ NIMIRA MD Connected");
    }

    if (connection === "close") {
      console.log("❌ Connection Closed");
      startBot();
    }
  });


  sock.ev.on("messages.upsert", async ({ messages }) => {

    const msg = messages[0];

    if (!msg.message) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    if (text === ".menu") {

      await sock.sendMessage(
        msg.key.remoteJid,
        {
          text:
`🤖 NIMIRA MD AI BOT

Commands:

.signal BTCUSDT
.signal ETHUSDT
.signal XAUUSD

Powered by NIMIRA MD`
        }
      );

    }

    if (text === ".ping") {

      await sock.sendMessage(
        msg.key.remoteJid,
        {
          text: "🏓 NIMIRA MD Online"
        }
      );

    }

  });

}

startBot();
