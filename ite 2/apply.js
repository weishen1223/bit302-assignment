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
// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();

//---------------------------------Time Format-----------------------------------
function timeChange(inputEle) {
  var timeSplit = inputEle.split(':'),
    hours,
    minutes,
    meridian;
  hours = timeSplit[0];
  minutes = timeSplit[1];
  if (hours > 12) {
    meridian = 'PM';
    hours -= 12;
  } else if (hours < 12) {
    meridian = 'AM';
    if (hours == 0) {
      hours = 12;
    }
  } else {
    meridian = 'PM';
  }
  return hours + ':' + minutes + ' ' + meridian;
}
//---------------------------------Messaging--------------------------------------

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
    var result;
    function userExistsCallback(uid, exists) {
      if (exists) {
        result = true;
      } else {
        result = false;
      }
      return result;
    };
    var studentRef = database.ref('users/student/');
    var adminRef = database.ref('users/admin/');
    studentRef.child(uid).once('value', function(snapshot) {
      var exists = (snapshot.val() !== null);
      userExistsCallback(uid, exists);
      if(result){
        window.location = 'student.html';
      };
    });
    adminRef.child(uid).once('value', function(snapshot) {
      var exists = (snapshot.val() !== null);
      userExistsCallback(uid, exists);
      if(result){
        window.location = 'admin.html';
      };
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
// -------------------------- APPLY TESTING -------------------------------
// var apply = document.getElementById('apply');
//
// function applyCancel() {
//   var firebaseRef = firebase.database().ref();
//   firebaseRef.child('Text').push().set("SomeValue");
// }
// ---------------------- Cancellation Checkbox ---------------------------

document.getElementById('checkReplace').onchange = function() {
    document.getElementById('inputReplace').disabled = !this.checked;
    document.getElementById('inputReplace2').disabled = !this.checked;
    document.getElementById('inputReplace3').disabled = !this.checked;
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

//------------------------------ Application ---------------------------------
function applyJSON() {
  var subjectCode = document.getElementById('subject_code').value;
  var date = document.getElementById('cancel_date').value;
  var startTime = timeChange(document.getElementById('cancel_startTime').value);
  var endTime = timeChange(document.getElementById('cancel_endTime').value);
  var venue = document.getElementById('cancel_venue').value;
  var reason = document.getElementById('cancel_reason').value;
  var timestamp = firebase.database.ServerValue.TIMESTAMP;
  var userID = firebase.auth().currentUser.uid;
  var negativeTime = -1 * new Date().getTime();;
  if (subjectCode == "" || date == "" || startTime == "" || endTime == "" || venue == "" || reason == ""){
    // console.log('missing form value');
  }else {
    if (document.getElementById('checkReplace').checked != true){
      var cancel_obj = {
        "subjectCode" : subjectCode,
        "userID" : userID,
        "date" : date,
        "startTime" : startTime,
        "endTime" : endTime,
        "venue" : venue,
        "reason" : reason,
        "createdAt" : timestamp,
        "orderDesc" : negativeTime,
        "replacement" : false
      };
      var usersRef = database.ref('classes');
      usersRef.child("cancellation").once("value", function(snapshot) {
        //  var number = snapshot.numChildren() + 1;
        // console.log("There are "+snapshot.numChildren()+" cancellation");
        var newApplication = usersRef.child("cancellation");
        newApplication.push(cancel_obj);
      });
      // Sending notification
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("POST", "https://fcm.googleapis.com/fcm/send", true);
      xmlhttp.setRequestHeader('Authorization', 'key=AIzaSyCl51JVX90hTlj8KUKn4BsoJYps2m2jPEg');// server key
      xmlhttp.setRequestHeader('Content-Type', 'application/json');
      xmlhttp.send(JSON.stringify(
        {
          "to" : "/topics/classes",
          "notification" : {
            "body" : startTime+" - "+endTime,
            "title" : subjectCode+" class cancellation",
            "content_available" : true,
            "priority" : "high",
          },
            "data": {
              "message" : "Thanks",
              "title" : "Are you serious?"
            }
      }
      ));
      xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            // console.log('xmlhttp no error');
        }
      };
      setTimeout(function(){
        var cancellationRef = usersRef.child('cancellation');
        cancellationRef.limitToLast(1).once('child_added', function(snapshot){
          var val = snapshot.val();
          var row = document.createElement('tr'); // create row node
          var col = document.createElement('td'); // create column node
          var col2 = document.createElement('td'); // create second column node
          var col3 = document.createElement('td'); // create third column node
          var col4 = document.createElement('td'); // create fourth column node
          var col5 = document.createElement('td'); // create fifth node
          var col6 = document.createElement('td'); // create sixth node
          row.appendChild(col); // append first column to row
          row.appendChild(col2); // append second column to row
          row.appendChild(col3); // append third column to row
          row.appendChild(col4); // append fourth column to row
          row.appendChild(col5); // append fifth column to row
          row.appendChild(col6); // append sixth column to row
          col.innerHTML = val.subjectCode; // put data in first column
          col2.innerHTML = val.date; // put data in second column
          col3.innerHTML = val.startTime; // put data in third column
          col4.innerHTML = val.endTime; // put data  in fourth column
          col5.innerHTML = val.venue; // put data in fifth column
          col6.innerHTML = val.reason; // put data in sixth column
          // var table = document.getElementById("test-table").getElementsByTagName('tbody');
          var table = document.getElementById("test-table").children[1];
          table.insertBefore(row, table.children[0]);
          // table.appendChild(row);
        });
      },500);
      // post to facebook
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.11&appId=234394523755744';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
        FB.login(function () {
          FB.api('/712098782316493/feed', 'post', { message: 'Class Cancellation \n '
          +subjectCode+' \n '
          +date+' \n Time: '
          +startTime+' - ' +endTime+' \n Replacement to be confirmed.'});
        },
        {
          scope: 'publish_actions,user_managed_groups'
        });
        // end post
    }else { // START ELSE
      var replace_date = document.getElementById('inputReplace').value;
      var rep_startTime = timeChange(document.getElementById('inputReplace2').value);
      var rep_endTime = timeChange(document.getElementById('inputReplace3').value);
      var userID = firebase.auth().currentUser.uid;
      if (replace_date == "" || rep_startTime == "" || rep_endTime == ""){
        alert('please fill up replacement details');
      }else{
        var cancel_obj = {
          "subjectCode" : subjectCode,
          "userID" : userID,
          "date" : date,
          "startTime" : startTime,
          "endTime" : endTime,
          "venue" : venue,
          "reason" : reason,
          "createdAt" : timestamp,
          "orderDesc" : negativeTime,
          "replacement" : true
        };
        var replacement_obj = {
          "subjectCode" : subjectCode,
          "userID" : userID,
          "replace_date" : replace_date,
          "replace_startTime" : rep_startTime,
          "replace_endTime" : rep_endTime,
          "replace_venue" : "NA",
          "approve" : false
        };
        var usersRef = database.ref('classes');
        usersRef.child("cancellation").once("value", function(snapshot) {
          //  var number = snapshot.numChildren() + 1;
          // console.log("There are "+snapshot.numChildren()+" cancellation");
          var newApplication = usersRef.child("cancellation");
          newApplication.push(cancel_obj);
        });
        setTimeout(function(){
          var cancellationRef = usersRef.child('cancellation');
          cancellationRef.limitToLast(1).once('child_added', function(snapshot){
            var val = snapshot.val();
            var row = document.createElement('tr'); // create row node
            var col = document.createElement('td'); // create column node
            var col2 = document.createElement('td'); // create second column node
            var col3 = document.createElement('td'); // create third column node
            var col4 = document.createElement('td'); // create fourth column node
            var col5 = document.createElement('td'); // create fifth node
            var col6 = document.createElement('td'); // create sixth node
            row.appendChild(col); // append first column to row
            row.appendChild(col2); // append second column to row
            row.appendChild(col3); // append third column to row
            row.appendChild(col4); // append fourth column to row
            row.appendChild(col5); // append fifth column to row
            row.appendChild(col6); // append sixth column to row
            col.innerHTML = val.subjectCode; // put data in first column
            col2.innerHTML = val.date; // put data in second column
            col3.innerHTML = val.startTime; // put data in third column
            col4.innerHTML = val.endTime; // put data in fourth column
            col5.innerHTML = val.venue; // put data in fifth column
            col6.innerHTML = val.reason; // put data in sixth column
            // var table = document.getElementById("test-table").getElementsByTagName('tbody');
            row.setAttribute("class", "new-tr");
            var table = document.getElementById("test-table").children[1];
            table.insertBefore(row, table.children[0]);
            // table.appendChild(row);
          });
        },500);
        usersRef.child("replacement").once("value", function(snapshot) {
           var number = snapshot.numChildren() + 1;
          // console.log("There are "+snapshot.numChildren()+" cancellation");
          var newApplication = usersRef.child("replacement");
          newApplication.push(replacement_obj);
        });
        // post to facebook
        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.11&appId=234394523755744';
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
          FB.login(function () {
            FB.api('/712098782316493/feed', 'post', { message: 'Class Cancellation \n '
            +subjectCode+' \n '
            +date+' \n Time: '
            +startTime+' - ' +endTime+' \n \n Class Replacement \n '
            +subjectCode+' \n '
            +date+' \n Time: '
            +rep_startTime+' - ' +rep_endTime
            });
          },
          {
            scope: 'publish_actions,user_managed_groups'
          });
      }
    }// END ELSE
    // firebase.database().ref('users/' + userID + '/cancellation/').push(cancel_obj);
  }
}

function retriveData() {
  var userID = firebase.auth().currentUser.uid;
  var usersRef = database.ref('classes');
  var cancellationRef = usersRef.child('cancellation');
  // var usersRef2 = database.ref().push().getkey();
  // console.log(usersRef2);
  cancellationRef.orderByChild('orderDesc').limitToFirst(5).once("value").then(function(snapshot) {
    if(snapshot.exists()){
      var counter = 1;
      snapshot.forEach(function(data){
          var val = data.val();
          var row = document.createElement('tr'); // create row node
          var col = document.createElement('td'); // create column node
          var col2 = document.createElement('td'); // create second column node
          var col3 = document.createElement('td'); // create third column node
          var col4 = document.createElement('td'); // create fourth column node
          var col5 = document.createElement('td'); // create fifth node
          var col6 = document.createElement('td'); // create sixth node
          row.appendChild(col); // append first column to row
          row.appendChild(col2); // append second column to row
          row.appendChild(col3); // append third column to row
          row.appendChild(col4); // append fourth column to row
          row.appendChild(col5); // append fifth column to row
          row.appendChild(col6); // append sixth column to row
          col.innerHTML = val.subjectCode; // put data in first column
          col2.innerHTML = val.date; // put data in second column
          col3.innerHTML = val.startTime; // put data in third column
          col4.innerHTML = val.endTime; // put data in fourth column
          col5.innerHTML = val.venue; // put data in fifth column
          col6.innerHTML = val.reason; // put data in sixth column
          var table = document.getElementById("test-table").getElementsByTagName('tfoot')[0];
          table.appendChild(row);
          counter ++;
      });
      // var table = document.getElementById("test-table");
      // table.appendChild(content);
  }else {
    console.log('none');
  }
  });
};
