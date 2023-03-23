//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here.
            $('#afterlogin').load('/nav_after_login.html', function () {
                console.log("After login navbar loaded successfully.");
            });
            $('#footerPlaceholder').load('./footer.html', function (response, status, xhr) {
                console.log('Loaded footer:', status);
                if (status == 'error') {
                    console.log('Error loading footer:', xhr.status, xhr.statusText);
                }
            });
        } else {
            // No user is signed in.
            $('#beforelogin').load('/nav_before_login.html', function () {
                console.log("Before login navbar loaded successfully.");
            });
        }
    });
    if ($('#beforelogin').length) {
        $('#beforelogin').load('/nav_before_login.html', function () {
            console.log("Before login navbar loaded successfully.");
        });
    }
}

loadSkeleton(); //invoke the function

// // 로그아웃 버튼 클릭 시 실행되는 함수
// function logout() {
//     // 세션 스토리지에 저장된 로그인 정보 삭제
//     sessionStorage.removeItem('isLoggedIn');
//     // 로그인 페이지로 이동
//     window.location.href = 'login.html';
//   }
  
//   // 현재 페이지가 뒤로가기되면 실행되는 함수
//   window.onpageshow = function(event) {
//     // 이전 페이지에서 캐시된 데이터를 삭제
//     if (event.persisted) {
//       // 세션 스토리지에 저장된 로그인 정보 삭제
//       sessionStorage.removeItem('isLoggedIn');
//     }
//   };
  
  //------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
// function logout() {
//     firebase.auth().signOut().then(() => {
//         // Sign-out successful.
//         console.log("logging out user");
//         window.location.href = 'login.html';
//       }).catch((error) => {
//         // An error happened.
//       });
// }

//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
        // window.location.href = 'index.html';
      }).catch((error) => {
        // An error happened.
      });
}


