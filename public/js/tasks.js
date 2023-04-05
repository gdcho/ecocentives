import { API_KEY } from "/js/api-key.js";

/* Display points balance from Firestore Database. */
function readPoints() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          const userPoints = doc.data().points;
          document.getElementById("points-goes-here").innerHTML =
            userPoints + " points";
        });
    } else {
    }
  });
}
readPoints();

/* Add chosen task(s) for user in Firestore. */
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
            .catch(function (error) {});
        }
      })
      .catch(function (error) {});
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

/* Display available tasks from Firestore Database. */
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
          var image = `<button data-task-id="${doc.id}" class="task">Upload Image</button>`;
          if (doc.data().image) {
            image += `<br><img class="hidden" src="${
              doc.data().image
            }" alt="Task Image">`;
          }

          if (!progress) {
            // Only add the row if the task is not completed
            var row = `<tr><td>${task}</td><td>${score}</td><td>${
              progress ? "Completed" : "Not completed"
            }</td><td>${image}</td></tr>`;
            rows.push(row);
          }
        });

        table.insertAdjacentHTML("beforeend", rows.join(""));

        attachImageUploadToTasks();
      })
      .catch(function (error) {});
  }
}

/* Allow users to upload proof of completion for tasks. */
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
          const scoreVal = labelAnnotations[0].score;
          const topicality = labelAnnotations[0].topicality;

          // Update the Firestore document with the task data and descriptions
          const taskId = taskElement.dataset.taskId;
          const taskRef = firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("tasks")
            .doc(taskId);
          taskRef
            .set(
              {
                image: imageUrl,
                descriptions: descriptions,
                scoreVal: scoreVal,
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
                .collection("users")
                .doc(currentUser.uid)
                .collection("tasks")
                .doc(taskId);

              taskRef.get().then(async (doc) => {
                if (doc.exists) {
                  const descriptions = labelAnnotations
                    .flatMap((label) => {
                      return label.description.split(" ");
                    })
                    .map((word) => {
                      return word.toLowerCase();
                    });
                  let pointsToAdd = 0;
                  let actionWords = [];

                  if (Array.isArray(descriptions)) {
                    const flatDescriptions = descriptions.flat();

                    const tasksRef = firebase
                      .firestore()
                      .collection("users")
                      .doc(currentUser.uid)
                      .collection("tasks");
                    const taskDoc = await tasksRef.doc(taskId).get();
                    const taskData = taskDoc.data();

                    taskData.task.split(",").forEach((action) => {
                      actionWords = action
                        .split(/[\s-]+/)
                        .map((word) => word.toLowerCase());
                      let actionPointsToAdd = 0;
                      actionWords.forEach((word) => {
                        if (
                          flatDescriptions.includes(word) &&
                          actionPointsToAdd == 0
                        ) {
                          actionPointsToAdd += taskData.score;
                        }
                      });
                      pointsToAdd += actionPointsToAdd;
                    });

                    console.log("pointsToAdd:", pointsToAdd);
                    console.log("actionWords:", actionWords);
                    console.log("flatDescriptions:", flatDescriptions);

                    if (pointsToAdd > 0) {
                      // Mark the task as completed
                      taskDescRef
                        .update({ progress: true })
                        .then(() => console.log("Task marked as completed."))
                        .catch((error) =>
                          console.error(
                            "Error marking task as completed:",
                            error
                          )
                        );

                      // Remove the completed task from the table
                      var completedTask = document.querySelector(
                        `[data-task-id="${taskId}"]`
                      );
                      if (completedTask) {
                        completedTask.parentNode.parentNode.remove();
                      }

                      // Update the user's points
                      userRef
                        .update({
                          points:
                            firebase.firestore.FieldValue.increment(
                              pointsToAdd
                            ),
                        })
                        .then(function () {
                          // Remove the completed task from the table
                          var completedTask = document.querySelector(
                            `[data-task-id="${taskId}"]`
                          );
                          if (completedTask) {
                            completedTask.parentNode.parentNode.remove();
                          }
                          // Display success modal
                          displayModal(
                            "Task passed! Points added successfully."
                          );
                          updateTable();
                        })
                        .catch(function (error) {});
                    } else {
                      // Display error modal
                      displayModal("Task failed. No points added.");
                      updateTable();
                    }
                  } else {
                  }
                }
              });
            })
            .catch((error) => {
              console.error("Error adding task: ", error);
            });
        }
      );
    });
  });
}

/* Display completed tasks from Firestore Database. */
async function displayCompletedTasks() {
  const user = firebase.auth().currentUser;
  if (user) {
    const currentUser = db.collection("users").doc(user.uid);
    const querySnapshot = await currentUser
      .collection("tasks")
      .where("progress", "==", true)
      .get();
    const tableBody = document.getElementById("completed-tasks-table");
    tableBody.innerHTML = "";

    querySnapshot.forEach(function (doc) {
      const task = doc.data().task;
      const score = doc.data().score;
      const image = doc.data().image;

      const row = `<tr><td>${task}</td><td>${score}</td><td><img src="${image}" alt="Task Image"></td></tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
    if (querySnapshot.empty) {
    } else {
    }
  }
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
    updateTable();
    displayCompletedTasks();
  } else {
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
