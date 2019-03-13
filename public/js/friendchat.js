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
  console.log(msg);
  if(msg["to"] == from){
    receiveMessage(msg.value);
  }
});

$("#sendMsgBtn").on('click',function(e){
  sendMsg();
})

function sendMsg(){
  var value = $("#inputMsg").val();
  
  console.log("Sent "+value);
  msg = {}
  msg.value = value;
  msg.from = from;
  msg.to = to;
  console.log("send msg = "+msg);

  socket.emit(channelName,msg);

  newMessage();
}


$(".messages").animate({ scrollTop: $(document).height() }, "fast");

  $("#profile-img").click(function() {
    $("#status-options").toggleClass("active");
  });

  $(".expand-button").click(function() {
    $("#profile").toggleClass("expanded");
    $("#contacts").toggleClass("expanded");
  });

  $("#status-options ul li").click(function() {
    $("#profile-img").removeClass();
    $("#status-online").removeClass("active");
    $("#status-away").removeClass("active");
    $("#status-busy").removeClass("active");
    $("#status-offline").removeClass("active");
    $(this).addClass("active");
    
    if($("#status-online").hasClass("active")) {
      $("#profile-img").addClass("online");
    } else if ($("#status-away").hasClass("active")) {
      $("#profile-img").addClass("away");
    } else if ($("#status-busy").hasClass("active")) {
      $("#profile-img").addClass("busy");
    } else if ($("#status-offline").hasClass("active")) {
      $("#profile-img").addClass("offline");
    } else {
      $("#profile-img").removeClass();
    };
    
    $("#status-options").removeClass("active");
  });

  function newMessage() {
    message = $(".message-input input").val();
    if($.trim(message) == '') {
      return false;
    }
    $(`<li class="replies"><a href="/user/${from}"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /></a><p> ${message} </p></li>`).appendTo($('.messages ul'));
    $('.message-input input').val(null);
    $('.contact.active .preview').html('<span>You: </span>' + message);
    $(".messages").animate({ scrollTop: $(document).height() }, "fast");
  };

  function receiveMessage(message){
    // message = $(".message-input input").val();
    if($.trim(message) == '') {
      return false;
    }
    $(`<li class="sent"><a href="/user/${to}"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /></a><p> ${message} </p></li>`).appendTo($('.messages ul'));
    $('.message-input input').val(null);
    $('.contact.active .preview').html('<span>You: </span>' + message);
    $(".messages").animate({ scrollTop: $(document).height() }, "fast");


  }

  // $('.submit').click(function() {
  //   newMessage();
  // });

  $(window).on('keydown', function(e) {
    if (e.which == 13) {
      sendMsg();
      return false;
    }
  });