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
    var user_promise = importantMethods.currentUser(req);
    user_promise.then(function(user){
        friends_promise.then(function(friends){
            console.log("ljsdhfjkshdfjkhsdjkfhasjkdfhjkasdhfhsfd");
            var friends_arr = [];
            res.render('home/index',{user_email: email,user: user,friends_row: friends});
        });
    })
    
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
                    var current_user = importantMethods.currentUser(req);
                    current_user.then(function(current_user){
                        res.render('home/user',{user: user,friends_row: friends,posts: posts,current_user: current_user});                
                    }).catch(function(e){
                        res.redirect('/');
                    });
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


HomeRoutes.get('/getFriendsPost',function(req,res){
    var index = req.params.index;
    console.log(" index  "+req.params.index);
    var user_promise
});

HomeRoutes.get('/getUserPost',function(req,res){
    var username = req.query.username;
    var index = req.query.index;
    console.log("**************************");
    console.log(req.query);
    console.log("***************");
    var limit = 10;
    var offset = limit * (index - 1);
    var user_id = req.session.user_id;
    // var user_promise = models.User.findAll({

    var post_promise = models.Post.findAll({
        where: {
            user_id: user_id
        },
        limit: limit,
        offset: offset
    });

    post_promise.then(function(posts){
        res.send([posts,{username: username}]);
    });

});

HomeRoutes.get('/getHomePagePosts',function(req,res){
    var username = req.query.username;
    var index = req.query.index;
    console.log("**************************");
    console.log(req.query);
    console.log("***************");
    var limit = 10;
    var offset = limit * (index - 1);
    var user_id = req.session.user_id;

    var friends_promise  = userHelper.get_friends(req.session.email);
    friends_promise.then(function(friends){
        var users_arr = [];
        users_arr[0] = {'user_id': user_id};
        for(var i=0;i<friends.length;i++){
            users_arr[i+1]={'user_id': friends[i].myfriend.id};
        }

        post_promise = models.Post.findAll({
            where: {
                $or: users_arr
            },
            limit: limit,
            offset: offset,
            include: [{
                model: models.User,
                as: 'user'
            }]
        });

        post_promise.then(function(posts){
            // res.send(posts);
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
            console.log(posts[0]);
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
            res.send([posts,{username: username}]);
        })
    });
});


module.exports = {"HomeRoutes" : HomeRoutes};