process.env["NTBA_FIX_319"] = 1;
const TelegramBot = require('node-telegram-bot-api');
var request = require("request")
var knex = require("knex")({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'inst4bot'
    }
});
const token = '481809450:AAEuvKigRP6SeZYTlNGhuyu0C90UA_TZFAE';
const bot = new TelegramBot(token, {
    polling: true
});

//mando evento typing alla chat, perché fa figo
function sendTyping(cID) { bot.sendChatAction(cID, "typing") };

console.log("let's get started...");
/////////////////////////////////////////////////////
var chatsIDS = []
//abbreviazione perché sono pigro
let parse_HTML = {
    parse_mode: "HTML"
}

bot.onText(/\/(.+)/, function (msg, match) {
    console.log("Received:" + msg.text + "; From usrID:" + msg.from.id + "; whose names is:" + msg.from.id + "; From usrID:" + msg.from.id + "; In chat:" + msg.chat.id);
    let chatId = msg.chat.id;
    let msgTxt = msg.text.toString();
    let msg_id = msg.message_id;
    //abbreviazione da usare sul sendmessage per rispondere al messaggio
    let reply = {
        reply_to_message_id: msg.message_id
    };


    let arr = match[1].split(' ');
    let command = arr[0].toString();
    let arg = arr[1]
    console.log(match[1]);
    switch (command) {
        case "pp":
            sendTyping(chatId)
            proPic(arg);
            break;
        case "help":
            sendTyping(chatId)
            help();
            break;
        case "help@Inst4bot":
            sendTyping(chatId)
            help();
            break;
        case "adduser":
            sendTyping(chatId)
            adduser(arg);
            break;
        case "st":
            sendTyping(chatId)
            getUserStories(arg);
            break;

        default:
            //help()
            break;
    }

    function adduser() {
        //fare cose
    }

    function getUserStories(usr) {
        if (usr != null) {
            //prendo json dell'utente
            let jsonURL = "https://api.storiesig.com/stories/" + usr;
            let usrAcc = "https://www.instagram.com/" + usr;
            //controllare json imageversion2 o video o entrambi o BOOOOHHHH
            //mettere tutto in db everytime o non so sono stanco
        }
    }

    //posso decisamente risparmiare e riutilizzare del codice fra questi due metodi

    function proPic(usr) {
        if (usr != null) {
            //prendo json dell'utente
            let jsonURL = "https://www.instagram.com/" + usr + "/?__a=1";
            let usrAcc = "https://www.instagram.com/" + usr;
            //request json
            request({
                url: jsonURL,
                json: true
            }, function (error, response, body) {

                if (!error && response.statusCode === 200) {
                    //elemento json ritornato dalla richiesta
                    let tmp = body.user.profile_pic_url
                    //splitto agli slash per eliminare firma
                    //console.log(tmp);
                    let ppURL = tmp.split('/');
                    //console.log(ppURL);
                    //concateno elementi splittati e ottengo res originale
                    let finalURL = (ppURL[0] + '/' + ppURL[1] + '/' + ppURL[2] + '/' + ppURL[6] + '/' + ppURL[7] + '/' + ppURL[8]).replace('150x150', '').replace('/undefined', '');
                    //console.log(finalURL);
                    //image name per i senza immagine profilo
                    if (finalURL.indexOf("11906329_960233084022564_1448528159") !== -1) {
                        bot.sendMessage(chatId, "<a href=\"" + usrAcc + "\">" + usr + "\n" + "</a>" + "Non ha alcuna foto profilo", parse_HTML);
                    } else {
                        bot.sendMessage(chatId, "<a href=\"" + finalURL.toString() + "\">Foto profilo </a>" + "di " + "<a href=\"" + usrAcc + "\">" + usr + "</a>", parse_HTML);

                    }

                }
                if (error || response.statusCode != 200) {
                    bot.sendMessage(chatId, "Username non valido", reply);
                }
            })
        } else {
            bot.sendMessage(chatId, "Devi passarmi uno username", reply);
        }
    }

    function help() {
        bot.sendMessage(chatId, "Lista comandi:\n/pp username - ritorna foto profilo\ncomando1 - desc 1\ncomando2 - desc2", reply);
    }
})


// altre cose
/*
var stdin = process.openStdin();
{
stdin.addListener("data", function (d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
    //prendere il controllo del bot
    //id gruppo di classe
    bot.sendMessage("-1001060088404", d.toString());
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//SCOSSA?
bot.on('message', (msg) => {
    var t = msg.text.toString()
    if (t.toUpperCase() == "SCOSSA?") {
        bot.sendMessage(msg.chat.id, "VA B" + getE(250) + "N" + getE(150));

        function getE(taac) {
            let letter = "E";
            for (i = 0; i < getRandomInt(4, taac); i++) {
                letter += "E";
            }
            return letter;
        }
    } //Goodboi.
    else if (t.toUpperCase() == "ARRAYS START AT 0" || t.toUpperCase() == "ARRAY START AT 0") {
        bot.sendMessage(msg.chat.id, "Good boi");
    }
})
*/