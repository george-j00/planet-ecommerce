const loginForm = document.getElementById('adminLogin');

adminLogin.addEventListener('submit', validateForm);

// Validate the email field
function validateEmail() {
  var email = document.getElementById("adminEmail").value; // Changed ID to match HTML
  var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
  if (!re.test(email)) {
    document.getElementById("adminEmail").style.borderColor = "red";
    document.getElementById("adminEmail").placeholder = "Enter valid email";
    return false;
  } else {
    document.getElementById("adminEmail").style.borderColor = "green";
    return true;
  }
}

// Validate the password field
function validatePassword() {
  var password = document.getElementById("adminPassword").value;
  
  if (password == "" || password.length < 3) {
    document.getElementById("adminPassword").style.borderColor = "red";
    document.getElementById("adminPassword").placeholder = "Enter valid password";
    return false;
  } else {
    document.getElementById("adminPassword").style.borderColor = "green";
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
    document.getElementById("adminLogin").submit();
  }
}
