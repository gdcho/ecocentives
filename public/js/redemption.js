firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    const userRef = db.collection("users").doc(user.uid);

    userRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          // Populate the form fields with the user's data.
          document.getElementById("nameInput").value = userData.name;
          document.getElementById("emailInput").value = userData.email;
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  } else {
    console.log("No user is currently logged in!");
  }
});

function submitRedemption() {
  console.log("Confirm point redemption");

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;

      // Generate a new redemption document with a unique ID.
      var newRedemptionRef = db.collection("redeemed").doc();
      var redemptionDocID = newRedemptionRef.id;

      currentUser
        .get()
        .then((userDoc) => {
          var userEmail = userDoc.data().email;
          var phone = document.getElementById("phoneInput").value;
          var redemptionData = {
            redemptionDocID: redemptionDocID,
            userID: userEmail,
            phone: phone,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          };
          newRedemptionRef.set(redemptionData)
            .then(() => {
              console.log("Document successfully written!");
              window.location.href = "/html/confirmation.html";
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
        })
        .catch((error) => {
          console.error("Error getting document: ", error);
        });
    } else {
      console.log("No user is signed in");
      window.location.href = "redemption.html";
    }
  });
}

