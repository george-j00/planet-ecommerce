const resetButton = document.getElementById('resetButton');

resetButton.addEventListener('click', validateForm);

  // Validate the password field
  function validatePassword() {
    var password = document.getElementById("resetPassword").value;
    var confirmPassword = document.getElementById("resetPasswordConfirm").value;
    if (password == ""||confirmPassword == "" ||password !== confirmPassword || password.length < 3) {
      document.getElementById("resetPassword").style.borderColor = "red";
      document.getElementById("resetPasswordConfirm").style.borderColor = "red";
      document.getElementById("resetPassword").placeholder = "Enter valid password";
      document.getElementById("resetPasswordConfirm").placeholder = "No match";
      return false;
    } else {
      document.getElementById("resetPassword").style.borderColor = "green";
      document.getElementById("resetPasswordConfirm").style.borderColor = "green";
      return true;
    }
  }

// Validate the form before submitting
function validateForm(e) {
  e.preventDefault();

  let isValid = false; // Corrected variable name
  var passwordValid = validatePassword();

  if (passwordValid) { // Corrected variable name
    isValid = true;
  }

  if (isValid) {
    document.getElementById("passwordReset").submit();
  }
}
