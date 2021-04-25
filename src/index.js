//import dotenv
require('dotenv').config()

//import lib
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const fetch = require('node-fetch');

//import model
const ModelUser = require('./model');

//init mongodb
module.exports = mongoose.connect("mongodb://localhost/user_telegram").then(() => {
  console.log("Mongo conectado...");
})
.catch((err) =>{
  console.log("Erro de conecção com o mongo: ",err);
});

const CreateIdUser = mongoose.model('user');

// BOT
const token = process.env.TOKEN_TELEGRAM;

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Bem vindo ao R_Ofertas\nTrazemos a você ofertas e promoções,\nPara buscar ofertas basta digitar /help`); 

  CreateIdUser.findOne({
    // Pesquisar Usuario no mongodb
      id_user: `${msg.chat.id}`
    }).then((result) => {
      if (!result){
        //Cadastrar ID do usuário
        new CreateIdUser({
          id_user: msg.chat.id
        }).save().then((result) => {
          console.log('OK, inscrito adicionado');
        }).catch((err) => {
          console.log("ERROR: ",err);
        });
        
        bot.sendMessage(msg.chat.id, `Cadastrado com sucesso\nClick em /sair se deseja parar, cancelar inscrição`); 
      }else {
        bot.sendMessage(msg.chat.id, `Você já esta recebendo Ofertas \nClick em /sair se deseja parar, cancelar inscrição`); 
      }
    }).catch((err) => {
      console.log("ERROR: ",err);
    });

});

bot.onText(/\/sair/, (msg) => {

    // Delete Usuario do mongodb
    CreateIdUser.deleteOne({
      id_user: `${msg.chat.id}`
    }).then((result) => {
      if (!result){
        bot.sendMessage(msg.chat.id, `Você não esta cadastrado \n/start para retomar inscrição`); 
      }else {
        bot.sendMessage(msg.chat.id, `INSCRIÇÂO CANCELADA\n/start para retomar inscrição`); 
      }
    }).catch((err) => {
      console.log("ERROR: ",err);
    });

});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, `Bem vindo ao R_Ofertas, Sou seu bot de ofertas
    \nVocê pode me controlar enviando estes comandos:
    \n/start para começar, se inscrever 
    \n/sair para camcelar inscrição
    \n/help me pedir ajuda
    \n/smartphone para Ofertas
  `); 


bot.onText(/\/smartphone/, (msg) => {
  const token_lomadee = process.env.ID_LOMADEE;
  
  fetch(`http://sandbox-api.lomadee.com/v3/${token_lomadee}/offer/_category/77?sourceId=37057130`)
  .then(res => res.json())
  .then(json => {
    for (var i = 0; i < 5;i++){
      const img = json.offers[i].thumbnail; 
      const name_of = json.offers[i].name;
      const price_of = json.offers[i].price;
      const price_of_p = json.offers[i].installment.quantity;
      const price_of_q = json.offers[i].installment.value;
      const link_of = json.offers[i].link;
  
      bot.sendPhoto(msg.chat.id,`${img}`,{caption : `
        ${name_of} 
        \nPor apenas: R$ ${price_of},00 😱😱
        \nou ${price_of_p}x de R$ ${price_of_q} 💳
        \n🛒 Link de compra: ${link_of} 
        `} );  
    }
  });
});

});

bot.on('message', (msg) => {
    
  var Hi = "hi";
  if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
  bot.sendMessage(msg.chat.id,"Hello dear user");
  } 
      
  });

  bot.on('new_chat_members', (msg) => {
    bot.sendMessage(msg.chat.id, `Olá ${msg.from.first_name}, bem vindo ao Devs SC!! Conte-nos um pouco sobre você, com o que trabalha e onde, se possivel é claro`)
 });