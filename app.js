//un fix per la api
process.env["NTBA_FIX_319"] = 1;

const TelegramBot = require('node-telegram-bot-api');
var request = require("request");
var privSettings = require("./private_settings");

const bot = new TelegramBot(privSettings.token, {
    polling: true
});

//mando evento typing alla chat, perché fa figo
function sendTyping(cID) {
    bot.sendChatAction(cID, "typing")
};

console.log("let's get started...");
/////////////////////////////////////////////////////
var chatsIDS = [];
//abbreviazione perché sono pigro
let parse_HTML = {
    parse_mode: "HTML"
}
let parse_Markdown = {
    parse_mode: "Markdown"
}

bot.onText(/\/(.+)/, function (msg, match) {
    let chat_id = msg.chat.id;
    let msgTxt = msg.text.toString();
    let msg_id = msg.message_id;
    let usr_id = msg.from.id;
    console.log(`Received:${msgTxt}; From userid:${usr_id}; Firstname:${msg.from.first_name}; In chat:${msg.chat.id}`);
    //abbreviazione da usare sul sendmessage per rispondere al messaggio
    let reply = {
        reply_to_message_id: msg.message_id
    };

    let arr = match[1].split(' ');
    let command = arr[0].toString();
    let arg = arr[1];
    let opt; //opzioni comandi [-g -i]
    console.log("command: " + command);
    switch (command) {
        case "pp":
            sendTyping(chat_id);
            getProPic(arg);
            break;
        case "help":
            sendTyping(chat_id);
            help();
            break;
        case "help@Inst4bot":
            sendTyping(chat_id);
            help();
            break;
        case "adduser":
            sendTyping(chat_id);
            adduser(arg);
            break;
        case "st":
            sendTyping(chat_id);
            getUserStories(arg);
            break;
        case "settings":
            settings();
            break;
        case "profile":
            getProfileInfo();
            break;
        case "settings":
            settings();
            break;
    }

    function adduser() {
        //fare cose
    }

    //funzione per pulire gli url dalla firma e dalla size e imgcache 
    //passato array ritorna array

    function getCleanURLs(a) {
        function f(g) {
            let c = g.split('/');
            //concateno elementi splittati e ottengo res originale e altre cose
            let d = (c[0] + '/' + c[1] + '/' + c[2] + '/' + c[6] + '/' + c[7] + '/' + c[8]).replace('150x150', '').replace('/undefined', '').split("?");
            return d[0];
        }
        if (Array.isArray(a)) {
            let e = [];
            a.forEach(b => {
                e.push(f(b));
            });
            return e;
        } else if (!Array.isArray(a) && !null) {
            return f(a);
        }
        //per immagini profilo, singolo elemento
        return 0;
    }

    function getStoriesMedia(a) {
        let c = [];
        if (a != null) {
            a.forEach(b => {
                //mediatype 1 = foto, 2 = video
                if (b.media_type == 1) {
                    c.push(b.image_versions2.candidates[0].url);
                } else if (b.media_type == 2) {
                    c.push(b.video_versions[0].url);
                }
            });
            return c;
        }
        return 0;


    }
    //takes an array and returns string formatted
    function arrToStrFormatted(a) {
        if (a != 0) {
            return a.toString().split(",").join(",  ");
        }
        return 0;
    }

    function arrToMkdTxt(a) {
        if (a != 0) {
            let c = [];
            let d = 0;
            a.forEach(b => {
                c.push(`[${d}](${b})`)
                d++;
            });
            //console.log(c);
            return c;
        }
        return 0;
    }

    function getUserStories(usr) {
        if (usr != null) {
            //prendo json dell'utente
            let jsonURL = "https://api.storiesig.com/stories/" + usr;
            let usrAcc = "https://www.instagram.com/" + usr;
            request({
                url: jsonURL,
                json: true
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    if (body.user.is_private == false) {
                        //contiene urls media
                        let media = getStoriesMedia(body.items);
                        //contiene url senza firma ecc
                        let a = getCleanURLs(media);
                        //preparo per mandare con parseMarkdown e formatto
                        let mess = arrToStrFormatted(arrToMkdTxt(a)); //yea it's a mess
                        if (mess == 0) {
                            bot.sendMessage(chat_id, "Nessuna storia", reply);
                        } else {
                            bot.sendMessage(chat_id, `Storie di [${usr}](${usrAcc})\n ` + mess, parse_Markdown);
                        }
                    } else if (body.user.is_private == true) {
                        bot.sendMessage(chat_id, "Profilo privato :(", reply);
                    }

                }

            })
            //mettere tutto in db everytime o non so sono stanco
            //magari fare un inline keyboard chiedendo all'utente di selezionare quale storia vuole vedere, o se farle mandare tutte
        } else {
            bot.sendMessage(chat_id, "Devi passarmi uno username", reply);
        }
    }
    // fare funzione request separata
    // gestire messaggio stories con markdown
    //posso decisamente risparmiare e riutilizzare del codice fra questi due metodi, utilizzare db magari

    function getProPic(usr) {
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
                    //let a = body.user.profile_pic_url;
                    //controllare errori es return 0 nelle funzioni sopra
                    let finalURL = getCleanURLs(body.user.profile_pic_url);
                    //console.log(finalURL);
                    //image name per i senza immagine profilo
                    if (finalURL.indexOf("11906329_960233084022564_1448528159") !== -1) {
                        bot.sendMessage(chat_id, "<a href=\"" + usrAcc + "\">" + usr + "\n" + "</a>" + "Non ha alcuna foto profilo", parse_HTML);
                    } else {
                        bot.sendMessage(chat_id, "<a href=\"" + finalURL.toString() + "\">Foto profilo </a>" + "di " + "<a href=\"" + usrAcc + "\">" + usr + "</a>", parse_HTML);

                    }

                }
                if (error || response.statusCode != 200) {
                    bot.sendMessage(chat_id, "Username inesistente", reply);
                }
            })
        } else {
            bot.sendMessage(chat_id, "Devi passarmi uno username", reply);
        }
    }

    function settings() {
        if (usr_id != privSettings.masterUser) {
            bot.sendMessage(chat_id, "Cazzo troppo corto", reply);
        } else {
            bot.sendMessage(chat_id, "Hey boss", reply);
            //fare cose
        }
    }

    function help() {
        bot.sendMessage(chat_id, "Lista comandi:\n/pp username - ritorna foto profilo\n/st username - ritorna stories utente", reply);
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