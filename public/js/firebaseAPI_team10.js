//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
  apiKey: "AIzaSyDRDpX0J5MhrUoXb3IrLe8d2nRa10KC1Gs",
  authDomain: "comp1800-202310-3a4f1.firebaseapp.com",
  projectId: "comp1800-202310-3a4f1",
  storageBucket: "comp1800-202310-3a4f1.appspot.com",
  messagingSenderId: "98352856971",
  appId: "1:98352856971:web:8937db7ec1c6c5d88b798e"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
//const storage = firebase.storage();