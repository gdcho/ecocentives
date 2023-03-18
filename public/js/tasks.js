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
        // Display an error message in a modal
        displayModal("Task already added");
      } else {
        // Add the selected task to the user's collection with score value
        currentUser.collection("tasks").add({
          task: taskChoice,
          score: scoreValue,
          progress: false // Set progress as false by default, i.e., not completed
        }).then(function(docRef) {
          // Update the table after the task is added
          updateTable();
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

// Display a modal message that automatically closes after 3 seconds
function displayModal(message) {
  var modal = document.getElementById("modal");
  var modalMessage = document.getElementById("modal-message");

  // Set the message and show the modal
  modalMessage.innerHTML = message;
  modal.classList.remove("modal-closed");
  modal.classList.add("modal-open");

  // Automatically close the modal after 3 seconds
  setTimeout(function() {
    modal.classList.remove("modal-open");
    modal.classList.add("modal-closing");

    // Reset the modal after the animation finishes
    setTimeout(function() {
      modal.classList.remove("modal-closing");
      modal.classList.add("modal-closed");
    }, 500); // Wait for the animation to finish (0.5 seconds)
  }, 2000); // Close the modal after 3 seconds
}
