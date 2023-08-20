const progLanguage = ['Java', 'HTML', 'CSS', 'Python', 'JavaScript', 'SQL', 'GO', 'PHP', 'C++', 'C#'];

// Define the event listener function
function addButtonClickListener(button, language) {
  button.addEventListener('click', function() {
    // Display an alert with the text content of the clicked button
    alert(`You clicked on ${language}`);
  });
}

// Loop through the array and create buttons
for (const i in progLanguage) {
  const newButton = document.createElement('button');
  newButton.textContent = progLanguage[i];
  document.body.appendChild(newButton);

  // Call the event listener function to attach the listener
  addButtonClickListener(newButton, progLanguage[i]);
}
