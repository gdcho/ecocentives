/* Display user name from Firestore Database. */
function insertName() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      // Do something for the currently logged-in user here:
      console.log(user.uid); //print the uid in the browser console
      console.log(user.displayName); //print the user name in the browser console
      user_Name = user.displayName;
      $("#name-goes-here").text(user_Name); //using jquery
    } else {
      // No user is signed in.
    }
  });
}
insertName();

/* Display date joined from Firestore Database. */
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
