/* Display ranks based off of highest to lowest points balance for each user. */
function retrieveBoard() {
  db.collection("users")
    .orderBy("points", "desc")
    .get()
    .then(function (querySnapshot) {
      var leaderboardTable = document.getElementById("leaderboard-body");

      var rank = 0;
      var previousPoints = -1;

      querySnapshot.forEach(function (doc) {
        var user = doc.data();
        var points = user.points;

        // Increment rank if points are lower than previous user's points
        if (points !== previousPoints) {
          rank++;
        }

        var row = document.createElement("tr");

        var rankCell = document.createElement("td");
        rankCell.textContent = rank;
        row.appendChild(rankCell);

        var nameCell = document.createElement("td");
        var profilePicture = document.createElement("img");
        profilePicture.src = user.photoURL
          ? user.photoURL
          : "/img/placeholder-profile.png"; 
        profilePicture.alt = user.displayName;
        profilePicture.width = 30;
        nameCell.appendChild(profilePicture);
        nameCell.appendChild(
          document.createTextNode(user.displayName || user.name)
        );
        row.appendChild(nameCell);

        var pointsCell = document.createElement("td");
        pointsCell.textContent = points;
        row.appendChild(pointsCell);

        if (leaderboardTable !== null) {
          // Add the row to the leaderboard table
          leaderboardTable.appendChild(row);
        } else {
          console.error("Could not find leaderboard-body element");
        }

        // Highlight the current user
        if (
          firebase.auth().currentUser &&
          firebase.auth().currentUser.uid === doc.id
        ) {
          row.style.border = "2px solid #c4b60f";
        }

        previousPoints = points;
      });
    });
}

document.addEventListener("DOMContentLoaded", function () {
  retrieveBoard();
});
