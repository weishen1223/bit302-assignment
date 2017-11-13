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
  var time = document.getElementById('cancel_time').value;
  var venue = document.getElementById('cancel_venue').value;
  var reason = document.getElementById('cancel_reason').value;
  var timestamp = firebase.database.ServerValue.TIMESTAMP;
  var userID = firebase.auth().currentUser.uid;
  var negativeTime = -1 * new Date().getTime();;
  if (subjectCode == "" || date == "" || time == "" || venue == "" || reason == ""){
    console.log('missing form value');
  }else {
    if (document.getElementById('checkReplace').checked != true){
      var cancel_obj = {
        "subjectCode" : subjectCode,
        "userID" : userID,
        "date" : date,
        "time" : time,
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
          row.appendChild(col); // append first column to row
          row.appendChild(col2); // append second column to row
          row.appendChild(col3); // append third column to row
          row.appendChild(col4); // append fourth column to row
          row.appendChild(col5); // append fifth column to row
          col.innerHTML = val.subjectCode; // put data in first column
          col2.innerHTML = val.date; // put data in second column
          col3.innerHTML = val.time; // put data in third column
          col4.innerHTML = val.venue; // put data  in fourth column
          col5.innerHTML = val.reason; // put data in fifth column
          // var table = document.getElementById("test-table").getElementsByTagName('tbody');
          var table = document.getElementById("test-table").children[1];
          table.insertBefore(row, table.children[0]);
          // table.appendChild(row);
        });
      },500);

    }else { // START ELSE
      var replace_date = document.getElementById('inputReplace').value;
      var replace_time = document.getElementById('inputReplace2').value;
      var userID = firebase.auth().currentUser.uid;
      if (replace_date == "" || replace_time == ""){
        alert('please fill up replacement details');
      }else{
        var cancel_obj = {
          "subjectCode" : subjectCode,
          "userID" : userID,
          "date" : date,
          "time" : time,
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
          "replace_time" : replace_time,
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
            row.appendChild(col); // append first column to row
            row.appendChild(col2); // append second column to row
            row.appendChild(col3); // append third column to row
            row.appendChild(col4); // append fourth column to row
            row.appendChild(col5); // append fifth column to row
            col.innerHTML = val.subjectCode; // put data in first column
            col2.innerHTML = val.date; // put data in second column
            col3.innerHTML = val.time; // put data in third column
            col4.innerHTML = val.venue; // put data in fourth column
            col5.innerHTML = val.reason; // put data in fifth column
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
          row.appendChild(col); // append first column to row
          row.appendChild(col2); // append second column to row
          row.appendChild(col3); // append third column to row
          row.appendChild(col4); // append fourth column to row
          row.appendChild(col5); // append fifth column to row
          col.innerHTML = val.subjectCode; // put data in first column
          col2.innerHTML = val.date; // put data in second column
          col3.innerHTML = val.time; // put data in third column
          col4.innerHTML = val.venue; // put data in fourth column
          col5.innerHTML = val.reason; // put data in fifth column
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
