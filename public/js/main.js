/* Display user name from Firestore Database. */
function insertName() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      console.log(user.uid);
      console.log(user.displayName);
      user_Name = user.displayName;
      $("#name-goes-here").text(user_Name);
    } else {
      // No user is signed in.
    }
  });
}
insertName();

/* Display quote from Firestore Database. */
function readEcoTip() {
  const dayOfWeek = new Date().toLocaleString("en-us", { weekday: "long" });
  const tipRef = db.collection("ecoTips").doc(dayOfWeek);
  tipRef
    .get()
    .then((tipDoc) => {
      if (tipDoc.exists) {
        document.getElementById("ecotip-goes-here").innerHTML =
          tipDoc.data().tip;
      } else {
        console.log("No tip found for " + dayOfWeek);
      }
    })
    .catch((error) => {
      console.error("Error getting tip: ", error);
    });
}
readEcoTip();

/* Display user points from Firestore Database. */
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

/* Tasks list. */
const ecoActions = [
  {
    action: "Using a clothesline to dry clothes instead of a dryer",
    score: 20,
  },
  {
    action: "Repairing or repurposing items instead of throwing them away",
    score: 30,
  },
  {
    action: "Using a programmable thermostat to conserve energy",
    score: 20,
  },
  {
    action: "Avoiding single-use plastics",
    score: 10,
  },
  {
    action: "Supporting sustainable farming and fishing practices",
    score: 20,
  },
  {
    action: "Using non-toxic cleaning products",
    score: 10,
  },
  {
    action:
      "Supporting politicians and policies that prioritize environmental protection",
    score: 40,
  },
  {
    action: "Participating in community clean-up events",
    score: 30,
  },
  {
    action:
      "Using a bidet or reusable cloth wipes instead of disposable toilet paper",
    score: 20,
  },
  {
    action: "Reducing meat consumption and adopting a plant-based diet",
    score: 30,
  },
  {
    action:
      "Using a reusable water bottle instead of disposable plastic bottles",
    score: 10,
  },
  {
    action:
      "Taking public transportation, biking or walking instead of driving a car",
    score: 20,
  },
  {
    action: "Planting a tree or starting a garden",
    score: 30,
  },
  {
    action: "Using energy-efficient appliances and light bulbs",
    score: 10,
  },
  {
    action: "Buying organic and locally-sourced foods",
    score: 20,
  },
  {
    action: "Composting food waste instead of throwing it away",
    score: 30,
  },
  {
    action: "Installing solar panels or using other renewable energy sources",
    score: 40,
  },
  {
    action: "Using cloth bags instead of plastic bags",
    score: 10,
  },
  {
    action: "Turning off lights and electronics when not in use",
    score: 10,
  },
  {
    action: "Supporting companies with eco-friendly practices and policies",
    score: 20,
  },
];
