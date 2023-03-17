var firebaseConfig = {
  // Your Firebase project configuration details
};

var taskTracker = document.getElementById("task-tracker");

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var currentUser = db.collection("users").doc(user.uid);
    currentUser.collection("tasks").onSnapshot(function(snapshot) {
      taskTracker.innerHTML = "";
      snapshot.forEach(function(doc) {
        var task = doc.data().task;
        var frequency = doc.data().frequency;
        var progress = doc.data().progress;

        var row = taskTracker.insertRow();
        var taskCell = row.insertCell(0);
        var frequencyCell = row.insertCell(1);
        var progressCell = row.insertCell(2);
        taskCell.innerHTML = task;
        frequencyCell.innerHTML = frequency;
        progressCell.innerHTML = progress + "%";

        row.addEventListener("click", function() {
          var newProgress = progress + 10;
          if (newProgress > 100) {
            newProgress = 0;
          }
          doc.ref.update({
            progress: newProgress
          });
        });
      });
    });
  }
});

function addTask() {
  var taskList = document.getElementById("task-list");
  var taskChoice = taskList.options[taskList.selectedIndex].text;
  var frequencyList = document.getElementById("frequency");
  var frequencyChoice = frequencyList.options[frequencyList.selectedIndex].text;

  var user = firebase.auth().currentUser;
  if (!user) {
    return;
  }

  var currentUser = db.collection("users").doc(user.uid);
  currentUser.collection("tasks").add({
    task: taskChoice,
    frequency: frequencyChoice,
    progress: 0
  }).then(function(docRef) {
    console.log("Task added with ID: ", docRef.id);
  }).catch(function(error) {
    console.error("Error adding task: ", error);
  });
}

