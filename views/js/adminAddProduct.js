const productForm = document.getElementById('productForm');
  const productPriceInput = document.getElementById('productPrice');
  const totalQuantityInput = document.getElementById('totalQuantity');
  const validatePrice = document.getElementById('validatePrice');
  const validateQuantity = document.getElementById('validateQuantity');

  productForm.addEventListener('submit', function (event) {
    // Prevent the form from submitting by default
    event.preventDefault();

    // Validate product price and total quantity
    const productPrice = parseFloat(productPriceInput.value);
    const totalQuantity = parseFloat(totalQuantityInput.value);

    if (isNaN(productPrice) || productPrice < 0 ) {
        validatePrice.textContent = 'Invalid product price';
    }
     else if (isNaN(totalQuantity) || totalQuantity < 0) {
        validateQuantity.textContent = 'Invalid quantity';
    } else {
      // If validation passes, submit the form
      validatePrice.textContent = '';
      validateQuantity.textContent = '';
      this.submit();
    }
  });