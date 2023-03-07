// Your web app's Firebase configuration
var firebaseConfig = {
    // Your Firebase project configuration details
};

function retrieveRewards() {
// Retrieve the user collection data
db.collection("rewards").orderBy("name", "description", "points required").get().then(function(querySnapshot) {
    // Retrieve the leaderboard table element
    var leaderboardTable = document.getElementById("reward");
    // Loop through each document in the collection
    querySnapshot.forEach(function(doc, index) {
    // Get the data for each user document
    var user = doc.data();
    });
});
}
retrieveRewards(); // Call the function
  