const loginForm = document.getElementById('LoginForm');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validateEmail() && validatePassword()) {
    loginForm.submit();
  }
});

// Validate the email field
function validateEmail() {
  const emailInput = document.getElementById("EmailLogin");
  const email = emailInput.value;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;

  if (!emailPattern.test(email)) {
    emailInput.style.borderColor = "red";
    emailInput.placeholder = "Enter a valid email";
    return false;
  } else {
    emailInput.style.borderColor = "green";
    return true;
  }
}

// Validate the password field
function validatePassword() {
  const passwordInput = document.getElementById("PassLogin");
  const password = passwordInput.value;

  if (password === "" || password.length < 3) {
    passwordInput.style.borderColor = "red";
    passwordInput.placeholder = "Enter a valid password";
    return false;
  } else {
    passwordInput.style.borderColor = "green";
    return true;
  }
}
