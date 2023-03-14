function readPoints() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          console.log(doc.data());
          const userPoint = doc.data().point;
          document.getElementById("points-goes-here").innerHTML = userPoint;
        });
    } else {
    }
  });
}
readPoints();