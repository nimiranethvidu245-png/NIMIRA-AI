const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const Pino = require("pino");
const qrcode = require("qrcode-terminal");

const { signalCommand } = require("./commands/signal");



async function startBot() {

    const { state, saveCreds } =
        await useMultiFileAuthState("./session");



    const sock = makeWASocket({

        auth: state,

        logger: Pino({
            level: "silent"
        })

    });



    sock.ev.on(
        "creds.update",
        saveCreds
    );



    sock.ev.on(
        "connection.update",
        (update) => {


            const {
                connection,
                lastDisconnect,
                qr
            } = update;



            if(qr) {

                console.log("Scan QR");

                qrcode.generate(
                    qr,
                    {
                        small:true
                    }
                );

            }



            if(connection === "open") {

                console.log(
                    "✅ NIMIRA MD CONNECTED"
                );

            }



            if(connection === "close") {


                const shouldReconnect =
                    lastDisconnect
                    ?.error
                    ?.output
                    ?.statusCode
                    !== DisconnectReason.loggedOut;



                if(shouldReconnect) {

                    console.log(
                        "♻️ Reconnecting..."
                    );

                    startBot();

                }

            }


        }
    );





    sock.ev.on(
        "messages.upsert",
        async ({messages}) => {


            const msg = messages[0];


            if(!msg.message)
                return;


            if(msg.key.fromMe)
                return;



            const text =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                "";



            const args =
                text.trim().split(/\s+/);



            if(
                args[0]?.toLowerCase()
                === ".signal"
            ) {


                await signalCommand(
                    sock,
                    msg,
                    args.slice(1)
                );


            }


        }
    );

}


startBot();
