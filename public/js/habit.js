// Initialize Firebase
const firebaseConfig = {
  // Your Firebase project config here
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function addTask() {
  const taskName = document.getElementById("task-name").value;
  const taskFrequency = document.getElementById("task-frequency").value;
  db.collection("tasks").add({
    name: taskName,
    frequency: taskFrequency
  })
  .then(() => {
    console.log("Task added to Firestore!");
  })
  .catch((error) => {
    console.error("Error adding task: ", error);
  });
}

// Listen for changes to the tasks collection
db.collection("tasks").onSnapshot((querySnapshot) => {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";
  querySnapshot.forEach((doc) => {
    const task = doc.data();
    const taskRow = document.createElement("tr");
    taskRow.innerHTML = `
      <td>${task.name}</td>
      <td>${task.frequency}</td>
      <td>
        <button type="button" onclick="editTask('${doc.id}', '${task.name}', '${task.frequency}')">Edit</button>
        <button type="button" onclick="deleteTask('${doc.id}')">Delete</button>
      </td>
    `;
    taskList.appendChild(taskRow);
  });
});

function editTask(taskId, taskName, taskFrequency) {
  const newTaskName = prompt("Enter a new name for the task:", taskName);
  if (newTaskName !== null) {
    const newTaskFrequency = prompt("Enter a new frequency for the task:", taskFrequency);
    if (newTaskFrequency !== null) {
      db.collection("tasks").doc(taskId).update({
        name: newTaskName,
        frequency: newTaskFrequency
      })
      .then(() => {
        console.log("Task updated in Firestore!");
      })
      .catch((error) => {
        console.error("Error updating task: ", error);
      });
    }
  }
}

function deleteTask(taskId) {
  db.collection("tasks").doc(taskId).delete()
  .then(() => {
    console.log("Task deleted from Firestore!");
  })
  .catch((error) => {
    console.error("Error deleting task: ", error);
  });
}
