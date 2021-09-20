   
function updateNotice(notices){
  var oldNoticeCount = 0;
  var newNoticeCount = 0;
  var cls = notices;
   
    cls.forEach(function(notice) {
      oldNoticeCount++;
    });
    setInterval(async function() {

      var sdsdfds = await $.ajax({
        url: '/user/notices/all',
        type: 'GET',
        success: function(result) {
          newNoticeCount = 0;
          $('.notifications').empty()
          result.forEach(function(notice) {
            newNoticeCount++;
            var tempNotice = `<a href="/user/notice/${notice._id}" class="dropdown-item">
      <div class="item-thumbnail">
        <div class="item-icon bg-warning">
          <i class="mdi mdi-settings mx-0"></i>
        </div>
      </div>
      <div class="item-content">
        <h6 class="font-weight-normal">${notice.notice.substring(0,25)}...</h6>
      </div>
    </a>`;
            $(".notifications").append(tempNotice)

          });

        },
        error: function(result, status, error) {
          console.log("something went wrong");
        }
      });
      // snack love athlete world result awkward forward plunge scorpion grape near door box doll vanish adapt gun result more riot witness play leisure flush

      if (newNoticeCount !== oldNoticeCount && newNoticeCount > oldNoticeCount) {
        oldNoticeCount = newNoticeCount;
        window.localStorage.setItem('notice', 'fdgtwet43erffesffsdFE334');
        $("#newNoticeCount").show();
      }

    }, 5000);


}
   


   function updateMessage(msg) {
     var oldNoticeCount = 0;
     var newNoticeCount = 0;
     var cls = msg;

     cls.forEach(function(notice) {
       oldNoticeCount++;
     });
     setInterval(async function() {

       var sdsdfds = await $.ajax({
         url: '/user/message/all',
         type: 'GET',
         success: function(result) {

           newNoticeCount = 0;
           $('.messages').empty()
           result.forEach(function(msg) {
            
             newNoticeCount++;
             var tempMsg = `<a class="dropdown-item" href="/user/messages/${ msg._id }">
    <div class="item-thumbnail">
      <img src="https://image.flaticon.com/icons/png/512/1077/1077114.png" alt="image" class="profile-pic">
    </div>
    <div class="item-content flex-grow">
      <h6 class="ellipsis font-weight-normal">${ msg.from.author.name }</h6>
      <p class="font-weight-light small-text text-muted mb-0">
        ${ msg.message.substring(0,25)}...
      </p>
    </div>
  </a>`;
             $(".messages").append(tempMsg)

           });

         },
         error: function(result, status, error) {
           console.log("something went wrong");
         }
       });
       // snack love athlete world result awkward forward plunge scorpion grape near door box doll vanish adapt gun result more riot witness play leisure flush

       if (newNoticeCount !== oldNoticeCount && newNoticeCount > oldNoticeCount) {
         oldNoticeCount = newNoticeCount;
         window.localStorage.setItem('messages', 'fdgtwet43erffesffsdFE334');
         $("#newMessageCount").show();
       }

     }, 5000);


   }








/*    var msg = new SpeechSynthesisUtterance();
    msg.text = "Hello Wordsf dsfdld";
    window.speechSynthesis.speak(msg);*/