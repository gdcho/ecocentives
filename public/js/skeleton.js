//---------------------------------------------------
// This function loads the parts of your skeleton
// (navbar, footer, and other things) into html doc.
//---------------------------------------------------
function loadSkeleton() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      // Do something for the user here.
      $("#afterlogin").load("/nav_after_login.html", function () {
      })
      $("#footerapp").load(
        "/footer_after_login.html",
        function (response, status, xhr) {
          if (status == "error") {
          }
        }
      );
    } else {
      // No user is signed in.
    }
  });

  if ($("#beforelogin").length) {
    $("#beforelogin").load("/nav_before_login.html", function () {
    });
  }

  $("#footerPlaceholder").load(
    "/footer.html",
    function (response, status, xhr) {
      if (status == "error") {
      }
    }
  );
}

loadSkeleton(); // Invoke the function

//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        // window.location.href = 'index.html';
      }).catch((error) => {
        // An error happened.
      });
}
