var index = 1;
var username = location.pathname.split('/')[2];

var element  = $('body')[0];
$(window).scroll(function() {
    // var element = event.target;
    // console.log(`${element.scrollHeight - element.scrollTop }     ${element.clientHeight}`);
    if (element.scrollHeight - element.scrollTop === element.clientHeight )
    {
      console.log('scrolled');
      // alert("bottom");
      getPostData();
      index++;
        
    }
});

// $("p").append("<b>Appended text</b>");

function appendPosts(response){
  var htmlcontent = ""
  var posts = response[0];
  var currentuser_id = response[1].currentuser_id;
  
  for(var i=0;i<posts.length;i++){
    var post = posts[i];
    var user = posts[i].user;
    var likes = posts[i].likes;
    var postcontent = ""
    //---------------------------
    var liked_class = "";

    for(var j=0;j < likes.length;j = j+1){
      if(likes[j].user_id == currentuser_id){
        liked_class = "active";       
      }
    }

    postcontent = ` <div id="userprofile" class="" style="background-color:white;width:100%;margin:10 auto;;border: 1px solid #e1e4e8;padding:15px 15px 8px 15px;">    
    <div class="row" style="margin-bottom:15px">
      <div>
          <div class="image-cropper" style="margin:0 auto;height:40px;width:40px;margin-left:10px;margin-right:10px">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj5GtJ1ndkXb1l4QSGefsh4DRrW7VHFNNBZI6wqXrU8kDmJxex" class="rounded" />
          </div>
      </div>
        
      <div>
          <div style="font-weight: 600">${user.username}</div>
          <div style="font-size:10px"> ${post.createdAt.toLocaleString()}</div>
      </div>
    
      
    </div>
    
   
    <h4 style="margin-bottom:0px;margin-top:5px;font-weight: 550 !important">${post.title}</h4>
    <div> ${post.content} </div>
    <div class="likedCommentCount">
      <div  style="float:left"><img src="static/icons/like.svg" style="height:18px"> ${post.likes.length}</div>
      <div style="float:right">0 comments</div>
    </div>
    <hr style="margin-bottom:5px">
    <div class="row" style="margin-top:0px">
      <div class="col-md-6 col-xl-6 col-sm-6 col-lg-6 likecommentparent">
        <div class="btn btn-light like ${liked_class}" style="text-align: center;" onclick="pressLike(this, ${post.id})" >Like</div>
      </div>
      <div class="col-md-6 col-xl-6 col-sm-6 col-lg-6 likecommentparent">
        <div class="btn btn-light comment" style="text-align: center;" onclick="console.log('ffcc')">Comments(0)</div>
      </div>
    </div>
  </div>`


    //--------------------------
    htmlcontent += postcontent;
  }
  
  $("#userPostsList").append(htmlcontent);
}

function getPostData(){
  $.ajax({
    url: "/getHomePagePosts",
    type: "get", //send it through get method
    data: { 
      index: index, 
      username: username, 
    },
    success: function(response) {
      //Do Something
      console.log(response);
      appendPosts(response);
    },
    error: function(xhr) {
      //Do Something to handle error
    }
  });
}

getPostData();
index++;


function pressLike(self,post_id){
  console.log("like pressed post id="+post_id);
  console.log(this);
  console.log(self);

  $.ajax({
    url: '/likepost',
    type: 'get',
    data: {
      post_id: post_id,
      type: 'like'
    },
    success: function(response){
      console.log(response);
      let liked = response.like;
      if(liked){
        self.classList.add("active");
        self.setAttribute("active",true)
      }else{
        self.classList.remove("active");
        self.removeAttribute("active")
      }
    },
    error: function(xhr){

    }
  });



}
