
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



//---------------------------------------INIT---------------------------------------

