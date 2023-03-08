
//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here.
            console.log($('#afterlogin').load('/nav_after_login.html'));
            
        } else {
            // No user is signed in.
            console.log($('#beforelogin').load('/nav_before_login.html'));
        }
    });
}
loadSkeleton(); //invoke the function

