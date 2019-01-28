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
          // if(rows.length > 0){
          //   resolve(rows);
          // }
          // else{
          //   resolve(null);
          // }
        });
      }
      else{
        resolve(null);
      }
    });
  });
}
