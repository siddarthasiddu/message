var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var importantMethods = require('./important_methods');
var path = require('path');
var HomeRoutes = express.Router();

var socketHelper = require('./../helpers/socket_helper');

// var io = require('./../server.js');
// console.log(app);
// var server = require('http').createServer(app);
// var io = require('socket.io')(server);


var correct_path = path.join(__dirname+'/../views/home/');
// var scripts_path = path.join(__dirname+'/../public/js/');
HomeRoutes.get('/',function(req,res){
    // res.send("Naruto");
    let siddu = "ohh shit";
    let email = req.session.email;
    
    // res.render('home/index',{"scripts_path":scripts_path}); 

    res.render('home/index',{user_email: email});
});

HomeRoutes.get('/chat/:username',function(req,res){
    
    var users = [];
    userPromise = importantMethods.currentUser(req);
    userPromise.then(function(user){
        users[0] = user.username;
        users[1] = req.params.username;

        var channelHash = importantMethods.channelHash(users);
        console.log("channel hash "+channelHash+"      "+users[0]+"     "+users[1]);

        socketHelper.create_chat_channel(channelHash);
        
        res.render('home/friendchat',{hash: channelHash,from: user.username,to: req.params.username})
    });
    
      
    
    
});


module.exports = {"HomeRoutes" : HomeRoutes};