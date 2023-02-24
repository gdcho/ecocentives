var firebaseConfig = {
    apiKey: "AIzaSyDIz8b63-RMVo2EGLH5B83vefU9YXrISLU",
    authDomain: "comp1800-group10-bby.firebaseapp.com",
    projectId: "comp1800-group10-bby",
    storageBucket: "comp1800-group10-bby.appspot.com",
    messagingSenderId: "788715568742",
    appId: "1:788715568742:web:76b446df876cc5f0c137a7"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();