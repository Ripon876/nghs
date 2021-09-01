var tempUser;
$(".searchResult").hide();

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



      //   $("tr.odd").remove();


      // var s = moment(result.mes.class_date).format('MMM D, YYYY') + " " + moment(`${result.mes.class_date}T${result.mes.class_time}`).format("H:mm:ss");

      // mksdfasfsd(s,elem_id)

      //   $(".table").append(`<tr><td>${moment(result.mes.class_date).format('dddd Do MMMM')} At  ${moment(`${result.mes.class_date}T${result.mes.class_time}`).format("hh:mm a")}</td><td id="${elem_id}"  class="card-title"></td><td><a href="/author/hostLiveClass/remove/${result.mes._id}" class="btn btn-danger p-2">Cancel</a></td></tr>`)



    },
    error: function(result, status, error) {
      console.log("something went wrong");
    }
  });

})