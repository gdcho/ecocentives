var firebaseConfig = {
  // Your Firebase project configuration details
};

function addTask() {
  // Get the selected values from the dropdowns
  var taskList = document.getElementById("task-list");
  var taskChoice = taskList.options[taskList.selectedIndex].text;
  var frequencyList = document.getElementById("frequency");
  var frequencyChoice = frequencyList.options[frequencyList.selectedIndex].text;

  //내 로그인 되어있으면
  firebase.auth().onAuthStateChanged((user) => {
      console.log('task');
      console.log(taskChoice);
      var currentUser = db.collection("users").doc(user.uid);
      var userUID = user.uid;
     
      //Add the selected values to the Firebase database
      db.collection("users").doc(userUID).update({
        task: taskChoice,
        frequency:frequencyChoice
      }).then(function(){
        console.log("test success");
      }).catch(function(error){
        console.log('error' +error);
      })
  });

  // Add the selected values to the table
  var table = document.getElementById("task-tracker");
  var row = table.insertRow();
  var taskCell = row.insertCell(0);
  var frequencyCell = row.insertCell(1);
  var progressCell = row.insertCell(2);
  taskCell.innerHTML = taskChoice;
  frequencyCell.innerHTML = frequencyChoice;
  progressCell.innerHTML = "0%";
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
  const ecoActions = await getEcoActions();
  const randomTasks = [];

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * ecoActions.length);
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
}

displayRandomTasks();
setInterval(displayRandomTasks, 24 * 60 * 60 * 1000);
