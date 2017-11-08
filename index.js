
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


//---------------------------------handleSignIn------------------------------------
var email = document.getElementById('email');
function checkEmail() {
  if (email.value.includes("@") == true) {
    email.setCustomValidity('');
    return true;
  }else {
    if(email.value != ''){
      document.getElementById('label-email').className = 'invalid';
      email.setCustomValidity('Please enter a valid email address.');
    }else {
      document.getElementById('label-email').className = '';
      email.setCustomValidity('Please fill in this field.');
    }
    return false;
  }
}
function handleSignIn() {
  if (checkEmail() == true) {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      // alert(errorMessage);
      document.getElementById('error_Message').className = "error_Message fadeInDown";
      document.getElementById('error_Message').innerHTML = errorMessage;
      document.getElementById('error_Message').style.display = "block";
      setTimeout(function(){
        document.getElementById('error_Message').className = "error_Message fadeOutUp";
      },3000);
      console.log(errorCode);
      // console.log(error);
      // [END_EXCLUDE]
    });
  }else {
    console.log('Validation failed.');
  }
    // [END authwithemail]
}

/*-------------------------RESET PASSWORD-------------------------------------*/

function sendPasswordReset() {
  var email = document.getElementById('email').value;
  // [START sendpasswordemail]
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    // Password Reset Email Sent!
    // [START_EXCLUDE]
    alert('Password Reset Email Sent!');
    // [END_EXCLUDE]
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END sendpasswordemail];
}
//---------------------------------------INIT---------------------------------------
function initApp() {
// Listening for auth state changes.
// [START authstatelistener]
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    // [START_EXCLUDE]
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    window.location = 'loading.html';
    // [END_EXCLUDE]
  }else {
    // console.log('Signed Out!');
  }
});
// [END authstatelistener]
document.getElementById('signIn').addEventListener('click', handleSignIn, false);
}
window.onload = function() {
  initApp();
};
