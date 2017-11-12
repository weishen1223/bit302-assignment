// Initialize Firebase
var config = {
  apiKey: "AIzaSyAWdXNARv4ZpgiZAXjjMXjKF-ENzuX2pXw",
  authDomain: "fyp2-9c6f7.firebaseapp.com",
  databaseURL: "https://fyp2-9c6f7.firebaseio.com",
  projectId: "fyp2-9c6f7",
  storageBucket: "",
  messagingSenderId: "892125470039"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

function getUserData() {
	FB.api('/me', function(response) {
		console.log('Hello ' + response.name);
	});
}

window.fbAsyncInit = function() {
	//SDK loaded, initialize it
	FB.init({
		appId      : '234394523755744',
		xfbml      : true,
		version    : 'v2.11'
	});

	// //check user session and refresh it
	// FB.getLoginStatus(function(response) {
	// 	if (response.status === 'connected') {
	// 		//user is authorized
	// 		getUserData();
	// 	} else {
	// 		//user is not authorized
	// 	}
	// });
};
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.11&appId=234394523755744';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//---------------------------------handleSignIn------------------------------------

function handleSignOut() {
  if (firebase.auth().currentUser != null) {
    // [START signout]
    console.log('somthg wrong');
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });
    console.log('hello');
    // [END signout]
  } else {
    console.log('No user sign in');
  }
}
//---------------------------------------INIT---------------------------------------
function initApp() {
// Listening for auth state changes.
// [START authstatelistener]
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // [START_EXCLUDE]
    function userExistsCallback(uid, exists) {
      if (exists) {
        return true
      } else {
        return false;
      }
    };
    var lecturersRef = database.ref('users/lecturers/');
    var studentRef = database.ref('users/student/');
    lecturersRef.child(uid).once('value', function(snapshot) {
      var exists = (snapshot.val() !== null);
      userExistsCallback(uid, exists);
    });
    studentRef.child(uid).once('value', function(snapshot) {
      var exists = (snapshot.val() !== null);
      userExistsCallback(uid, exists);
    });
    document.getElementById('user_name').textContent = displayName;
    document.getElementById('user_email').textContent = email;
    retriveData();
    // console.log(JSON.stringify(user, null, '  '));
    // [END_EXCLUDE]
  } else {
    // User is signed out.
    // [START_EXCLUDE]
    window.location.href = 'index.html';
    // [END_EXCLUDE]
  }
});
// [END authstatelistener]

}
document.getElementById('signOut').addEventListener('click', handleSignOut, false);
window.onload = function() {
  initApp();
};

//------------------------------- Account ----------------------------
function accountTrigger() {
  if(document.getElementById("account-settings").style.display == "block"){
     setTimeout(function(){ document.getElementById("account-settings").style.display = "none" }, 200);
  }else{
    document.getElementById("account-settings").style.display = "block";
  }
}

function accountClose() {
  setTimeout(function(){ document.getElementById("account-settings").style.display = "none" }, 100);
}

//------------------------------ Approve Application -------------------------

// function searchPending(nameKey, myArray) {
//     for (var i=0; i < myArray.length; i++) {
//         if (myArray[i].firebase_key === nameKey) {
//             myArray.splice(i,1);
//             return nameKey;
//         }
//     }
//     return false;
// }

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
  // var approve = document.getElementById('approve_btn');
  // var id = approve.parentNode.parentNode.parentNode.id;
  //console.log(id);
  // console.log(key);
  // var keyRef = replacementRef.child('replacement/'+ukey+'/approve');
  // replacementRef.on('child_added', function(data) {
  // }
  // keyRef.set("true");
}

//------------------------------ Decline Application -------------------------

function declineApply() {
  var usersRef = database.ref('classes');
  var replacementRef = usersRef.child('replacement');
  console.log('decline');
}
//-----------------------------Dynamic change data --------------------------

function syncApprovedData() {

}
//------------------------------ Application ---------------------------------

