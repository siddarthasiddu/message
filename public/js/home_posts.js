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
        <div class="btn btn-light comment" style="text-align: center;"  onclick="pressComment(this, ${post.id})" >Comments(0)</div>
      </div>
    </div>
    <div class="commentSection hidden" postId="${post.id}" active="hidden"></div>
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

function pressComment(self,post_id){
  console.log("comment pressed post id = "+post_id);
  console.log(this);
  console.log(self);
  var commentSection =  $(`[postId=${post_id}]`);
  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  console.log(self.getAttribute("active"));
  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");



  if(!self.getAttribute("active")){




    self.setAttribute("active",true);
    self.classList.add("active");
    commentSection[0].classList.remove('hidden');
    $.ajax({
      url: '/comment',
      type: 'get',
      data: {
        post_id: post_id,
      },
      success: function(response){
        console.log(response);


        var commentList = "<div>";
        for(var i=0;i<response.length;i=i+1){
          var temp = `
          <div class="row" style="margin-bottom:15px">
            <div>
              <div class="image-cropper" style="margin:0 auto;height:35px;width:35px;margin-left:10px;margin-right:10px">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj5GtJ1ndkXb1l4QSGefsh4DRrW7VHFNNBZI6wqXrU8kDmJxex" class="rounded">
              </div>
            </div>
              
            <div style="width:80%;background:#F2F3F5;border-radius:15px">
              <div style="margin: 10px 10px 10px 10px">
                <span style="color:blue">${response[i].user.username}</span> ${response[i].content}
              </div>   
            </div>
          </div>
          `;
          commentList = commentList + temp;
        }
        commentList = commentList + "</div>"

        var commentContent = 
        `
        <hr>
        <div>
          <div class="row" style="margin-bottom:15px">
            <div>
              <div class="image-cropper" style="margin:0 auto;height:35px;width:35px;margin-left:10px;margin-right:10px">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj5GtJ1ndkXb1l4QSGefsh4DRrW7VHFNNBZI6wqXrU8kDmJxex" class="rounded">
              </div>
            </div>
              
            <div style="width:80%;">
              <form  style="width:100%" postId = "${post_id}" action="/comment" method="post" >
                <div style="width:100%;height:35px;border-radius:30px;border:1px solid rgba(28, 30, 33, 0.22);text-align:center;background-color:#F2F3F5">
                  <input class="input" type="text" name="comment" style="width:95%;border:0px;margin-top:5px;background-color:#F2F3F5" postId="${post_id}"> 
                  <input type="text" name="post_id" style="display: none" value="${post_id}">
                </div>   
              </form>
            </div>
          </div>
        </div>
        <div class="comments" postId = "${post_id}">${commentList}</div>
        `;
        commentSection.html(commentContent);

        $('.input').keypress(function (e) {
          if (e.which == 13) {
            console.log("enter");
            var local_post_id = this.getAttribute("postId");

            $('form').on('submit',function(e){
              e.preventDefault();
              console.log("started");
              var selected_form = $(`form[postId=${local_post_id}]`);
              $.ajax({
                  type: 'POST',
                  url: '/comment',
                  data: { comment: selected_form.find('input[name="comment"]').val(), 
                          post_id: selected_form.find('input[name="post_id"]').val() },
                  success: function(response){
                    console.log(response);
                    selected_form.find('input[name="comment"]').val("");
                  }
              });
              return false;
            });

            
            $(`form[postId=${local_post_id}]`).submit();     

          }
        });
      }
    });



     //get comments
    // var comments;
    // $.ajax({
    //   url: '/comment',
    //   type: "get",
    //   data: {
    //     post_id: post_id
    //   },
    //   success: function(response){
    //     comments = response;
    //     console.log(response);
    //     var commentsList = "";

    //     $(`.comments[postId=${post_id}]`).html(commentsList);
    //   }
    // });   


  }
  else{
    self.removeAttribute("active");
    self.classList.remove("active");
    commentSection[0].classList.add("hidden");
    commentSection.html("");
  }

}
