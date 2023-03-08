var redemptionDocID = localStorage.getItem("redemptionDocID");
function getRedemptionID(id) {
    db.collection("redeemed")
        .doc(id)
        .get()
        .then((thisRedemption) => {
            var redemptionID = thisRedemption.data().name;
            document.getElementById("redemptionName").innerHTML = redemptionID;
        });
}
getRedemptionID(redemptionDocID);

function submitRedemption() {
    console.log("Confirm point redemption");

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid);
            var userID = user.uid;

            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    var userEmail = userDoc.data().email;
                    var phone = document.getElementById("phoneInput").value;
                    var redemptionData = {
                        redemptionDocID: redemptionDocID,
                        userID: userEmail,
                        phone: phone,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    db.collection("redeemed").add(redemptionData)
                        .then(() => {
                            console.log("Document successfully written!");
                            window.location.href = "/html/confirmation.html";
                        })
                        .catch(error => {
                            console.error("Error writing document: ", error);
                        });
                })
                .catch(error => {
                    console.error("Error getting document: ", error);
                });
        } else {
            console.log("No user is signed in");
            window.location.href = 'redemption.html';
        }
    });
}

