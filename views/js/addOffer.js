const offerForm = document.getElementById('offerForm');

offerForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission.

  // Gather input values.
  const offerName = document.getElementById('offerName').value;
  const discountPercentage = parseFloat(document.getElementById('discountPercentage').value);
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const offerProductId = document.getElementById('offerProduct').value;
    

  // Check for negative values and null inputs.
  if (discountPercentage < 0 || isNaN(discountPercentage) || startDate === '' || endDate === '') {
    alert('Invalid input. Please make sure discount percentage is not negative and start/end dates are not empty.');
    return;
  }

  // Create an object with the input values.
  const offerData = {
    offerName: offerName,
    discountPercentage: discountPercentage,
    startDate: startDate,
    endDate: endDate,
  };

  // Send the offer data to the server via a POST request.
  fetch('/admin/product/add-offer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ offerData,offerProductId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
      const offerModal = new bootstrap.Modal(document.getElementById('offerSuccess'));
        // Close the modal after successfully adding the offer.
        $('#addOffer').modal('hide');
        offerModal.show();
        setTimeout(() => {
          offerModal.hide();
        }, 1000);
      } else {
        alert('Failed to add offer');
      }
    })  
    .catch((error) => {
      console.error(error);
      alert('An error occurred while adding the offer.');
    });
});