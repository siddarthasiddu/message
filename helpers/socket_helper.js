var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
// var importantMethods = require('./important_methods');
var path = require('path');
var HomeRoutes = express.Router();

var exports = module.exports = {};

exports.create_chat_channel = function(channelHash){
  io.of('/chat').on("connection",function(socket){
    console.log("SocketConnection Establised");
    if(socket._events == undefined || socket._events[channelHash] == undefined){
        socket.on(channelHash,function(msg){
          console.log("Fffcccccc "+msg+"  "+channelHash);
          io.of('/chat').emit(channelHash,msg);
        });
    }
  }); 
}
