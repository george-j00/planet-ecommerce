
//category management
const profileForm = document.getElementById('profileForm');

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the default form submission

  try {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phoneNumber').value;
    const userId = document.getElementById('userId').value;
    
    const response = await fetch('/profile/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, phone,userId })    
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const data = await response.json();
    console.log(data, 'this is response message');
    alert('Profile updated successfully');
    window.location.reload();
  } catch (error) {
    console.error('Error:', error);
    // Handle errors here
  }
});


