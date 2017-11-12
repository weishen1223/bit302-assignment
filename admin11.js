function approveApply(vkey) {
  var replacementRef = database.ref('classes');
  var childRef = replacementRef.child('replacement');
  var Ref = replacementRef.child('replacement/'+vkey);
  var venueInput = document.getElementById('venueInput_'+vkey).value;
  if (venueInput == ""){
    console.log('venue missing');
  }else{
    childRef.on('child_added', function(data) {
       var key = data.key;
       var val = data.val();
       var subjectCode = val.subjectCode;
       var date = val.replace_date;
       var startTime = val.replace_startTime;
       var endTime = val.replace_endTime;
       var venue = val.replace_venue;
       if(vkey == key){
        Ref.update({approve : true, replace_venue : venueInput});
        // var keyRef = replacementRef.child('replacement/'+vkey+'/approve');
        // keyRef.set(true);

        // Sending notification
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "https://fcm.googleapis.com/fcm/send", true);
        xmlhttp.setRequestHeader('Authorization', 'key=AIzaSyCl51JVX90hTlj8KUKn4BsoJYps2m2jPEg');// server key
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.send(JSON.stringify({
            "to" : "/topics/classes",
            "notification" : {
              "body" : "New class cancellation & Replacement !!!",
              "title" : "Please check your new class schedule.",
              "content_available" : true,
              "priority" : "high",
            },
              "data": {
                "message" : "Thanks",
                "title" : "Are you serious?"
              }
        }));

        xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              var myArr = JSON.parse(this.responseText);
              // console.log('xmlhttp no error');
          }
        };
        FB.login(function () {
          FB.api('/712098782316493/feed', 'post', { message: 'Class Replacement \n '
          +subjectCode+' \n '
          +date+' \n Time: '
          +startTime+' - ' +endTime+' \n Venue: '
          +venue });
        },
        {
          scope: 'publish_actions,user_managed_groups'
        });
        }else{
          // console.log('not found');
        }

      });

  }