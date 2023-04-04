/* Display redemptionData for the redeemed reward. */
var redemptionData = JSON.parse(localStorage.getItem("redemptionData"));

document.getElementById("reward").textContent = redemptionData.reward;
document.getElementById("redemptionID").textContent =
  redemptionData.redemptionDocID;
document.getElementById("email").textContent = redemptionData.email;
document.getElementById("phone").textContent = redemptionData.phone;

/* Display points from Firestore Database. */
function readPoints() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          const userPoints = doc.data().points;
          document.getElementById("points-goes-here").innerHTML = userPoints;
        });
    } else {
    }
  });
}
readPoints();
