var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');



var HomeRoutes = require('./controllers/home_controller');
var AccountRoutes = require('./controllers/account_controller');

var port = process.env.PORT || 3000;


var app = express();
var http = require('http').createServer(app);
// var io = require('socket.io')(server);
global.io = require('socket.io')(http);;

io.on("connection",function(socket){
  console.log("Connectons Established");
});


app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(morgan('dev'));
app.use(session({secret: 'randomstringsessionsecret'}));

app.use('/',AccountRoutes.AccountRoutes);
app.use('/static', express.static('public'))
app.use(function(req,res,next){
  if(req.session.email == null || req.session.email.length ==0 ){
      res.redirect('/login'); 
  }
  else{
    next();
  }

});

app.use('/',HomeRoutes.HomeRoutes);

// io.on("connection",function(socket){
//   console.log("Connectons Established");
// });


// io.of('/chat').on("connection",function(socket){
//   console.log("SocketConnection Establised");

//   socket.on(channelHash,function(msg){
//       console.log("Fffcccccc "+msg+"  "+channelHash);
//       io.of('/chat').emit(channelHash,msg);
//   });
// });

// app.listen(port);
http.listen(port, "127.0.0.1");

