let userPassword = "1234"; // Default password

function validateLogin() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if (username === "admin" && password === userPassword) {
        alert("Login Successful!");
        return true;
    } else {
        alert("Invalid Credentials");
        return false;
    }
}

function setNewPassword() {
    let newPassword = document.getElementById("new-password").value;
    let confirmPassword = document.getElementById("confirm-password").value;
    if (username === "admin" && newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return false;
    }
    userPassword = newPassword;
    alert("Password Reset Successful! You can now log in with your new password.");
    return true;
}
