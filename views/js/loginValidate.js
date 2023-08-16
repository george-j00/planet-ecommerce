const loginForm = document.getElementById('LoginForm');

loginForm.addEventListener('submit', validateForm);

// Validate the email field
function validateEmail() {
  var email = document.getElementById("EmailLogin").value; // Changed ID to match HTML
  var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
  if (!re.test(email)) {
    document.getElementById("EmailLogin").style.borderColor = "red";
    document.getElementById("EmailLogin").placeholder = "Enter valid email";
    return false;
  } else {
    document.getElementById("EmailLogin").style.borderColor = "green";
    return true;
  }
}

// Validate the password field
function validatePassword() {
  var password = document.getElementById("PassLogin").value;
  
  if (password == "" || password.length < 3) {
    document.getElementById("PassLogin").style.borderColor = "red";
    document.getElementById("PassLogin").placeholder = "Enter valid password";
    return false;
  } else {
    document.getElementById("PassLogin").style.borderColor = "green";
    return true;
  }
}

// Validate the form before submitting
function validateForm(e) {
  e.preventDefault();

  let isValid = false; // Corrected variable name

  var emailValid = validateEmail();
  var passwordValid = validatePassword();

  if (emailValid && passwordValid) { // Corrected variable name
    isValid = true;
  }

  if (isValid) {
    document.getElementById("LoginForm").submit();
  }
}
