/* Display user points from Firestore Database. */
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

var table = document.getElementById("task-tracker");
var lastSelectionTime = null;

async function addTask() {
  var taskList = document.getElementById("task-list");
  var taskChoice = taskList.options[taskList.selectedIndex].value;

  var scoreValue = 0;
  const ecoActions = await getEcoActions();
  ecoActions.forEach((task) => {
    if (task.action === taskChoice) {
      scoreValue = task.score;
    }
  });

  var user = firebase.auth().currentUser;
  if (user) {
    var currentUser = db.collection("users").doc(user.uid);
    currentUser
      .collection("tasks")
      .where("task", "==", taskChoice)
      .get()
      .then(function (querySnapshot) {
        if (querySnapshot.size > 0) {
          // Display an error message in a modal
          displayModal("Task already added");
        } else {
          currentUser
            .collection("tasks")
            .add({
              task: taskChoice,
              score: scoreValue,
              progress: false,
            })
            .then(function (docRef) {
              // Update the table after the task is added
              updateTable();
            })
            .catch(function (error) {
              console.error("Error adding task: ", error);
            });
        }
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }
}

async function getEcoActions() {
  const ecoActions = [];
  const snapshot = await db.collection("ecoActions").get();
  snapshot.forEach((doc) => {
    ecoActions.push(doc.data());
  });
  return ecoActions;
}

async function displayRandomTasks() {
  // Generate a random seed value for the day
  const now = new Date();
  const seed = now.getFullYear() + now.getMonth() + now.getDate();

  const ecoActions = await getEcoActions();
  const randomTasks = [];

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random(seed) * ecoActions.length);
    const randomTask = ecoActions[randomIndex];
    randomTasks.push(randomTask);
    ecoActions.splice(randomIndex, 1);
  }

  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  randomTasks.forEach((task) => {
    const option = document.createElement("option");
    option.value = task.action;
    option.textContent = `${task.action} (Score value: ${task.score} points)`;
    taskList.appendChild(option);
  });

  var user = firebase.auth().currentUser;
}

function updateTable() {
  var user = firebase.auth().currentUser;
  if (user) {
    var currentUser = db.collection("users").doc(user.uid);
    currentUser
      .collection("tasks")
      .get()
      .then(function (querySnapshot) {
        var table = document.getElementById("task-tracker");
        table.innerHTML = "";

        var labelRow =
          "<tr><th>Task</th><th>Score</th><th>Progress</th><th>Complete Task</th></tr>";
        table.insertAdjacentHTML("beforeend", labelRow);

        var rows = [];
        querySnapshot.forEach(function (doc) {
          var task = doc.data().task;
          var score = doc.data().score;
          var progress = doc.data().progress;
          var image = doc.data().image
            ? `<img src="${doc.data().image}" alt="Task Image">`
            : `<button data-task-id="${doc.id}" class="task">Upload Image</button>`;
          var row = `<tr><td>${task}</td><td>${score}</td><td>${
            progress ? "Completed" : "Not completed"
          }</td><td>${image}</td></tr>`;
          rows.push(row);
        });
        table.insertAdjacentHTML("beforeend", rows.join(""));

        attachImageUploadToTasks();
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }
}

async function attachImageUploadToTasks() {
  const taskElements = document.querySelectorAll(".task");

  taskElements.forEach((taskElement) => {
    taskElement.addEventListener("click", async () => {
      const file = await pickFile();

      if (!file) {
        return;
      }

      // Upload the image to Firebase Storage
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`uploads/${file.name}`);
      const uploadTask = fileRef.put(file);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        null,
        null,
        async () => {
          // Get the download URL of the uploaded image
          const imageUrl = await fileRef.getDownloadURL();

          // Call the Google Vision API to analyze the image
          const apiKey = API_KEY;
          const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
          const data = {
            requests: [
              {
                image: {
                  source: {
                    imageUri: imageUrl,
                  },
                },
                features: [
                  {
                    type: "LABEL_DETECTION",
                  },
                ],
              },
            ],
          };

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          const json = await response.json();

          // Extract the label annotations from the API response
          const labelAnnotations = json.responses[0].labelAnnotations;

          // Extract the description, score, and topicality values from the label annotations
          const descriptions = labelAnnotations.map((label) => {
            return label.description;
          });
          const score = labelAnnotations[0].score;
          const topicality = labelAnnotations[0].topicality;

          // Update the Firestore document with the task data and descriptions
          const taskId = taskElement.dataset.taskId;
          const taskRef = firebase.firestore().collection("tasks").doc(taskId);
          taskRef
            .set(
              {
                image: imageUrl,
                descriptions: descriptions,
                score: score,
                topicality: topicality,
              },
              { merge: true }
            )
            .then(() => {
              // Check if any ecoActions match the descriptions and update user points accordingly
              const currentUser = firebase.auth().currentUser;
              const userRef = firebase
                .firestore()
                .collection("users")
                .doc(currentUser.uid);
              const taskDescRef = firebase
                .firestore()
                .collection("tasks")
                .doc(taskId);

              taskDescRef.get().then(async (doc) => {
                if (doc.exists) {
                  const descriptions = doc
                    .data()
                    .descriptions.map((description) =>
                      description.toLowerCase()
                    );
                  let pointsToAdd = 0;
                  let actionWords = [];

                  if (Array.isArray(descriptions)) {
                    const flatDescriptions = descriptions.flat();

                    ecoActions.forEach((action) => {
                      actionWords = action.action
                        .split(" ")
                        .map((word) => word.toLowerCase());
                      let actionPointsToAdd = 0;

                      actionWords.forEach((word) => {
                        if (flatDescriptions.includes(word)) {
                          actionPointsToAdd += action.score;
                        }
                      });
                      pointsToAdd += actionPointsToAdd;
                    });

                    // Get the task data
                    const taskData = await taskDescRef.get().then((doc) => {
                      if (doc.exists) {
                        return doc.data();
                      }
                    });

                    // Add the task's point value to the points to add
                    pointsToAdd += taskData.pointValue;

                    if (pointsToAdd > 0) {
                      // Update the user's points
                      userRef
                        .update({
                          points:
                            firebase.firestore.FieldValue.increment(
                              pointsToAdd
                            ),
                        })
                        .then(function () {
                          console.log("User points updated successfully!");
                        })
                        .catch(function (error) {
                          console.error("Error updating user points: ", error);
                        });
                    } else {
                      console.log("User points failed to update.");
                      console.log(actionWords);
                      console.log(flatDescriptions);
                    }
                  } else {
                    console.error("Error: descriptions is not an array.");
                  }
                }
              });

              updateTable();
            })
            .catch((error) => {
              console.error("Error adding task: ", error);
            });
        }
      );
    });
  });
}

async function pickFile() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", (event) => {
      const file = event.target.files[0];
      resolve(file);
    });
    input.click();
  });
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log("User is signed in");
    updateTable();
  } else {
    console.log("User is signed out");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  displayRandomTasks();
  setInterval(displayRandomTasks, 24 * 60 * 60 * 1000);

  const button = document.getElementById("add-task");
  button.addEventListener("click", addTask);
});

function displayModal(message) {
  var modal = document.getElementById("modal");
  var modalMessage = document.getElementById("modal-message");

  modalMessage.innerHTML = message;
  modal.classList.remove("modal-closed");
  modal.classList.add("modal-open");

  setTimeout(function () {
    modal.classList.remove("modal-open");
    modal.classList.add("modal-closing");

    setTimeout(function () {
      modal.classList.remove("modal-closing");
      modal.classList.add("modal-closed");
    }, 500);
  }, 2000);
}
