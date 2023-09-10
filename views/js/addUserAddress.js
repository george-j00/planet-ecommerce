
const userAddAddressForm = document.getElementById('userAddAddressForm');
const pincode = document.getElementById('pincode');
const pincodeValidate = document.getElementById('pincodeValidate');
const addAddressModal = document.getElementById('addAddressModal');
// const addressCount = document.getElementById('addressCount');

userAddAddressForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the default form submission
  try {
    
const country = document.getElementById('country').value;
const streetAddress = document.getElementById('streetAddress').value;
const city = document.getElementById('city').value;
const state = document.getElementById('state').value;
const pincodeValue = pincode.value;
const userId = document.getElementById('userId').value;

    console.log(country , streetAddress , city , state , pincodeValue , userId , 'this is address datat');
    const data = {
        country,
        streetAddress,
        city,
        state,
        pincodeValue,
        userId
    }
// console.log('clicked country');
    const response = await fetch('/profile/add-address', {
        method: 'POST',
        headers : {
            "content-type" : "application/json"
            },
        body : JSON.stringify(data)
       })

       if (response.ok) {
        alert('address added successfully');
        window.location.reload();
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

//check the pincode at reali time
pincode.addEventListener('input',  () => {
    if (pincode.value.length > 6 ) {
        pincode.value = pincode.value.slice(0, 6);
        pincode.disable = true;
       pincodeValidate.textContent = "Enter 6 digit pincode "
    }else{
        pincode.disable = false;
        pincodeValidate.textContent = ""
    }

})


