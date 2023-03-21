/* Display rewards from Firestore Database. */
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

          const rewardNameElem = rewardContainer.querySelector(".reward-name");
          rewardNameElem.textContent = rewardName;

          const pointsElem = rewardContainer.querySelector(".points");
          pointsElem.textContent = `${points} points`;
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

// Saves reward selection and redirects to redemption page.
function saveRewardSelectionAndRedirect(rewardName) {
  localStorage.setItem("selectedReward", rewardName);
  window.location.href = "redemption.html";
}

const playstationRedeemBtn = playstationRewardContainer.querySelector(".redeem-btn");
playstationRedeemBtn.onclick = function() {
  saveRewardSelectionAndRedirect("$25 PlayStation Gift Card");
}

const steamRedeemBtn = steamRewardContainer.querySelector(".redeem-btn");
steamRedeemBtn.onclick = function() {
  saveRewardSelectionAndRedirect("$50 Steam Gift Card");
}

const uberRedeemBtn = uberRewardContainer.querySelector(".redeem-btn");
uberRedeemBtn.onclick = function() {
  saveRewardSelectionAndRedirect("$50 Uber Gift Card");
}

const amazonRedeemBtn = amazonRewardContainer.querySelector(".redeem-btn");
amazonRedeemBtn.onclick = function() {
  saveRewardSelectionAndRedirect("$100 Amazon Gift Card");
}

const bestbuyRedeemBtn = bestbuyRewardContainer.querySelector(".redeem-btn");
bestbuyRedeemBtn.onclick = function() {
  saveRewardSelectionAndRedirect("$100 Best Buy Gift Card");
}

const visaRedeemBtn = visaRewardContainer.querySelector(".redeem-btn");
visaRedeemBtn.onclick = function() {
  saveRewardSelectionAndRedirect("$100 Visa Gift Card");
}

