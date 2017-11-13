// Initialize Firebase
var config = {
    apiKey: "AIzaSyAWdXNARv4ZpgiZAXjjMXjKF-ENzuX2pXw",
    authDomain: "fyp2-9c6f7.firebaseapp.com",
    databaseURL: "https://fyp2-9c6f7.firebaseio.com",
    projectId: "fyp2-9c6f7",
    storageBucket: "fyp2-9c6f7.appspot.com",
    messagingSenderId: "892125470039"
  };
  firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

const messaging = firebase.messaging();

//--------------------------------Messaging----------------------------------
messaging.requestPermission()
.then(function() {
  console.log('Notification permission granted.');
  return messaging.getToken();
})
.then(function(token){
  // console.log(token);
})
.catch(function(err) {
  console.log('Unable to get permission to notify.', err);
});
messaging.onMessage(function(payload) {
  console.log('onMessage: ', payload);
})
//---------------------------------handleSignOut------------------------------------

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

//------------------------------ Application ---------------------------------

function retriveData() {
  var userID = firebase.auth().currentUser.uid;
  var usersRef = database.ref('classes');
  var cancellationRef = usersRef.child('cancellation');
  var replacementRef = usersRef.child('replacement');
  replacementRef.on('child_added', function(data) {
    var val = data.val();
    var uKey = data.key;
    var subjectCode = document.createElement('p');
    var date = document.createElement('p');
    var time = document.createElement('p');
    var venue = document.createElement('p');
    var card = document.createElement('div');
    var card_container = document.createElement('div');
    card.className = 'card';
    card_container.className = 'container';
    subjectCode.innerHTML= "Subject Code: "+val.subjectCode;
    date.innerHTML= "Date: <b>"+val.replace_date+"</b>";
    time.innerHTML= "Time: <b>"+val.replace_startTime+" - "+val.replace_endTime+"</b>";
    venue.innerHTML= "Venue: <b>"+val.replace_venue+"</b>";
    var status = val.approve;
    if(status == true){
      var container = document.getElementById('replacement');
      subjectCode.style.paddingTop = "0px";
      venue.style.paddingBottom = "0px";
      date.innerHTML= "Date: <b>"+val.replace_date+"</b>";
      time.innerHTML= "Time: <b>"+val.replace_startTime+" - "+val.replace_endTime+"</b>";
      venue.innerHTML= "Venue: <b>"+val.replace_venue+"</b>";
      container.insertBefore(card, container.firstChild);
      card.insertBefore(card_container, card.firstChild);
      card_container.insertBefore(venue, card_container.firstChild);
      card_container.insertBefore(time, card_container.firstChild);
      card_container.insertBefore(date, card_container.firstChild);
      card_container.insertBefore(subjectCode, card_container.firstChild);
    }else{console.log('no replacement');}
  });
  cancellationRef.on('child_added', function(data) {
    var val = data.val();
    var uKey = data.key;
    var subjectCode = document.createElement('p');
    var date = document.createElement('p');
    var time = document.createElement('p');
    var venue = document.createElement('p');
    var card = document.createElement('div');
    var card_container = document.createElement('div');
    card.className = 'card';
    card_container.className = 'container';
    subjectCode.innerHTML= "Subject Code: "+val.subjectCode;
    date.innerHTML= "Date: <b>"+val.date+"</b>";
    time.innerHTML= "Time: <b>"+val.startTime+" - "+val.endTime+"</b>";
    venue.innerHTML= "Venue: <b>"+val.venue+"</b>";
    var container = document.getElementById('cancellation');
    subjectCode.style.paddingTop = "0px";
    venue.style.paddingBottom = "0px";
    container.insertBefore(card, container.firstChild);
    card.insertBefore(card_container, card.firstChild);
    card_container.insertBefore(venue, card_container.firstChild);
    card_container.insertBefore(time, card_container.firstChild);
    card_container.insertBefore(date, card_container.firstChild);
    card_container.insertBefore(subjectCode, card_container.firstChild);
  });
};
