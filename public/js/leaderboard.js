// Your web app's Firebase configuration
var firebaseConfig = {
    // Your Firebase project configuration details
  };

function retrieveBoard() {
    // Retrieve the user collection data
    db.collection("users").orderBy("point", "desc").get().then(function(querySnapshot) {
      // Retrieve the leaderboard table element
      var leaderboardTable = document.getElementById("task-tracker");
      
      // Initialize rank counter
      var rank = 0;
      var previousPoints = -1;
      
      // Loop through each document in the collection
      querySnapshot.forEach(function(doc) {
        // Get the data for each user document
        var user = doc.data();
        var points = user.point;
        
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
        nameCell.textContent = user.name;
        row.appendChild(nameCell);
  
        var pointsCell = document.createElement("td");
        pointsCell.textContent = points;
        row.appendChild(pointsCell);
        
        // Add the row to the leaderboard table
        leaderboardTable.appendChild(row);
        
        // Update previous points
        previousPoints = points;
      });
    });
  }
  
retrieveBoard(); // call the function