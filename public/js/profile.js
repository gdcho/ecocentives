/* Display points balance from Firestore Database. */
function readPoints() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          const userPoints = doc.data().points;
          document.getElementById("points-goes-here").innerHTML = userPoints + " points";
        });
    } else {
      // No user is signed in.
    }
  });
}
readPoints();

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
          document.getElementById("location-goes-here").innerHTML =
            userLocation;
        });
    } else {
    }
  });
}
readLocation();

/* Display user phone number from Firestore Database. */
function readPhone() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          console.log(doc.data());
          const userPhone = doc.data().phone;
          document.getElementById("phone-goes-here").innerHTML = userPhone;
        });
    } else {
    }
  });
}
readPhone();

/* Display date joined from Firestore Database. */
function readJoined() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          const userJoined = doc.data().joined;
          if (userJoined) {
            const dateJoined = new Date(userJoined.toDate());
            const options = { year: "numeric", month: "long", day: "numeric" };
            const formattedDateJoined = dateJoined.toLocaleDateString(
              "en-US",
              options
            );
            document.getElementById("joined-goes-here").innerHTML =
              formattedDateJoined;
          } else {
            console.log("No joined date found for user");
          }
        });
    } else {
      // No user is signed in.
    }
  });
}
readJoined();

/* Upload and store user profile picture in Firestore Storage. */
const fileInput = document.getElementById("img-upload");
const uploadButton = document.querySelector("label[for='img-upload']");

fileInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  uploadButton.style.display = "none";
  saveImageToFirestore(file, firebase.auth().currentUser);
});

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  if (file) {
    saveImageToFirestore(file, firebase.auth().currentUser);
  } else {
    console.error("No file selected");
  }
});

function saveImageToFirestore(file, currentUser) {
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
              firebase
                .auth()
                .currentUser.updateProfile({
                  photoURL: url,
                })
                .then(() => {
                  console.log("Image URL saved to Firebase Authentication");
                  displayProfilePicture();
                })
                .catch((error) => {
                  console.error(
                    "Error updating Firebase Authentication profile:",
                    error
                  );
                });
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

/* Get the user's photoURL from Firestore and display it on the profile page. */
function displayProfilePicture() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const profilePicture = document.getElementById("profile-picture");
      if (!user.photoURL) {
        const userRef = firebase.firestore().collection("users").doc(user.uid);
        userRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              const photoURL = doc.data().photoURL;
              if (photoURL) {
                profilePicture.src = photoURL;
              } else {
                console.log("No photoURL found in Firestore");
              }
            } else {
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      }
    }
  });
}

firebase.auth().onAuthStateChanged((user) => {
  const profilePicture = document.getElementById("profile-picture");
  if (user) {
    if (user.photoURL) {
      profilePicture.src = user.photoURL;
    }
  } else {
    // No user is signed in.
  }
});

/* Edit profile and update in Firestore Database. */
function updateName() {
  const nameInput = document.getElementById("nameInput");
  const newName = nameInput.value.trim();

  if (newName === "") {
    // Name input is empty.
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
    // Location input is empty.
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
    // Email input is empty.
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

function updatePhone() {
  const phoneInput = document.getElementById("phoneInput");
  const newPhone = phoneInput.value.trim();
  const phoneRegex = /^\(\d{3}\) \d{3}\-\d{4}$/;

  if (!phoneRegex.test(newPhone)) {
    // Phone input does not match the desired format.
    alert("Phone number should be in the format (xxx) xxx-xxxx");
    return false;
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .update({
          phone: newPhone,
        })
        .then(() => {
          console.log("Phone successfully updated!");
          alert("Changes saved successfully!");
          $("#editModal").modal("hide");
          return true;
        })
        .catch((error) => {
          console.error("Error updating phone:", error);
          return false;
        });
    }
  });
}

document.getElementById("saveChanges").addEventListener("click", () => {
  updateName();
  updateLocation();
  updateEmail();
  updatePhone();
});

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    const currentUser = firebase.auth().currentUser;
    const redeemedRef = db
      .collection("users")
      .doc(currentUser.uid)
      .collection("redeemed");

    redeemedRef
      .orderBy("timestamp", "desc")
      .limit(1)
      .get()
      .then(function (querySnapshot) {
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          document.getElementById("redeemed-reward").textContent = "("+data.reward+")";
          document.getElementById("redeemed-score").textContent = "-" + data.points +" points";
        }
      });
  } else {
    // No user is signed in.
  }
});
