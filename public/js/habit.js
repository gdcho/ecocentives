// Initialize Firebase
const firebaseConfig = {
  // your firebase config goes here
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

// Get a reference to the task tracker table
const taskTrackerTable = document.getElementById("task-tracker");

// Get a reference to the points value span
const pointsValueSpan = document.getElementById("points-value");

// Define a function to add a new task to the task tracker
function addTask() {
  // Get the selected task and frequency
  const selectedTask = document.getElementById("task-list").value;
  const selectedFrequency = document.getElementById("frequency").value;

  // Add the task to the task tracker in the database
  const newTaskRef = database.ref().child("taskTracker").push();
  newTaskRef.set({
    task: selectedTask,
    frequency: selectedFrequency,
    progress: 0,
  });
}

// Define a function to update the task tracker table
function updateTaskTracker(taskTracker) {
  // Clear the task tracker table
  taskTrackerTable.innerHTML = "";

  // Loop through the task tracker and add each task to the table
  let totalPoints = 0;
  for (const [key, value] of Object.entries(taskTracker)) {
    const task = value.task;
    const frequency = value.frequency;
    const progress = value.progress;
    const points = progress * 10;
    totalPoints += points;
    const newRow = taskTrackerTable.insertRow();
    const taskCell = newRow.insertCell();
    taskCell.innerHTML = task;
    const frequencyCell = newRow.insertCell();
    frequencyCell.innerHTML = frequency;
    const progressCell = newRow.insertCell();
    progressCell.innerHTML = `${progress}/${frequency}`;
    const pointsCell = newRow.insertCell();
    pointsCell.innerHTML = points;
  }

  // Update the points value span
  pointsValueSpan.innerHTML = totalPoints;
}

// Listen for changes to the task tracker in the database
const taskTrackerRef = database.ref("taskTracker");
taskTrackerRef.on("value", (snapshot) => {
  const taskTracker = snapshot.val();
  updateTaskTracker(taskTracker);
});
