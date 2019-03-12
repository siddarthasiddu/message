var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var importantMethods = require('./important_methods');
var path = require('path');
var HomeRoutes = express.Router();
var models = require('../models');
var socketHelper = require('./../helpers/socket_helper');
var userHelper = require('./../helpers/user_helper');
var Sequelize = require('sequelize');

var correct_path = path.join(__dirname+'/../views/home/');

HomeRoutes.get('/',function(req,res){
    
    let email = req.session.email;
    var friends_promise = userHelper.get_friends(email);
    var user_promise = importantMethods.currentUser(req);
    user_promise.then(function(user){
        friends_promise.then(function(friends){
            // console.log("ljsdhfjkshdfjkhsdjkfhasjkdfhjkasdhfhsfd");
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
        // console.log("channel hash "+channelHash+"      "+users[0]+"     "+users[1]);

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
                        var is_friend_promise = userHelper.are_friends(current_user.id,user.id);
                        is_friend_promise.then(function(relation){
                            res.render('home/user',{user: user,friends_row: friends,posts: posts,current_user: current_user,is_friend: relation});
                        });
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
    // console.log("**************************");
    // console.log(req.session.email);
    // console.log("**************************");
    var user_promise = importantMethods.currentUser(req);
    user_promise.then(function(user){
        // console.log(req.body);
        // console.log("title+ "+ req.body.post_title);
        // console.log("content+ "+ req.body.post_body);
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
    // console.log(" index  "+req.params.index);
    var user_promise
});

HomeRoutes.get('/getUserPost',function(req,res){
    var username = req.query.username;
    var index = req.query.index;
    // console.log("**************************");
    // console.log(req.query);
    // console.log("***************");
    var limit = 10;
    var offset = limit * (index - 1);
    // var user_id = req.session.user_id;
    // var user_promise = models.User.findAll({
    var user_promise = models.User.findAll({
        where: {
            username: username
        }
    });

    user_promise.then(function(users){
        if(users.length>0){
            let user = users[0];

            var post_promise = models.Post.findAll({
                where: {
                    user_id: user.id
                },
                limit: limit,
                offset: offset
            });

            post_promise.then(function(posts){
                res.send([posts,{username: username}]);
            });
        }
    });


});

HomeRoutes.get('/getHomePagePosts',function(req,res){
    var currentuser_id = req.session.user_id;
    var index = req.query.index;
    // console.log("**************************");
    // console.log(req.query);
    // console.log("***************");
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
            },
            {
                model: models.Like,
                as: 'likes',
                // on: { '$Post.id$' : {$col: 'Like.parent_id'}}
            }],
            order: [['updatedAt','DESC']]
        });

        post_promise.then(function(posts){

            res.send([posts,{currentuser_id: currentuser_id}]);
        })
    });
});

HomeRoutes.get('/search',function(req,res){
    var search_query_name = req.query.keyword;

    var search_results_promise = models.User.findAll({
        where: {
            $or: [
                {
                    'username': {
                        // $iLike: `%${search_query_name}%`
                        [Sequelize.Op.like]: `%${search_query_name}%`  
                    }
                },
                {
                    'firstname': {
                        // $iLike: `%${search_query_name}%`
                        [Sequelize.Op.like]: `%${search_query_name}%`  

                    }
                },
                {
                    'lastname': {
                        // $iLike: `%${search_query_name}%`
                        [Sequelize.Op.like]: `%${search_query_name}%`  

                    }
                }
                ,
                {
                    'email': {
                        // $iLike: `%${search_query_name}%`
                        [Sequelize.Op.like]: `%${search_query_name}%`  

                    }
                }
                
            ]  
        }
    });

    search_results_promise.then(function(users){
        res.render('home/search',{'users': users});
    })

});

HomeRoutes.get('/likepost',function(req,res){

    let post_id = req.query.post_id;
    let type= req.query.type;
    var user_promise = importantMethods.currentUser(req); 
    
    user_promise.then(function(user){
       post_promise = models.Post.findAll({
            where:{
                id: post_id
            }
       });

       post_promise.then(function(posts){
            if(posts.length>0){
                let post = posts[0];
                like_promise = models.Like.findAll({
                    where:{
                        parent_id: post.id,
                        user_id: user.id,
                        type: type
                    }
                });

                like_promise.then(function(likes){
                    if(likes.length == 0){
                        models.Like.create({
                            user_id: user.id,
                            parent_id: post.id,
                            type: 'like'
                        }).then(function(like){
                            res.send({like: true,error: false})
                        });

                    }else{

                       let like = likes[0];
                        // like.destroy().on('success',function(u){
                        //     if (u && u.deletedAt) {
                        //         res.send({like: false,error: false});
                        //     }
                        //     else{
                        //         res.send({like: false,error: true});
                        //     }
                        // }).on('error',function(){
                        //     res.send({like: false,error: true});
                        // });

                        like.destroy(function(err) {
                            if(err) {
                                res.send({like: false,error: true});
                            }
                          }                           
                        ).then(function(like){
                            // console.log(like);
                            res.send({like: false,error: false});
                        });
                    }
                })

            }
       });
    })

});

HomeRoutes.get('/comment',function(req,res){
    let post_id = req.query.post_id;
    
    comments_promise = models.Comment.findAll({
        where:{
            post_id: post_id
        },
        include: [{
            model: models.User,
            as: 'user'
        }]
    });

    comments_promise.then(function(comments){
        res.send(comments);
    });
});

HomeRoutes.post('/comment',function(req,res){
    let post_id = req.body.post_id;
    let commentString = req.body.comment;
    // console.log(req.body.comment);
    // console.log(post_id+"    "+commentString);
    res.send("asd");

    models.Comment.create({
        user_id: req.session.user_id,
        post_id: post_id,
        content: commentString
    }).then(function(like){
        res.send({success: true});
    }).error(function(e){
        res.send({success: false});
    });

});

HomeRoutes.post('/follow_request',function(req,res){
    let current_user_id = req.session.user_id;
    let user_id = req.body.user_id;
    

    models.Friend.findAll({
        where:{
            user_id: current_user_id,
            friend_id: user_id
        }
    }).then(function(friends){
        if(friends == undefined || friends.length == 0 ){
            models.Friend.create({
                user_id: current_user_id,
                friend_id: user_id
            }).then((friend)=>{
                res.send({success: true});
            }).error((e)=>{
                res.send({success: false});
            })
        }else{
            res.send({success: true});
        }
    })

});

HomeRoutes.post('/unfollow_request',function(req,res){
    let current_user_id = req.session.user_id;
    let user_id = req.body.user_id;
    console.log(`kdn ${current_user_id}    v  ${user_id}`);

    models.Friend.findAll({
        where:{
            user_id: current_user_id,
            friend_id: user_id
        }
    }).then(function(friends){
        console.log("(************************)");
        console.log(friends);
        console.log("(************************)");
        if(friends != undefined || friends.length > 0 ){
            models.Friend.destroy({
                where:{
                    user_id: current_user_id,
                    friend_id: user_id
                }
            }).then((friend)=>{
                res.send({success: true});
            }).error((e)=>{
                res.send({success: false});
            })
        }else{
            res.send({success: true});
        }
    })

});




module.exports = {"HomeRoutes" : HomeRoutes};