function retriveData() {
  var userID = firebase.auth().currentUser.uid;
  var usersRef = database.ref('classes');
  var replacementRef = usersRef.child('replacement');
  // var usersRef2 = database.ref().push().getkey();
  // console.log(usersRef2);

  // replacementRef.orderByChild('orderDesc').once("value").then(function(snapshot) {
  //   if(snapshot.exists()){
  //     var counter = 1;
  //     snapshot.forEach(function(data){
  //         var val = data.val();
  //         var subjectCode = document.createElement('p');
  //         var date = document.createElement('p');
  //         var time = document.createElement('p');
  //         var venue = document.createElement('p');
  //         var card = document.createElement('div');
  //         var card_container = document.createElement('div');
          // card.className = 'card';
          // card_container.className = 'container';
          // subjectCode.innerHTML= "Subject Code: "+val.subjectCode;
          // date.innerHTML= "Date: "+val.replace_date;
          // time.innerHTML= "Time: "+val.replace_time;
          // venue.innerHTML= "Venue:"+val.replace_venue;
          // var status = val.approve;
          // console.log(status);
          // if(status == true){
          //   var container = document.getElementById('approved');
          //   subjectCode.style.paddingTop = "5px";
          //   venue.style.paddingBottom = "5px";
          //   container.insertBefore(card, container.firstChild);
      //       card.insertBefore(card_container, card.firstChild);
      //       card_container.insertBefore(venue, card_container.firstChild);
      //       card_container.insertBefore(time, card_container.firstChild);
      //       card_container.insertBefore(date, card_container.firstChild);
      //       card_container.insertBefore(subjectCode, card_container.firstChild);
      //     }else {
      //       var container = document.getElementById('pending');
      //       subjectCode.style.paddingTop = "5px";
      //       time.style.paddingBottom = "5px";
      //       container.insertBefore(card, container.firstChild);
      //       card.insertBefore(card_container, card.firstChild);
      //       card_container.insertBefore(time, card_container.firstChild);
      //       card_container.insertBefore(date, card_container.firstChild);
      //       card_container.insertBefore(subjectCode, card_container.firstChild);
      //     }
      // });

      // var table = document.getElementById("test-table");
      // table.appendChild(content);

  // }else {
  //   console.log('none');
  // }
  // });

        replacementRef.on('child_added', function(data) {
          var val = data.val();
          var uKey = data.key;
          // var local = uuidv4();
          // var keyObj = {
          //   "firebase_key" : uKey,
          //   "local_key" : local
          // };
          var subjectCode = document.createElement('p');
          var date = document.createElement('p');
          var time = document.createElement('p');
          var venue = document.createElement('p');
          var venueInput = document.createElement('input');
          venueInput.placeholder ="Please enter venue.";
          venueInput.id = "venueInput_"+uKey;
          // var venue = document.createElement('p');
          // var venueList= ["LS2","SR2.1","SR2.2","TIS","SR2.3"];
          // var venueInput = document.createElement('select');
          // venueInput.setAttribute("id", "mySelect");
          // for (var i = 0; i < venueList.length; i++) {
          //     var option = document.createElement("option");
          //     option.setAttribute("value", venueList[i]);
          //     option.text = venueList[i];
          //     venueInput.appendChild(option);
          // }
          var card = document.createElement('div');
          var card_container = document.createElement('div');

          // create Buttons
          var decline = document.createElement('button');
          var decline_txt = document.createTextNode("Decline");
          decline.className = 'button';
          decline.id = 'decline_btn';
          decline.style.float = 'right';
          decline.style.marginRight = '10px';
          decline.appendChild(decline_txt);
          decline.onclick = function(){
            declineApply(this.id);
          }

          var approve = document.createElement('button');
          var approve_txt = document.createTextNode("Approve");
          approve.className = 'button';
          approve.id = data.key;
          approve.appendChild(approve_txt);
          approve.onclick = function(){
            approveApply(this.id);
          }

          var edit = document.createElement('button');
          var edit_txt = document.createTextNode("Edit");
          edit.className = 'button';
          edit.id = data.key;
          edit.appendChild(edit_txt);
          edit.onclick = function(){
            // editApply(this.id);
          };

          var div_event = document.createElement('p');
          div_event.appendChild(venueInput);
          div_event.appendChild(approve);
          div_event.appendChild(decline);

          var div_event_approved = document.createElement('p');
          div_event_approved.appendChild(edit);

          // End of create Buttons
          card.className = 'card';
          card_container.className = 'container';
          subjectCode.innerHTML= "Subject Code: "+val.subjectCode;
          date.innerHTML= "Date: <b contenteditable = 'false'>"+val.replace_date+"</b>";
          time.innerHTML= "Time: <b contenteditable = 'false'>"+val.replace_startTime+" - "+val.replace_endTime+"</b>";
          venue.innerHTML= "Venue: <b contenteditable = 'false'>"+val.replace_venue+"</b>";
          var status = val.approve;
          if(status == true){
            // card.id = local+"_true";
            card.id = "true_"+data.key;

            var container = document.getElementById('approved');
            subjectCode.style.paddingTop = "5px";
            venue.style.paddingBottom = "5px";
            date.innerHTML= "Date: <b contenteditable = 'false'>"+val.replace_date+"</b>";
            time.innerHTML= "Time: <b contenteditable = 'false'>"+val.replace_startTime+" - "+val.replace_endTime+"</b>";
            venue.innerHTML= "Venue: <b contenteditable = 'false'>"+val.replace_venue+"</b>";
            container.insertBefore(card, container.firstChild);
            card.insertBefore(card_container, card.firstChild);
            card_container.insertBefore(div_event_approved, card_container.firstChild);
            card_container.insertBefore(venue, card_container.firstChild);
            card_container.insertBefore(time, card_container.firstChild);
            card_container.insertBefore(date, card_container.firstChild);
            card_container.insertBefore(subjectCode, card_container.firstChild);

          }else {
            // card.id = local+"_false";
            card.id = "false_"+data.key;
            var container = document.getElementById('pending');
            subjectCode.style.paddingTop = "5px";
            time.style.paddingBottom = "5px";
            // pendingKey.push(keyObj);
            container.insertBefore(card, container.firstChild);
            card.insertBefore(card_container, card.firstChild);
            card_container.insertBefore(div_event, card_container.firstChild);
            card_container.insertBefore(time, card_container.firstChild);
            card_container.insertBefore(date, card_container.firstChild);
            card_container.insertBefore(subjectCode, card_container.firstChild);
          }
        });
        // ====================== ON CHILD CHANGE ==============================
        replacementRef.on('child_changed', function(data) {
          var val = data.val();
          var uKey = data.key;
          var subjectCode = document.createElement('p');
          var date = document.createElement('p');
          var time = document.createElement('p');
          var venue = document.createElement('p');
          var venueInput = document.createElement('input');
          venueInput.placeholder = "Please enter venue.";
          venueInput.id = "venueInput_"+uKey;
          // create Buttons
          var decline = document.createElement('button');
          var decline_txt = document.createTextNode("Decline");
          decline.className = 'button';
          decline.id = 'decline_btn'
          decline.style.float = 'right';
          decline.style.marginRight = '10px';
          decline.appendChild(decline_txt);
          decline.onclick = function(){
            declineApply(this.id);
          };
          var approve = document.createElement('button');
          var approve_txt = document.createTextNode("Approve");
          approve.className = 'button';
          approve.id = data.key;
          approve.appendChild(approve_txt);
          approve.onclick = function(){
            approveApply(this.id);
          };

          var edit = document.createElement('button');
          var edit_txt = document.createTextNode("Edit");
          edit.className = 'button';
          edit.id = data.key;
          edit.appendChild(edit_txt);
          edit.onclick = function(){
            // editApply(this.id);
          };

          var div_event = document.createElement('p');
          div_event.appendChild(venueInput);
          div_event.appendChild(approve);
          div_event.appendChild(decline);

          var div_event_approved = document.createElement('p');
          div_event_approved.appendChild(edit);

          // End of create Buttons
          var card = document.createElement('div');
          var card_container = document.createElement('div');
          card.className = 'card';
          card_container.className = 'container';
          subjectCode.innerHTML= "Subject Code: "+val.subjectCode;
          date.innerHTML= "Date: <b contenteditable = 'false'>"+val.replace_date+"</b>";
          time.innerHTML= "Time: <b contenteditable = 'false'>"+val.replace_startTime+" - "+val.replace_endTime+"</b>";
          venue.innerHTML= "Venue: <b contenteditable = 'false'>"+val.replace_venue+"</b>";

          var status = val.approve;
          if(status == true){
            card.id = "true_"+data.key;
            var container = document.getElementById('approved');
            subjectCode.style.paddingTop = "5px";
            venue.style.paddingBottom = "5px";
            container.insertBefore(card, container.firstChild);
            card.insertBefore(card_container, card.firstChild);
            date.innerHTML= "Date: <b contenteditable = 'false'>"+val.replace_date+"</b>";
            time.innerHTML= "Time: <b contenteditable = 'false'>"+val.replace_startTime+" - "+val.replace_endTime+"</b>";
            venue.innerHTML= "Venue: <b contenteditable = 'false'>"+val.replace_venue+"</b>";
            card_container.insertBefore(div_event_approved, card_container.firstChild);
            card_container.insertBefore(venue, card_container.firstChild);
            card_container.insertBefore(time, card_container.firstChild);
            card_container.insertBefore(date, card_container.firstChild);
            card_container.insertBefore(subjectCode, card_container.firstChild);

            var divRemoved = document.getElementById("false_"+data.key);
            if (divRemoved) {
                divRemoved.remove();
            }
          }else {
            card.id = "false_"+data.key;
            var container = document.getElementById('pending');
            subjectCode.style.paddingTop = "5px";
            time.style.paddingBottom = "5px";
            container.insertBefore(card, container.firstChild);
            card.insertBefore(card_container, card.firstChild);
            card_container.insertBefore(div_event, card_container.firstChild);
            card_container.insertBefore(time, card_container.firstChild);
            card_container.insertBefore(date, card_container.firstChild);
            card_container.insertBefore(subjectCode, card_container.firstChild);

            var divRemoved = document.getElementById("true_"+data.key);
            if (divRemoved) {
                divRemoved.remove();
            }
          }
        });

        replacementRef.on('child_removed', function(data) {
          var val = data.val();
          var status = val.approve;
          if(status == true){
            var divRemoved = document.getElementById("true_"+data.key);
            divRemoved.remove();
          }else {
            var divRemoved = document.getElementById("false_"+data.key);
            divRemoved.remove();
          }
        });
};
