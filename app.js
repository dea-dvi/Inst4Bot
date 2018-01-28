
process.env["NTBA_FIX_319"] = 1;
const TelegramBot = require('node-telegram-bot-api');
var request = require("request")
//const orario = require('./orario.js');
const token = '481809450:AAEuvKigRP6SeZYTlNGhuyu0C90UA_TZFAE';

var chatsIDS = []
//console.log(orario.lunedì)
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });


//check messages
bot.on('message', (msg) => {
    let chatId = msg.chat.id;
    let messagetext = msg.text.toString();
    if (messagetext.indexOf("/pp") != -1) {
        //splitto sullo spazio per prendermi l'username
        let r = messagetext.split(' ');
        if (r[1] != undefined) {
            let usr = r[1].toString();
            //prendo json dell'utente
            let jsonURL = "https://www.instagram.com/" + usr + "/?__a=1";
            //request json
            request({
                url: jsonURL,
                json: true
            }, function (error, response, body) {

                if (!error && response.statusCode === 200) {
                    //elemento json ritornato dalla richiesta
                    let tmp = body.user.profile_pic_url
                    //splitto agli slash per eliminare firma
                    let ppURL = tmp.split('/');
                    //concateno elementi splittati e ottengo res originale
                    let finalURL = (ppURL[0] + '/' + ppURL[1] + '/' + ppURL[2] + '/' + ppURL[6] + '/' + ppURL[7] + '/' + ppURL[8]).replace('150x150', '');
                    //console.log(finalURL);
                    bot.sendMessage(chatId, finalURL.toString());
                }
                if (response.statusCode != 200){
                    bot.sendMessage(chatId, "Username non valido");
                }
            })
        }
        else{
            bot.sendMessage(chatId, "Devi passarmi uno username");
        }

    }

})
