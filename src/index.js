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
const token = '';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Bem vindo ao Promoções BR\nTrazemos a você ofertas e promoções,\nPara buscar ofertas basta digitar /help`); 

  CreateIdUser.findOne({
    // Pesquisar Usuario no mongodb
      id_user: `${msg.chat.id}`
    }).then((result) => {
      if (!result){
        //Cadastrar ID do usuário
        new CreateIdUser({
          id_user: msg.chat.id
        }).save().then((result) => {
          console.log('OK, você esta inscrito');
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
