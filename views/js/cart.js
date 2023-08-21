const addToCartBtns = document.querySelectorAll('.addToCartBtn');

addToCartBtns.forEach(button => {
    button.addEventListener('click', () => {
        let quantity = 1 ;
        const productId = button.getAttribute('product-id');
        console.log(productId);
        fetch(`/add-to-cart`,{
            method: 'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({productId})
        })

    })
})

const incrementButtons = document.querySelectorAll('.incrementButton');
const decrementButtons = document.querySelectorAll('.decrementButton');
const quantityInputs = document.querySelectorAll('.quantityInput');
const productPriceElements = document.querySelectorAll('.productPrice');
const subTotalElements = document.querySelectorAll('.subTotal');

incrementButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const quantityInput = quantityInputs[index];
    const productPrice = parseFloat(productPriceElements[index].getAttribute('data-price'));
    const subTotalElement = subTotalElements[index];
  
    quantityInput.value = parseInt(quantityInput.value) + 1;
    subTotalElement.innerText = `$ ${(parseFloat(quantityInput.value) * productPrice).toFixed(2)}`;
  
    updateTotal(); // Call the function to update total
  });
});

decrementButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const quantityInput = quantityInputs[index];
    const productPrice = parseFloat(productPriceElements[index].getAttribute('data-price'));
    const subTotalElement = subTotalElements[index];
  
    if (parseInt(quantityInput.value) > 1) {
      quantityInput.value = parseInt(quantityInput.value) - 1;
      subTotalElement.innerText = `$ ${(parseFloat(quantityInput.value) * productPrice).toFixed(2)}`;
  
      updateTotal(); // Call the function to update total
    }
  });
});


  const subTotalCheckout = document.getElementById('subTotalCheckout');
  const totalCheckout = document.getElementById('totalCheckout');
  const expressRadio = document.getElementById('expressShipping');
  const freeRadio = document.getElementById('freeShipping');
  
  let selectedShipping = 'free'; // Initial shipping option
  
  function updateTotal() {
    let totalSubTotal = 0;
  
    subTotalElements.forEach(subTotalElement => {
      const subtotalValue = parseFloat(subTotalElement.innerText.replace('$', ''));
      totalSubTotal += subtotalValue;
    });
  
    let total = totalSubTotal; // Initialize total with subtotal amount
  
    if (selectedShipping === 'express') {
      total += 15; // Add $15 for express shipping
    }
  
    totalCheckout.innerText = `$ ${total.toFixed(2)}`;
    subTotalCheckout.innerText = `$ ${totalSubTotal.toFixed(2)}`;
  }
  
  // Event listeners for radio buttons
  expressRadio.addEventListener('change', () => {
    selectedShipping = 'express';
    updateTotal();
  });
  
  freeRadio.addEventListener('change', () => {
    selectedShipping = 'free';
    updateTotal();
  });
  
  // Initial call to update total
  updateTotal();
  
  