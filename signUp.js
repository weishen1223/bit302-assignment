
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

//--------------------------VALIDATION  ---------------------
var password = document.getElementById("password");
var confirm_password = document.getElementById("confirm_password");
var checkPassword = function() {
  if (password.value.length < 6) {
    if(password.value != ''){
      document.getElementById('label-password').className = 'invalid';
    }else {
      document.getElementById('label-password').className = '';
    }
    password.setCustomValidity("Password should be at least 6 characters");
    return false;
  }
  else {
    password.setCustomValidity("");
    if (password.value != confirm_password.value) {
      confirm_password.setCustomValidity("Passwords Don't Match.");
      if(confirm_password.value != ''){
        document.getElementById('label-confirm_password').className = 'invalid';
      }else {
        document.getElementById('label-confirm_password').className = '';
      }
    } else {
      confirm_password.setCustomValidity('');
      return true;
    }
  }
}
var email = document.getElementById('email');
function checkEmail() {
  if (email.value.includes("@") == true) {
    email.setCustomValidity('');
    return true;
  }else {
    if(email.value != ''){
      document.getElementById('label-email').className = 'invalid';
    }else {
      document.getElementById('label-email').className = '';
    }
    email.setCustomValidity('Please include an \'@\' in the email address.\' '+email.value+' \' is missing an \'@\'.');
    return false;
  }
}
/**
* -----------------------------Handles the sign up button press.----------------
*/

function createUser() {
  var username = document.getElementById('username').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var userID =   firebase.auth().currentUser.uid;
  var cancellation = [];
  var replacement = [];
  var user = {
    "userID" : userID,
    "username" : username,
    "email" : email,
    "password" : password,
    "userType" : "student"
  };
  database.ref('users/student/'+ userID).set(user);
  firebase.auth().currentUser.updateProfile({displayName : username});
}
function handleSignUp() {
  // Sign in with email and pass.
  // [START createwithemail]
  if (checkEmail() == true && checkPassword() == true){
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    document.getElementById('signUp').disabled = true;
    document.getElementById('signUp').innerHTML = "Registering...";
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      document.getElementById('error_Message').className = "error_Message fadeInDown";
      document.getElementById('error_Message').innerHTML = errorMessage;
      document.getElementById('error_Message').style.display = "block";
      setTimeout(function(){
        document.getElementById('error_Message').className = "error_Message fadeOutUp";
      },3000);
      document.getElementById('signUp').disabled = false;
      document.getElementById('signUp').innerHTML = "Sign Up";
      // alert(errorMessage);

      // [END_EXCLUDE]
    });
  }else {
    console.log('Validation failed.');
  }
  // [END createwithemail]
}


//---------------------------------------INIT---------------------------------------
function initApp() {
// Listening for auth state changes.
// [START authstatelistener]
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    // [START_EXCLUDE]
    createUser();
    setTimeout(function(){window.location = 'student.html';},2000);
    // [END_EXCLUDE]
  }else {
    console.log('Signed Out!');
  }
});
// [END authstatelistener]
document.getElementById('signUp').addEventListener('click', handleSignUp, false);
}
window.onload = function() {
  initApp();
};
