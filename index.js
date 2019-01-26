var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var session = require('express-session');

var app = new express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


// var HomeRoutes = require('./controllers/home_controller');
// var AccountRoutes = require('./controllers/account_controller');
// var AttachmentRoutes = require('./controllers/attachment_controller');

var port = process.env.PORT || 3000;



app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(session({secret: 'skjadfhjweournssd'}));

app.use('/static', express.static('public'))

app.get('/',(req,res)=>{
  // res.send("Hello Worlds");
  res.render('home/index.ejs');
});

app.use(express.static('public'));

server.listen(port);

// var io = socket(server);

io.on("connection",function(socket){
  console.log("SocketConnection Establised");
  socket.on('message',function(msg){
    io.emit("message",msg);
  });
});