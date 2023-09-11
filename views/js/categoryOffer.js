const categoryOfferForm = document.getElementById('categoryOfferForm');

categoryOfferForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission.

  // Gather input values.
  const offerName2 = document.getElementById('offerName2').value;
  const discountPercentage2 = parseFloat(document.getElementById('discountPercentage2').value);
  const startDate2 = document.getElementById('startDate2').value;
  const endDate2 = document.getElementById('endDate2').value;
  const offerCategory = document.getElementById('offerCategory').value;

  // Check for negative values and null inputs.
  if (discountPercentage2 < 0 || isNaN(discountPercentage2) || startDate2 === '' || endDate2 === '') {
    alert('Invalid input. Please make sure discount percentage is not negative and start/end dates are not empty.');
    return;
  }

  // Create an object with the input values.
  const offerData = {
    offerName: offerName2,
    discountPercentage: discountPercentage2,
    startDate: startDate2,
    endDate: endDate2,
  };

  // Send the offer data to the server via a POST request.
  fetch('/admin/category/add-offer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ offerData, offerCategory }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
       const categoryOfferSuccessModal = new bootstrap.Modal(document.getElementById('categoryOfferSuccess'));
        categoryOfferSuccessModal.show();
        $('#categoryOfferModal').modal('hide');
        setTimeout(() => {
          categoryOfferSuccessModal.hide();
        }, 1000);
        window.location.reload();
      } else {
        alert('Failed to add offer');
      }
    })
    .catch((error) => {
      console.error(error);
      alert('An error occurred while adding the offer.');
    });
});