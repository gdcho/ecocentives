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
  if (user) {
    var currentUser = db.collection("users").doc(user.uid);
    currentUser.collection("tasks").where("progress", "==", false).get()
    .then(function(querySnapshot) {
      var table = document.getElementById("task-tracker"); // Define the table here
      querySnapshot.forEach(function(doc) {
        var task = doc.data().task;
        var row = table.insertRow();
        var taskCell = row.insertCell(0);
        var frequencyCell = row.insertCell(1);
        var progressCell = row.insertCell(2);
        taskCell.innerHTML = task;
        progressCell.innerHTML = "Not completed"; // Set progress as not completed by default
        // Add a click event listener to the progress cell to toggle completion status
        progressCell.addEventListener("click", function() {
          var currentUser = db.collection("users").doc(user.uid);
          currentUser.collection("tasks").doc(doc.id).update({
            progress: true // Set progress as completed
          }).then(function() {
            console.log("Progress updated successfully");
            progressCell.innerHTML = "Completed"; // Update the progress cell accordingly
          }).catch(function(error) {
            console.error("Error updating progress: ", error);
          });
        });
        // Remove the task option from the dropdown
        Array.from(taskList.options).forEach((option) => {
          if (option.value === task) {
            taskList.removeChild(option);
          }
        });
      });
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
  }
}


document.addEventListener('DOMContentLoaded', () => {
  displayRandomTasks();
  setInterval(displayRandomTasks, 24 * 60 * 60 * 1000);

  const button = document.getElementById('add-task');
  button.addEventListener('click', addTask);
});

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


