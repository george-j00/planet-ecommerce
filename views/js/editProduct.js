const editProductForm = document.getElementById('editProductForm');
const successModal = new bootstrap.Modal(document.getElementById('successModal'));

editProductForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the default form submission

  console.log('clicked edit product');
  // Access form elements by their IDs
  const productTitle = document.getElementById('editProductTitle').value;
  const productPrice = document.getElementById('editProductPrice').value;
  const productImage = document.getElementById('editProductImage').files[0];
  const productDescription = document.getElementById('editProductDescription').value;
  const productCategory = document.getElementById('editProductCategory').value;
  const additionalInformation = document.getElementById('editAdditionalInformation').value;
  const totalQuantity = document.getElementById('editTotalQuantity').value;
  const currentProduct = document.getElementById('currentProduct').value;

  // Construct a JavaScript object with form data
  const formData = {
    productTitle,
    productPrice,
    productImage,
    productDescription,
    productCategory,
    additionalInformation,
    totalQuantity,
    currentProduct,
  };

  try {
    // Use the formData object to send data to the server
    const response = await fetch('/admin/edit-product', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Handle success (e.g., show a success message)
      console.log('Product edited successfully');
      // Optionally, you can reset the form here
      // editProductForm.reset();

      // Show the success modal
    //   successModal.show();
    } else {
      // Handle errors (e.g., show an error message)
      console.error('Product edit failed');
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle errors here
  }
});
