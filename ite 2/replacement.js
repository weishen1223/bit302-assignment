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

//------------------------------ Application ---------------------------------
function generateJSON() {
  var subjectCode = document.getElementById('subject_code').value;
  var date = document.getElementById('replace_date').value;
  var startTime = timeChange(document.getElementById('replace_startTime').value);
  var endTime = timeChange(document.getElementById('replace_endTime').value);
  var timestamp = firebase.database.ServerValue.TIMESTAMP;
  var displayName = firebase.auth().currentUser.displayName;
  var userID = firebase.auth().currentUser.uid;
  if (subjectCode == "" || date == "" || startTime == "" || endTime == "" ){
    console.log('missing form value');
  }else {
    var classRef = database.ref('classes');
    var replacementRef = classRef.child('replacement');
    var replace_obj = {
      "subjectCode" : subjectCode,
      "userID" : userID,
      "username" : displayName,
      "replace_date" : date,
      "replace_startTime" : startTime,
      "replace_endTime" : endTime,
      "replace_venue" : "N/A",
      "approve" : false
    };
    var usersRef = database.ref('classes');
    usersRef.child("replacement").once("value", function(snapshot) {
      var number = snapshot.numChildren() + 1;
      var newApplication = usersRef.child("replacement");
      newApplication.push(replace_obj);
    });
    setTimeout(function(){
    replacementRef.limitToLast(1).once('child_added', function(data) {
      var val = data.val();
      var row = document.createElement('tr'); // create row node
      var col = document.createElement('td'); // create column node
      var col2 = document.createElement('td'); // create second column node
      var col3 = document.createElement('td'); // create third column node
      var col4 = document.createElement('td'); // create fourth column node
      row.appendChild(col); // append first column to row
      row.appendChild(col2); // append second column to row
      row.appendChild(col3); // append third column to row
      row.appendChild(col4); // append fourth column to row
      col.innerHTML = val.subjectCode; // put data in first column
      col2.innerHTML = val.replace_date; // put data in second column
      col3.innerHTML = val.replace_startTime; // put data in third column
      col4.innerHTML = val.replace_endTime; // put data in fourth column
      var status = val.approve;
      if (status == true){
        var table = document.getElementById("approve-table").children[1];
        table.insertBefore(row, table.children[0]);
      }else {
        var table = document.getElementById("pending-table").children[1];
        table.insertBefore(row, table.children[0]);
      }

    });
    },500);
  }
}

function retriveData() {
  var userID = firebase.auth().currentUser.uid;
  var usersRef = database.ref('classes');
  var cancellationRef = usersRef.child('replacement');
  // var usersRef2 = database.ref().push().getkey();
  // console.log(usersRef2);
  cancellationRef.orderByChild('orderDesc').once("value").then(function(snapshot) {
    if(snapshot.exists()){
      var counter = 1;
      snapshot.forEach(function(data){
          var val = data.val();
          var row = document.createElement('tr'); // create row node
          var col = document.createElement('td'); // create column node
          var col2 = document.createElement('td'); // create second column node
          var col3 = document.createElement('td'); // create third column node
          var col4 = document.createElement('td'); // create fourth column node

          row.appendChild(col); // append first column to row
          row.appendChild(col2); // append second column to row
          row.appendChild(col3); // append third column to row
          row.appendChild(col4); // append fourth column to row

          col.innerHTML = val.subjectCode; // put data in first column
          col2.innerHTML = val.replace_date; // put data in second column
          col3.innerHTML = val.replace_startTime; // put data in third column
          col4.innerHTML = val.replace_endTime; // put data in fourth column

          if (status == true){
            var col4 = document.createElement('td'); // create fourth column node
            row.appendChild(col4); // append fourth column to row
            col4.innerHTML = val.venue; // put data in fourth column
            var table = document.getElementById("approve-table").children[1];
            table.insertBefore(row, table.children[0]);
          }else {
            var table = document.getElementById("pending-table").children[1];
            table.insertBefore(row, table.children[0]);
          }
      });
      // var table = document.getElementById("test-table");
      // table.appendChild(content);
  }else {
    console.log('none');
  }
  });
};
