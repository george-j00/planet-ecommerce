const resetButton = document.getElementById('resetButton');

resetButton.addEventListener('click', () => {
  if (validatePassword()) {
    document.getElementById("passwordReset").submit();
  }
});

// Validate the password field
function validatePassword() {
  const passwordInput = document.getElementById("resetPassword");
  const confirmPasswordInput = document.getElementById("resetPasswordConfirm");
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (password === "" || confirmPassword === "" || password !== confirmPassword || password.length < 3) {
    passwordInput.style.borderColor = "red";
    confirmPasswordInput.style.borderColor = "red";
    passwordInput.placeholder = "Enter a valid password";
    confirmPasswordInput.placeholder = "Passwords don't match";
    return false;
  } else {
    passwordInput.style.borderColor = "green";
    confirmPasswordInput.style.borderColor = "green";
    return true;
  }
}
