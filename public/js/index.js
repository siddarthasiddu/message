var socket = io('http://localhost:3000');
console.log("naruot");


socket.on('message',function(msg){
  var li = document.getElementById("messages");
  var ul = document.createElement("ul");
  ul.textContent = msg;
  li.appendChild(ul);
});

$("#sendMsgBtn").on('click',function(e){
  var msg = $("#inputMsg").val();
  $("#inputMsg").val('');
  socket.emit('message',msg);

})