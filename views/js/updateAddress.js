
//category management
const editAddressForm = document.getElementById('editAddressForm');
const editAddressBtns = document.querySelectorAll('.edit-address-btn')
const deleteAddressBtns = document.querySelectorAll('.delete-address-btn')
const editAddressId = document.getElementById('editAddressId');

editAddressBtns.forEach((editAddressBtn) => {
    editAddressBtn.addEventListener('click',  () => {
        const addressId = editAddressBtn.getAttribute('data-address-id');

        // console.log(addressId , 'adddddad');

        editAddressId.value = addressId

       fetch(`/profile/update-address/${addressId}`)
       .then(res => res.json())
       .then(data => {
       
        openModal(data);
       })
    });
});

function openModal(data) {
    document.getElementById('editCountry').value = data.country;
    document.getElementById('editStreetAddress').value = data.streetAddress;
    document.getElementById('editCity').value = data.city;
    document.getElementById('editState').value = data.state;
    document.getElementById('editPincode').value = data.pincode;
}

editAddressForm.addEventListener('submit', async (event) => {

  event.preventDefault(); // Prevent the default form submission

  try {
    const name = document.getElementById('editName').value;
    const country = document.getElementById('editCountry').value;
    const streetAddress = document.getElementById('editStreetAddress').value;
    const city = document.getElementById('editCity').value;
    const state = document.getElementById('editState').value;
    const pincode = document.getElementById('editPincode').value;
    const userId = document.getElementById('editUserId').value;
    const editAddressId = document.getElementById('editAddressId').value;
    
    const response = await fetch(`/profile/update-address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name, country, streetAddress, city,state ,pincode ,userId ,editAddressId})    
    });

    if (response.ok) {
      alert('Address updated successfully')
      window.location.reload();
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle errors here
  }
});

//delete address
deleteAddressBtns.forEach((deleteAddressBtn) => {
  deleteAddressBtn.addEventListener('click',  () => {
    const addressId = deleteAddressBtn.getAttribute('data-address-id');
    const deleteAddressModal = new bootstrap.Modal(document.getElementById('deleteAddressModal'));
    const modalDeleteAddressBtn = document.getElementById('modalDeleteAddressBtn');
    deleteAddressModal.show();
    modalDeleteAddressBtn.addEventListener('click', () => {
      deleteAddress(addressId);
  });
  });
});
 
function deleteAddress(addressId){
  fetch(`/profile/delete-address`, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify({addressId})    
 })
 .then((response) => {
   if (response.ok) {
     window.location.reload();
   }
 })
}