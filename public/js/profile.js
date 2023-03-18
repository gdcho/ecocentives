/* Display user name from Firestore Database. */
function insertName() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      // Do something for the currently logged-in user here:
      console.log(user.uid);
      console.log(user.displayName);
      user_Name = user.displayName;
      $("#name-goes-here").text(user_Name);
    } else {
      // No user is signed in.
    }
  });
}
insertName();

/* Display user email from Firestore Database. */
function readEmail() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          console.log(doc.data());
          const userEmail = doc.data().email;
          document.getElementById("email-goes-here").innerHTML = userEmail;
        });
    } else {
    }
  });
}
readEmail();

/* Display user location from Firestore Database. */
function readLocation() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          console.log(doc.data());
          const userLocation = doc.data().location;
          document.getElementById("location-goes-here").innerHTML = userLocation;
        });
    } else {
    }
  });
}
readLocation();

/* Display date joined from Firestore Database. */
function readJoined() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          const userJoined = doc.data().joined;
          const dateJoined = new Date(userJoined.toDate());
          const options = { year: "numeric", month: "long", day: "numeric" };
          const formattedDateJoined = dateJoined.toLocaleDateString(
            "en-US",
            options
          );
          document.getElementById("joined-goes-here").innerHTML =
            formattedDateJoined;
        });
    } else {
      // No user is signed in.
    }
  });
}
readJoined();

/* Display points balance from Firestore Database. */
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
      // No user is signed in.
    }
  });
}
readPoints();

/* Upload and store user profile picture in Firestore Storage. */
const fileInput = document.getElementById("img-upload");
const image = document.getElementById("img-goes-here");
const uploadButton = document.querySelector("label[for='img-upload']");

fileInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  const blob = URL.createObjectURL(file);
  image.src = blob;
  uploadButton.style.display = "none";
});

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  if (file) {
    saveImageToFirestore(file);
  } else {
    console.error("No file selected");
  }
});

function saveImageToFirestore(file) {
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child(`images/${file.name}`);

  imageRef
    .put(file)
    .then((snapshot) => {
      console.log("Image uploaded successfully");
      imageRef
        .getDownloadURL()
        .then((url) => {
          console.log("Image URL:", url);
          const userRef = firebase
            .firestore()
            .collection("users")
            .doc(currentUser.uid);
          userRef
            .update({
              photoURL: url,
            })
            .then(() => {
              console.log("Image URL saved to Firestore");
            })
            .catch((error) => {
              console.error("Error updating document:", error);
            });
        })
        .catch((error) => {
          console.error("Error getting download URL:", error);
        });
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
    });
}

/* Edit profile and update in Firestore Database. */
function updateName() {
  const nameInput = document.getElementById("nameInput");
  const newName = nameInput.value.trim();

  if (newName === "") {
    // Name input is empty
    return;
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .update({
          displayName: newName,
        })
        .then(() => {
          console.log("Name successfully updated!");
          insertName();
        })
        .catch((error) => {
          console.error("Error updating name:", error);
        });

      user
        .updateProfile({
          displayName: newName,
        })
        .then(() => {
          console.log("User's name updated in authentication profile");
        })
        .catch((error) => {
          console.error(
            "Error updating user's name in authentication profile:",
            error
          );
        });
    }
  });
}

function updateLocation() {
  const locationInput = document.getElementById("locationInput");
  const newLocation = locationInput.value.trim();

  if (newLocation === "") {
    // Location input is empty
    return;
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .update({
          location: newLocation,
        })
        .then(() => {
          console.log("Location successfully updated!");
          // Do something after successful update, if needed
        })
        .catch((error) => {
          console.error("Error updating location:", error);
        });
    }
  });
}

function updateEmail() {
  const emailInput = document.getElementById("emailInput");
  const newEmail = emailInput.value.trim();

  if (newEmail === "") {
    // Email input is empty
    return;
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .update({
          email: newEmail,
        })
        .then(() => {
          console.log("Email successfully updated!");
          readEmail();
        })
        .catch((error) => {
          console.error("Error updating email:", error);
        });

      user
        .updateEmail(newEmail)
        .then(() => {
          console.log("User's email updated in authentication profile");
        })
        .catch((error) => {
          console.error(
            "Error updating user's email in authentication profile:",
            error
          );
        });
    }
  });
}

document.getElementById("saveChanges").addEventListener("click", () => {
  updateName();
  updateLocation();
  updateEmail();
});

document.getElementById("saveChanges").addEventListener("click", function() {
  alert("Changes saved successfully!");
});


