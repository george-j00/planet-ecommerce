const productForm = document.getElementById('productForm');
  const productPriceInput = document.getElementById('productPrice');
  const totalQuantityInput = document.getElementById('totalQuantity');
  const validatePrice = document.getElementById('validatePrice');
  const validateQuantity = document.getElementById('validateQuantity');
  const productTitle = document.getElementById('productTitle').value

  productForm.addEventListener('submit', function (event) {
    // Prevent the form from submitting by default
    event.preventDefault();

    // Validate product price and total quantity
    const productPrice = parseFloat(productPriceInput.value);
    const totalQuantity = parseFloat(totalQuantityInput.value);

    if (isNaN(productPrice) || productPrice <= 0 ) {
        validatePrice.textContent = 'Invalid product price';
    }
     else if (isNaN(totalQuantity) || totalQuantity < 0) {
        validateQuantity.textContent = 'Invalid quantity';
    } else {
      // If validation passes, submit the form
      validatePrice.textContent = '';
      validateQuantity.textContent = '';
      formSubmit()
    }
  });


  const formSubmit = async () => {
    // Get the form data
    const formData = new FormData();
  
    // Add the form field values to the form data
    const formElements = document.querySelectorAll("input, select, textarea");
    for (const formElement of formElements) {
      formData.append(formElement.name, formElement.value);
    }
  
    // Add the file data to the form data
    for (let i = 0; i < document.getElementById("productImage").files.length; i++) {
      formData.append("productImage", document.getElementById("productImage").files[i]);
    }
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
   await fetch("/admin/add-product", {
    method: "POST",
    body: formData,
    })
      .then(response => response.json())
      .then(data => { 
        const productSuccessModal = new bootstrap.Modal(document.getElementById('productSuccess'));
        productSuccessModal.show();
        setTimeout(() => {
          productSuccessModal.hide();
        }, 1000);
        console.log('response from the add product');
        window.location.reload();

      });
  };
  