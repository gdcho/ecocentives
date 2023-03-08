const rewardsRef = firebase.firestore().collection("rewards");
function getRewardsData() {
  rewardsRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const name = data.name;
      const points = data.points;
      const description = data.description;
      console.log(
        `Reward Name: ${name}, Points Required: ${points}, Description: ${description}`
      );
    });
  });
}
getRewardsData();

function saveRedemptionDocumentIDAndRedirect(docID) {
  localStorage.setItem("redemptionDocID", docID);
  window.location.href = "redemption.html";
}
