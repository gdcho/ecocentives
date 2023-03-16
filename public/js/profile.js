function insertName() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      // Do something for the currently logged-in user here:
      console.log(user.uid); //print the uid in the browser console
      console.log(user.displayName); //print the user name in the browser console
      user_Name = user.displayName;
      $("#name-goes-here").text(user_Name); //using jquery
    } else {
      // No user is signed in.
    }
  });
}
insertName();

function readEmail() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          console.log(doc.data());
          const userEmail = doc.data().email;
          document.getElementById("email-goes-here").innerHTML = userEmail;
        });
    } else {
    }
  });
}
readEmail();

function readJoined() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          console.log(doc.data());
          const userJoined = doc.data().joined;
          document.getElementById("joined-goes-here").innerHTML = userJoined;
        });
    } else {
    }
  });
}
readJoined();

function readPoints() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          console.log(doc.data());
          const userPoints = doc.data().points;
          document.getElementById("points-goes-here").innerHTML = userPoints;
        });
    } else {
    }
  });
}
readPoints();

const saveBtn = document.getElementById("save-profile-btn");

saveBtn.addEventListener("click", function (event) {
  event.preventDefault();
  alert("Profile saved successfully!");
});
