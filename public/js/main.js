function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            user_Name = user.displayName;

            //method #1:  insert with html only
            //document.getElementById("name-goes-here").innerText = user_Name;    //using javascript
            //method #2:  insert using jquery
            $("#name-goes-here").text(user_Name); //using jquery

        } else {
            // No user is signed in.
        }
    });
}
insertName(); //run the function

// Function to read the quote of the day from Firestore "quotes" collection
// Input param is the String representing the day of the week, aka, the document name
function readQuote(day) {
    db.collection("quotes").doc(day)                                                      //name of the collection and documents should matach excatly with what you have in Firestore
      .onSnapshot(mondayDoc => {                                                               //arrow notation
           console.log("current document data: " + mondayDoc.data());                          //.data() returns data object
           document.getElementById("quote-goes-here").innerHTML = mondayDoc.data().quote;      //using javascript to display the data on the right place
           
           //Here are other ways to access key-value data fields
           //$('#quote-goes-here').text(tuesdayDoc.data().quote);         //using jquery object dot notation
           //$("#quote-goes-here").text(tuesdayDoc.data()["quote"]);      //using json object indexing
		       //document.querySelector("#quote-goes-here").innerHTML = tuesdayDoc.data().quote;
      })
}
readQuote("monday");        //calling the function

function readPoint() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            db.collection("users").doc(user.uid)
                .onSnapshot(doc => {
                    console.log(doc.data());
                    const userPoint = doc.data().point;
                    document.getElementById("point-goes-here").innerHTML = userPoint;
                });
        } else {
        }
    });
}
readPoint(); // call the function


