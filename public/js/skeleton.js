//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here.
            $('#afterlogin').load('/nav_after_login.html', function() {
                console.log("After login navbar loaded successfully.");
            });
        } else {
            // No user is signed in.
            $('#beforelogin').load('/nav_before_login.html', function() {
                console.log("Before login navbar loaded successfully.");
            });
        }
    });
    if ($('#beforelogin').length) {
        $('#beforelogin').load('/nav_before_login.html', function() {
            console.log("Before login navbar loaded successfully.");
        });
    }
}
loadSkeleton(); //invoke the function
