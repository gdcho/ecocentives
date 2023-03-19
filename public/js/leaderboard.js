function retrieveBoard() {
    // Retrieve the user collection data
    db.collection("users").orderBy("points", "desc").get().then(function(querySnapshot) {
      // Retrieve the leaderboard table element
      var leaderboardTable = document.getElementById("leaderboard-body");
  
      // Initialize rank counter
      var rank = 0;
      var previousPoints = -1;
  
      // Loop through each document in the collection
      querySnapshot.forEach(function(doc) {
        // Get the data for each user document
        var user = doc.data();
        var points = user.points;
  
        // Increment rank if points are lower than previous user's points
        if (points !== previousPoints) {
          rank++;
        }
  
        // Create a new row for the user
        var row = document.createElement("tr");
  
        // Add the rank, name, and points to the row
        var rankCell = document.createElement("td");
        rankCell.textContent = rank;
        row.appendChild(rankCell);
  
        var nameCell = document.createElement("td");
        if (user.displayName == undefined){
          nameCell.textContent = user.name;
        } else {
        nameCell.textContent = user.displayName;}
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
  
        // Update previous points
        previousPoints = points;
      });
    });
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    retrieveBoard();
  });
  