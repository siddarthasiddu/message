var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var HomeRoutes = express.Router();
var models = require('../models');
var Sequelize = require('sequelize');

var exports = module.exports = {};

exports.get_friends = function(email){

  return new Promise(function(resolve,reject){
    let user  = undefined;
    var matched_users_promise = models.User.findAll({
      where: Sequelize.and(
        {email: email}
      ),
    });
    console.log(matched_users_promise);
    matched_users_promise.then(function(users){
      console.log(users.length+"   "+users);
      if(users.length > 0){
        user = users[0];

        var friends_relation = models.Friend.findAll({
          where:{
            user_id : user.id
          },
          include: [{
            model: models.User,
            as: 'myfriend',
            where: {
              id: {$col: 'Friend.friend_id'}
            }
          }]
        });
      
        friends_relation.then(function(rows){
          console.log(":nartuioio;iui");
          resolve(rows);
        });
      }
      else{
        resolve(null);
      }
    });
  });
}

exports.get_posts = function(user){
  return new Promise(function(resolve,reject){
    var posts_promise = models.Post.findAll({
      where:{
        user_id: user.id
      }
    })

    posts_promise.then(function(posts){
      resolve(posts);
    }).catch(function(e){
      resolve(null);
    });
  });
}

exports.are_friends = function(user_id,friend_id){
  return new Promise(function(resolve,reject){
    var friend_promise = models.Friend.findAll({
      where: {
        user_id: user_id,
        friend_id: friend_id
      }
    });

    friend_promise.then(function(relation){
      if(relation.length > 0 ){
        resolve(true)
      }
      else{
        resolve(false)
      }
    }).catch(function(e){
      resolve(false)
    })
  });
}
