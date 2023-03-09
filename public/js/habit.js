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
