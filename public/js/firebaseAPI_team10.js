//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
  apiKey: "AIzaSyAzbXxihj6MYUKXYVSwfKY6BBdw1Jfdft0",
  authDomain: "comp1810-demo09.firebaseapp.com",
  projectId: "comp1810-demo09",
  storageBucket: "comp1810-demo09.appspot.com",
  messagingSenderId: "2744707031",
  appId: "1:2744707031:web:501adecfa930927fc50d92"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();