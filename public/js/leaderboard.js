// Your web app's Firebase configuration
var firebaseConfig = {
    // Your Firebase project configuration details
  };

  function retrieveBoard() {
    // Retrieve the user collection data
    db.collection("users").orderBy("point", "desc").get().then(function(querySnapshot) {
      // Retrieve the leaderboard table element
      var leaderboardTable = document.getElementById("leaderboard-body");
      
      // Loop through each document in the collection
      querySnapshot.forEach(function(doc, index) {
        // Get the data for each user document
        var user = doc.data();
        
        // Create a new row for the user
        var row = document.createElement("tr");
        
        // Add the rank, name, and points to the row
        var rankCell = document.createElement("td");
        rankCell.textContent = index + 1;
        row.appendChild(rankCell);
  
        var nameCell = document.createElement("td");
        nameCell.textContent = user.name;
        row.appendChild(nameCell);
  
        var pointsCell = document.createElement("td");
        pointsCell.textContent = doc.data().point;
        row.appendChild(pointsCell);
  
        // Add the row to the leaderboard table
        leaderboardTable.appendChild(row);
      });
    });
  }
  
  retrieveBoard(); // call the function
  