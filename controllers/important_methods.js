var models = require('../models');
var Sequelize = require('sequelize');
var md5 = require('md5');
var exports = module.exports = {};

exports.currentUser = function(req){
  let current_user = null;
  
  
  return new Promise(function( resolve, reject){
    if(req.session.email != null && req.session.email.length > 0){
      var matched_users_promise = models.User.findAll({
        where: Sequelize.and(
          {email: req.session.email},
        ),
      });
      matched_users_promise.then(function(users){
        if(users.length > 0){
          let user = users[0];
          // return user;
          resolve( user );
        }
        else{
          resolve( null );
        }
      });
    }

  });

};

exports.channelHash = function(users){
  var usersString = '';
  users.sort();
  for(var i=0;i<users.length;i++){
    usersString += users[i]; 
  }
  return md5(usersString);
}