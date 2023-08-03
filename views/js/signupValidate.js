const form = document.getElementById('SignUpForm')

form.addEventListener('submit', validateForm);


// Validate the name field
function validateName() {
    var name = document.getElementById("nameSignup").value;
    if (name == "" || name.length < 3) {
      document.getElementById("nameSignup").style.borderColor = "red";
      document.getElementById("nameSignup").placeholder = "Enter valid name";
      return false;
    } else {
      document.getElementById("nameSignup").style.borderColor = "green";
      return true;
    }
  }

  // Validate the email field
  function validateEmail() {
    var email = document.getElementById("emailSignup").value;
    var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
    if (!re.test(email)) {
      document.getElementById("emailSignup").style.borderColor = "red";
      document.getElementById("emailSignup").placeholder = "Enter valid email";
      return false;
    } else {
      document.getElementById("emailSignup").style.borderColor = "green";
      return true;
    }
  }
  
  // Validate the password field
  function validatePassword() {
    var password = document.getElementById("passSignup").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    if (password == ""||confirmPassword == "" ||password !== confirmPassword || password.length < 3) {
      document.getElementById("passSignup").style.borderColor = "red";
      document.getElementById("confirmPassword").style.borderColor = "red";
      document.getElementById("passSignup").placeholder = "Enter valid password";
      document.getElementById("confirmPassword").placeholder = "No match";
      return false;
    } else {
      document.getElementById("passSignup").style.borderColor = "green";
      document.getElementById("confirmPassword").style.borderColor = "green";
      return true;
    }
  }
  
  // Validate the form before submitting
  function validateForm(e) {
 
    e.preventDefault();
    
    let isvalid = false;

    var nameValid = validateName();
    var emailValid = validateEmail();
    var passwordValid = validatePassword();
  
    if (nameValid && emailValid && passwordValid) {
      isvalid = true; 
    } 

    if (isvalid) {
        document.getElementById("SignUpForm").submit();
    }
  }
  