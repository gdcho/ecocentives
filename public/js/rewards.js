const datastore = firebase.firestore();

function getRewardsData(rewardName, rewardContainer) {
  const rewardsRef = datastore.collection("rewards");
  rewardsRef
    .where("name", "==", rewardName)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log("No matching documents.");
      } else {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const points = data.points;
          const description = data.description;

          const rewardNameElem = rewardContainer.querySelector(".reward-name");
          rewardNameElem.textContent = rewardName;

          const pointsElem = rewardContainer.querySelector(".points");
          pointsElem.textContent = `${points} points`;

          const descriptionElem = rewardContainer.querySelector(".description");
          descriptionElem.textContent = description;
        });
      }
    })
    .catch((error) => {
      console.error("Error getting reward document: ", error);
    });
}

const playstationRewardContainer = document.querySelector("#playstation");
getRewardsData("$25 PlayStation Gift Card", playstationRewardContainer);

const steamRewardContainer = document.querySelector("#steam");
getRewardsData("$50 Steam Gift Card", steamRewardContainer);

const uberRewardContainer = document.querySelector("#uber");
getRewardsData("$50 Uber Gift Card", uberRewardContainer);

const amazonRewardContainer = document.querySelector("#amazon");
getRewardsData("$100 Amazon Gift Card", amazonRewardContainer);

const bestbuyRewardContainer = document.querySelector("#bestbuy");
getRewardsData("$100 Best Buy Gift Card", bestbuyRewardContainer);

const visaRewardContainer = document.querySelector("#visa");
getRewardsData("$100 Visa Gift Card", visaRewardContainer);

// Creates a redemptionDocID in Firestore Database.
function saveRedemptionDocumentIDAndRedirect(docID) {
  localStorage.setItem("redemptionDocID", docID);
  window.location.href = "redemption.html";
}
