// Your web app's Firebase configuration
var firebaseConfig = {
  // Your Firebase project configuration details
};

var db = firebase.firestore();

db.collection("rewards")
  .add({
    name: "Free Coffee",
    points: 250,
    description: "Enjoy a free coffee at participating coffee shops.",
  })
  .then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function (error) {
    console.error("Error adding document: ", error);
  });

db.collection("rewards")
  .add({
    name: "Free Yoga Class",
    points: 1000,
    description: "Take a free yoga class at participating yoga studios.",
  })
  .then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function (error) {
    console.error("Error adding document: ", error);
  });

db.collection("rewards")
  .add({
    name: "Free Movie Ticket",
    points: 1000,
    description:
      "See the latest blockbuster for free at participating movie theaters.",
  })
  .then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function (error) {
    console.error("Error adding document: ", error);
  });

db.collection("rewards")
  .add({
    name: "Free Massage",
    points: 2000,
    description: "Relax with a free 1-hour massage at participating spas.",
  })
  .then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function (error) {
    console.error("Error adding document: ", error);
  });

db.collection("rewards")
  .add({
    name: "Free Gym Membership",
    points: 2000,
    description:
      "Get a free 1-month gym membership at participating fitness centers.",
  })
  .then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function (error) {
    console.error("Error adding document: ", error);
  });

db.collection("rewards")
  .add({
    name: "$50 Amazon Gift Card",
    points: 2000,
    description: "Get a $50 gift card to use on Amazon.com.",
  })
  .then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function (error) {
    console.error("Error adding document: ", error);
  });
