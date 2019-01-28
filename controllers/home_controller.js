var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var importantMethods = require('./important_methods');
var path = require('path');
var HomeRoutes = express.Router();

var socketHelper = require('./../helpers/socket_helper');
var userHelper = require('./../helpers/user_helper');

var correct_path = path.join(__dirname+'/../views/home/');

HomeRoutes.get('/',function(req,res){
    
    let email = req.session.email;
    var friends_promise = userHelper.get_friends(email);

    friends_promise.then(function(friends){
        console.log(friends[0].myfriend.username);
        var friends_arr = [];
        for(var i=0;i<friends.length;i = i+1){
            friends_arr += friends[i].myfriend; 
        }
        console.log(friends_arr);
        console.log("fcckckk");
        res.render('home/index',{user_email: email,friends: friends_arr});
    });

    
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