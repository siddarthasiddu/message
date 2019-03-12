var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var session = require('express-session');
var models = require('../models');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
var user_helper = require('./../helpers/user_helper');


var accountRoutes = express.Router();


// var correct_path = path.join(__dirname+'/../views/account/');
// var scripts_path = path.join(__dirname+'/../public/js/');
accountRoutes.get('/login',function(req,res){
    res.render('account/login');
});

accountRoutes.post('/login',function(req,res){

      
    var matched_users_promise = models.User.findAll({
        where: Sequelize.and(
            {email: req.body.email},
        )
    });
    matched_users_promise.then(function(users){
        //  
        //  
        if(users.length > 0){
            let user = users[0];
            //  
         
            
            let passwordHash = user.password;
            if(bcrypt.compareSync(req.body.password,passwordHash)){
                req.session.email = req.body.email;
                req.session.user_id = user.id;
                // res.redirect('/',{user_email: req.body.email});
                res.redirect('/');
            }
            else{
                res.redirect('/register');
            }
        }
        else{
            res.redirect('/login');
        }
    });
    
});

accountRoutes.get('/register',function(req,res){  
    res.render('account/register',{errors: ""});
});

accountRoutes.post('/register',function(req,res){
    var matched_users_promise = models.User.findAll({
        where:  Sequelize.or(
                {username: req.body.username},
                {email: req.body.email}
            )
        
    });
    matched_users_promise.then(function(users){
        if(users.length == 0){
            const passwordHash = bcrypt.hashSync(req.body.password,10);
            models.User.create({
                username: req.body.username,
                email: req.body.email,
                password: passwordHash
            }).then(function(user){
                let newSession = req.session;
                newSession.email = req.body.email;
                newSession.user_id = user.id;
                res.redirect('/');
            });
        }
        else{
            res.render('account/register',{errors: "Username or Email already in user"});
        }
    })
    
});

accountRoutes.get('/logout',function(req,res){
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
          if(err) {
            return res.redirect('/');
          } else {
            return res.redirect('/');
          }
        });
    }
});


module.exports = {"AccountRoutes" : accountRoutes};