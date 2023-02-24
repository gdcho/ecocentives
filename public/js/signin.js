function validate() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (email == "" || password == "") {
        document.getElementById("message").innerHTML = "Please enter both email and password";
    }
    else if (!isValidEmail(email)) {
        document.getElementById("message").innerHTML = "Please enter a valid email address";
    }
    else if (password.length < 8) {
        document.getElementById("message").innerHTML = "Password must be at least 8 characters long";
    }
    else {
        document.getElementById("message").innerHTML = "Login successful!";
    }
}

function isValidEmail(email) {
    // A simple regular expression to check if the email is valid
    var regex = /\S+@\S+\.\S+/;
    return regex.test(email);
}

