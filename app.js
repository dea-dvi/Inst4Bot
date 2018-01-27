
const TelegramBot = require('node-telegram-bot-api');
//const orario = require('./orario.js');
const token = '481809450:AAEuvKigRP6SeZYTlNGhuyu0C90UA_TZFAE';

var chatsIDS=[]
//console.log(orario.lunedì)
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


//check messages
bot.on('message', (msg) => {
    let chatId       = msg.chat.id;    
    let messagetext    = msg.text.toString();
    if(messagetext.indexOf("/pp")!=-1){
        let r = messagetext.split(' ');
        bot.sendMessage(chatId, r[1].toString());
    }
        

})
/*
    switch (true) {
        case ((messagetext.indexOf("/setverifica")!=-1)):
            messagetext=messagetext.replace("/setverifica ","")
        
            let arr = messagetext.split(',')
            addVerifica(chatId, arr[0],arr[1],arr[2])
            
            break;

        case (messagetext.indexOf("/calendario")!=-1):
            
            messagetext=messagetext.replace("/calendario","")
            calendario(chatId)
            break;

        case (messagetext.indexOf("/orario")!=-1):
                getorario(chatId);
            break;
        case "":
            
            break;

    
        default:
            break;

    }  
    AddChatID(chatId);
});

function cambiagiorno() {
    let date = new Date();
    let inviato =false;
    setInterval(()=>{
        let anotherDate=new Date()
        if(anotherDate.getDay()!=date.getDate()){
            inviato= verificaDomani(inviato)
        }
        
    },1000*60 *60)
}
*/
/*
function verificaDomani(inviato){
    if(!inviato)
    {
        let date= new Date()
        let msg="";
        for (let index = 0; index < verifiche.length; index++) {
            let daynumber=verifiche[index].data.split('-')[0]
            if(daynumber == date.setDate(date.getDate()+1).getDate()){
                if(msg=="")
                    msg+=("Domani verifica di \n\n")
                msg+=("**"+verifiche[index].materia+"**\n " + verifiche[index].argomenti+"\n")
                
            }
        
        }

//data = "23-12-2017"

        for (let index = 0; index < chatsIDS.length; index++) 
            bot.sendMessage(chatsIDS[index], msg)
        
        inviato=true;
    }
    return inviato;






function addVerifica(chatId,m, a, d) {
    let obj={materia:m,argomenti:a,data:d}
    verifiche.push(obj);
    bot.sendMessage(chatId, "Aggiunta verifica di: "+m+" il giorno: "+d+" \nArgomenti: "+a);
}

function calendario(chatId){
    let msg="";
    

    for (let index = 0; index < verifiche.length; index++) 
        msg+=(verifiche[index].materia+" "+verifiche[index].data+"\n");
    if(msg=="")
        bot.sendMessage(chatId, "Nessuna verifica nel calendario.");
    else bot.sendMessage(chatId, msg);
}
function getorario(chatId) {
    let date = new Date();
    let day  = date.getDay();
    switch (day) {
        case 2:
        bot.sendMessage(chatId, orario.martedì);
            break;
        case 3:
        bot.sendMessage(chatId, orario.mercoledì);
            break;
        case 4:
        bot.sendMessage(chatId, orario.giovedì);
            break;
        case 5:
        bot.sendMessage(chatId, orario.venerdì);
            break;
        default:
        bot.sendMessage(chatId, orario.lunedì);
            break;
    }

}


function AddChatID(chatId) {
    let alreadyin=false;
    for (var index = 0; index < chatsIDS.length; index++) 
        if(chatId==chatsIDS[index])
            alreadyin=true;
    if(!alreadyin)
        chatsIDS.push(chatId)
}
}*/