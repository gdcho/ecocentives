/* Auto-populate user information from Firestore Database. */
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
          document.getElementById("phoneInput").value = userData.phone;
        } else {
        }
      })
      .catch((error) => {});
  } else {
  }
});

/* Retrieves the selected reward's String from Firestore Database. */
const selectedReward = localStorage.getItem("selectedReward");
const selectedRewardInput = document.querySelector("#selectedReward");
selectedRewardInput.value = selectedReward;

/* Retrieve the selected reward's points from Firestore Database. */
const rewardsRef = db.collection("rewards");
rewardsRef
  .where("name", "==", selectedReward)
  .get()
  .then((querySnapshot) => {
    let selectedRewardPoints;
    querySnapshot.forEach((doc) => {
      selectedRewardPoints = doc.data().points;
    });
  })
  .catch((error) => {
    console.error("Error getting selected reward points: ", error);
  });

/* Reward redemption submission. */
function submitRedemption() {
  if (!window.confirm("Are you sure you want to redeem your points?")) {
    return;
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const currentUser = db.collection("users").doc(user.uid);
      const userID = user.uid;

      // Retrieve the current points balance.
      currentUser.get().then((userDoc) => {
        // Retrieve the selected reward's points from Firestore Database.
        const rewardsRef = db.collection("rewards");
        rewardsRef
          .where("name", "==", selectedReward)
          .get()
          .then((querySnapshot) => {
            let selectedRewardPoints;
            querySnapshot.forEach((doc) => {
              selectedRewardPoints = doc.data().points;
            });

            const currentPoints = userDoc.data().points;
            if (currentPoints >= selectedRewardPoints) {
              // Calculate the new points balance after deducting the redeemed reward points.
              const points = currentPoints - selectedRewardPoints;

              // Update the user's document with the new points balance.
              currentUser
                .update({
                  points: points,
                })
                .then(() => {
                  var newRedemptionRef = currentUser
                    .collection("redeemed")
                    .doc();
                  var redemptionDocID = newRedemptionRef.id;
                  var userEmail = userDoc.data().email;
                  var phone = document.getElementById("phoneInput").value;
                  var redemptionData = {
                    reward: selectedReward,
                    redemptionDocID: redemptionDocID,
                    email: userEmail,
                    phone: phone,
                    points: selectedRewardPoints,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  };

                  localStorage.setItem(
                    "redemptionData",
                    JSON.stringify(redemptionData)
                  );

                  newRedemptionRef
                    .set(redemptionData)
                    .then(() => {
                      window.location.href = "/html/confirmation.html";
                    })
                    .catch((error) => {
                      console.error(
                        "Error writing redemption document: ",
                        error
                      );
                    });
                })
                .catch((error) => {
                  console.error("Error updating points balance: ", error);
                });
            } else {
              const message = `You don't have enough points to redeem ${selectedReward}. Your current points balance is ${currentPoints}.`;
              alert(message);
            }
          })
          .catch((error) => {
            console.error("Error getting selected reward points: ", error);
          });
      });
    } else {
      window.location.href = "redemption.html";
    }
  });
}
