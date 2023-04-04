/* Saving user settings in a subcollection for the user. */
firebase.auth().onAuthStateChanged(async function (user) {
  if (user) {
    const userId = user.uid;
    const userRef = db.collection("users").doc(userId);
    const settingsRef = userRef.collection("settings");
    const saveBtn = document.getElementById("save-settings-btn");

    // Load settings from local storage when the page loads.
    const newRewards = localStorage.getItem("newRewards") === "true";
    const recyclingReminders =
      localStorage.getItem("recyclingReminders") === "true";
    const progressUpdates = localStorage.getItem("progressUpdates") === "true";
    const notificationFrequency = localStorage.getItem("notificationFrequency");
    const connectFacebook = localStorage.getItem("connectFacebook") === "true";
    const connectInstagram =
      localStorage.getItem("connectInstagram") === "true";
    const connectTwitter = localStorage.getItem("connectTwitter") === "true";

    // Set the values of the settings checkboxes and dropdowns.
    document.getElementById("new-rewards").checked = newRewards;
    document.getElementById("recycling-reminders").checked = recyclingReminders;
    document.getElementById("progress-updates").checked = progressUpdates;
    document.getElementById("notification-frequency").value =
      notificationFrequency;
    document.getElementById("connect_facebook").checked = connectFacebook;
    document.getElementById("connect_instagram").checked = connectInstagram;
    document.getElementById("connect_twitter").checked = connectTwitter;

    saveBtn.addEventListener("click", async (event) => {
      event.preventDefault();

      // Get the values of the settings checkboxes and dropdowns.
      const newRewards = document.getElementById("new-rewards").checked;
      const recyclingReminders = document.getElementById(
        "recycling-reminders"
      ).checked;
      const progressUpdates =
        document.getElementById("progress-updates").checked;
      const notificationFrequency = document.getElementById(
        "notification-frequency"
      ).value;
      const connectFacebook =
        document.getElementById("connect_facebook").checked;
      const connectInstagram =
        document.getElementById("connect_instagram").checked;
      const connectTwitter = document.getElementById("connect_twitter").checked;

      // Save the values to the local storage.
      localStorage.setItem("newRewards", newRewards);
      localStorage.setItem("recyclingReminders", recyclingReminders);
      localStorage.setItem("progressUpdates", progressUpdates);
      localStorage.setItem("notificationFrequency", notificationFrequency);
      localStorage.setItem("connectFacebook", connectFacebook);
      localStorage.setItem("connectInstagram", connectInstagram);
      localStorage.setItem("connectTwitter", connectTwitter);

      try {
        await settingsRef.doc("userSettings").set({
          newRewards: newRewards,
          recyclingReminders: recyclingReminders,
          progressUpdates: progressUpdates,
          notificationFrequency: notificationFrequency,
          connectFacebook: connectFacebook,
          connectInstagram: connectInstagram,
          connectTwitter: connectTwitter,
        });
        alert("Settings saved successfully!");
      } catch (error) {}
    });
  } else {
    // User is not authenticated.
  }
});
