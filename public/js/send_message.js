$(".oneTimeNotification").html('<div class="alert alert-success success" role="alert" >Message sucessfully sent</div><div class="alert alert-danger error" role="alert" >Message not sent</div>')



var tempUser;
$(".searchResult").hide();
$(".notification").hide();
$(".success").hide();
$(".error").hide();

$("#userInformation").on("change", function() {

  if ($(".roll").val() !== "") {

    var url = "/author/searchuser/" + $(".class").val() + "/" + $(".section").val() + "/" + $(".roll").val();

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.getResponseHeader('Content-type', 'application/json');
    xhr.onload = function() {
      if (this.status === 200) {

        res = JSON.parse(this.responseText);

        tempUser = res[0];

        if (res.length === 0) {
          $("#name").val("No user found");
        }
        res.forEach(function(user) {
          $("#name").val(user.name);
        });

      } else {
        $("#name").val("Some thing went wrong");
      }
    }

    xhr.send();


  }


});



$(".sent-message").on("submit", function() {

  $.ajax({
    url: '/author/message',
    type: 'POST',
    data: {
      name: tempUser.name,
      id: tempUser._id,
      class: tempUser.class,
      section: tempUser.section,
      roll: tempUser.roll,
      message: $("#message").val()
    },
    success: function(result) {


      if (result.success) {
        $(".success").show(300);

        clearInputs();
        setTimeout(function() {
          $(".success").hide(400);

        }, 4000)


      } else if (result.error) {

        $(".error").show(300);
        clearInputs();
        setTimeout(function() {
          $(".error").hide(400);

        }, 4000)

      }


    },
    error: function(result, status, error) {
      console.log("something went wrong");
    }
  });

})


function clearInputs() {
  $("#name").val("");
  $("#message").val("");
  $(".roll").val("");
  $(".class").prop('selectedIndex', 0)
  $(".section").prop('selectedIndex', 0)
  $("html, body").animate({
    scrollTop: 0
  }, "slow");

}