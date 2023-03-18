var table = document.getElementById("task-tracker");
var lastSelectionTime = null; // Initialize the last selection time as null

async function addTask() {
  // Get the selected values from the dropdown
  var taskList = document.getElementById("task-list");
  var taskChoice = taskList.options[taskList.selectedIndex].value;
  
  // Get the selected task's score value
  var scoreValue = 0;
  const ecoActions = await getEcoActions();
  ecoActions.forEach(task => {
    if (task.action === taskChoice) {
      scoreValue = task.score;
    }
  });

  // Check if the task is already in the user's collection
  var user = firebase.auth().currentUser;
  if (user) {
    var currentUser = db.collection("users").doc(user.uid);
    currentUser.collection("tasks").where("task", "==", taskChoice).get()
    .then(function(querySnapshot) {
      if (querySnapshot.size > 0) {
        console.log("Task already added");
        // Display an error message or disable the add button
      } else {
        // Add the selected task to the user's collection with score value
        currentUser.collection("tasks").add({
          task: taskChoice,
          score: scoreValue,
          progress: false // Set progress as false by default, i.e., not completed
        }).then(function(docRef) {
          console.log("Task added with ID: ", docRef.id);
          // Add the selected values to the table
          var row = table.insertRow();
          var taskCell = row.insertCell(0);
          var scoreCell = row.insertCell(1); // Add a new cell for the score value
          var progressCell = row.insertCell(2);
          taskCell.innerHTML = taskChoice;
          scoreCell.innerHTML = scoreValue; // Add the score value to the table
          progressCell.innerHTML = "Not completed"; // Set progress as not completed by default

          // Add a click event listener to the progress cell to toggle completion status
          progressCell.addEventListener("click", function() {
            var currentUser = db.collection("users").doc(user.uid);
            currentUser.collection("tasks").doc(docRef.id).update({
              progress: !progress // Toggle progress status
            }).then(function() {
              console.log("Progress updated successfully");
              updateProgressCell(!progress); // Update the progress cell accordingly
              // Remove the task option from the dropdown if it's completed
              if (progress) {
                Array.from(taskList.options).forEach((option) => {
                  if (option.value === taskChoice) {
                    taskList.removeChild(option);
                  }
                });
              }
            }).catch(function(error) {
              console.error("Error updating progress: ", error);
            });
          });
          // Remove the task option from the dropdown
          Array.from(taskList.options).forEach((option) => {
            if (option.value === taskChoice) {
              taskList.removeChild(option);
            }
          });
          // Update the last selection time
          lastSelectionTime = Date.now();

          // Store the updated task list in the browser's local storage
          const taskListArray = Array.from(taskList.options);
          localStorage.setItem('taskList', JSON.stringify(taskListArray));
        }).catch(function(error) {
          console.error("Error adding task: ", error);
        });
      }
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
  }
}

async function getEcoActions() {
  const ecoActions = [];
  const snapshot = await db.collection('ecoActions').get();
  snapshot.forEach(doc => {
    ecoActions.push(doc.data());
  });
  return ecoActions;
}

async function displayRandomTasks() {
  // Generate a random seed value for the day
  const now = new Date();
  const seed = now.getFullYear() + now.getMonth() + now.getDate();

  // Use the seed value to generate the random task selection
  const ecoActions = await getEcoActions();
  const randomTasks = [];

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random(seed) * ecoActions.length);
    const randomTask = ecoActions[randomIndex];
    randomTasks.push(randomTask);
    ecoActions.splice(randomIndex, 1);
  }

  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  randomTasks.forEach(task => {
    const option = document.createElement('option');
    option.value = task.action;
    option.textContent = `${task.action} (Score value: ${task.score} points)`;
    taskList.appendChild(option);
  });

  // Get the current user's tasks and display them on the table
  var user = firebase.auth().currentUser;
}

function updateTable() {
  var user = firebase.auth().currentUser;
  if (user) {
    var currentUser = db.collection("users").doc(user.uid);
    currentUser.collection("tasks").get()
    .then(function(querySnapshot) {
      var table = document.getElementById("task-tracker"); // Define the table here
      table.innerHTML = ""; // Clear the table before adding new rows
      
      // Insert the labels row at the top of the table
      var labelRow = "<tr><th>Task</th><th>Score</th><th>Progress</th></tr>";
      table.insertAdjacentHTML('beforeend', labelRow);
      
      // Add the task data rows
      var rows = [];
      querySnapshot.forEach(function(doc) {
        var task = doc.data().task;
        var score = doc.data().score;
        var progress = doc.data().progress;
        var row = `<tr><td>${task}</td><td>${score}</td><td>${progress ? "Completed" : "Not completed"}</td></tr>`;
        rows.push(row);
      });
      table.insertAdjacentHTML('beforeend', rows.join(''));
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
  }
}

// Update the task tracker table every time the user logs in
firebase.auth().onAuthStateChanged(function(user) {
if (user) {
console.log("User is signed in");
updateTable(); // Call the updateTable function when the user logs in
} else {
console.log("User is signed out");
}
});

document.addEventListener('DOMContentLoaded', () => {
  displayRandomTasks();
  setInterval(displayRandomTasks, 24 * 60 * 60 * 1000);

  const button = document.getElementById('add-task');
  button.addEventListener('click', addTask);
});
