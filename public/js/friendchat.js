var x = document.URL;
console.log(x);
var socket = io('/chat');
console.log("naruot");
var channelName = $("#hashValue")[0].textContent;
console.log("channelname = "+channelName);

var from = $("#from")[0].textContent;
var to = $("#to")[0].textContent;



socket.on(channelName,function(msg){
  console.log("recived "+msg.value);
  var li = document.getElementById("messages");
  var ul = document.createElement("ul");
  ul.textContent = msg.from+" :  "+msg.value;
  li.appendChild(ul);
});

$("#sendMsgBtn").on('click',function(e){
  
  var value = $("#inputMsg").val();
  $("#inputMsg").val('');
  console.log("Sent "+value);
  msg = {}
  msg.value = value;
  msg.from = from;
  msg.to = to;
  console.log("send msg = "+msg);

  socket.emit(channelName,msg);

})