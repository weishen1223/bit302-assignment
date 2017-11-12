function declineApply() {
  var usersRef = database.ref('classes');
  var replacementRef = usersRef.child('replacement');
  console.log('decline');
}