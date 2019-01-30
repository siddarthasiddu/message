var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var importantMethods = require('./important_methods');
var path = require('path');
var HomeRoutes = express.Router();
var models = require('../models');
var socketHelper = require('./../helpers/socket_helper');
var userHelper = require('./../helpers/user_helper');

var correct_path = path.join(__dirname+'/../views/home/');

HomeRoutes.get('/',function(req,res){
    
    let email = req.session.email;
    var friends_promise = userHelper.get_friends(email);

    friends_promise.then(function(friends){
        console.log("ljsdhfjkshdfjkhsdjkfhasjkdfhjkasdhfhsfd");
        var friends_arr = [];
        res.render('home/index',{user_email: email,friends_row: friends});
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


HomeRoutes.get('/user/:username',function(req,res){
    var user_promise = models.User.findAll({
        where:{
            username: req.params.username
        }
    });

    user_promise.then(function(users){
        var user = undefined;
        if(users.length > 0){
            user = users[0];
            var friends_promise = userHelper.get_friends(user.email);
            friends_promise.then(function(friends){
                var posts_promise = userHelper.get_posts(user);
                posts_promise.then(function(posts){
                    res.render('home/user',{user: user,friends_row: friends,posts: posts});
                }).catch(function(e){
                    res.redirect('/');
                });
            }).catch(function(e){
                res.redirect('/');
            });
        }
    });
});

HomeRoutes.post('/createpost',function(req,res){
    console.log("**************************");
    console.log(req.session.email);
    console.log("**************************");
    var user_promise = importantMethods.currentUser(req);
    user_promise.then(function(user){
        console.log(req.body);
        console.log("title+ "+ req.body.post_title);
        console.log("content+ "+ req.body.post_body);
        models.Post.create({
            user_id: user.id,
            content: req.body.post_body,
            title: req.body.post_title,
        }).then(function(post){
            res.redirect('/');
        }).catch(function(e){
            res.redirect('/')
        });
    });
});



module.exports = {"HomeRoutes" : HomeRoutes};