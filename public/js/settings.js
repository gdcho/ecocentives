const user = firebase.auth().currentUser;

if (user) {
  const userId = user.uid;
  const userRef = db.collection("users").doc(userId);
  const settingsRef = userRef.collection("settings");
  const saveBtn = document.getElementById("save-settings-btn");

  saveBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const newRewards = document.getElementById("new-rewards").checked;
    const recyclingReminders = document.getElementById(
      "recycling-reminders"
    ).checked;
    const progressUpdates = document.getElementById("progress-updates").checked;
    const notificationFrequency = document.getElementById(
      "notification-frequency"
    ).value;
    const connectFacebook = document.getElementById("connect_facebook").checked;
    const connectInstagram =
      document.getElementById("connect_instagram").checked;
    const connectTwitter = document.getElementById("connect_twitter").checked;

    settingsRef
      .doc("userSettings")
      .set({
        newRewards: newRewards,
        recyclingReminders: recyclingReminders,
        progressUpdates: progressUpdates,
        notificationFrequency: notificationFrequency,
        connectFacebook: connectFacebook,
        connectInstagram: connectInstagram,
        connectTwitter: connectTwitter,
      })
      .then(() => {
        console.log("Settings saved successfully!");
        alert("Settings saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving settings: ", error);
      });
  });
} else {
  // User is not authenticated
  console.log("User is not authenticated.");
}
