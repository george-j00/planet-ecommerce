
document.addEventListener('DOMContentLoaded', () => {
  const increaseButtons = document.querySelectorAll('.increaseQty');
  const decreaseButtons = document.querySelectorAll('.decreaseQty');
  const quantityElements = document.querySelectorAll('.quantity');
  const expressRadio = document.getElementById('expressShipping');
  const freeRadio = document.getElementById('freeShipping');
  const subTotalCheckout = document.getElementById('subTotalCheckout');
  const totalCheckout = document.getElementById('totalCheckout');
  const deleteBtns = document.querySelectorAll('.deleteCartItem');
  const checkoutBtn = document.getElementById('checkoutBtnId');
  let priceValues = document.querySelectorAll('.productPrice');

  decreaseButtons.forEach((decreaseButton, index) => {
    decreaseButton.addEventListener('click', async () => {
      let currentQuantity = parseInt(quantityElements[index].textContent);
      if (currentQuantity > 1) {
        currentQuantity--;
        quantityElements[index].textContent = currentQuantity;
        await updateQuantityInDatabase(decreaseButton.getAttribute('data-product-id'), currentQuantity);
        updateSubtotalAndTotal(); // Update subtotal and total
        if (currentQuantity <= 0) {
          window.location.reload();
        }
      }
    });
  });

  increaseButtons.forEach((increaseButton, index) => {
    increaseButton.addEventListener('click', async () => {
      let currentQuantity = parseInt(quantityElements[index].textContent);
      currentQuantity++;
      quantityElements[index].textContent = currentQuantity;
      await updateQuantityInDatabase(increaseButton.getAttribute('data-product-id'), currentQuantity);
       updateSubtotalAndTotal(); // Update subtotal and total
    });
  });

 function updateQuantityInDatabase(productId, quantity) {
  return fetch('/update-quantity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  })
  .then(response => response.json())
  .then(data => {
            console.log('Quantity updated successfully:', data.message);
            updateSubtotalInDOM(productId, quantity);

          })
  .catch(error => {
    throw new Error('Error updating quantity:', error);
  });
}

function updateSubtotalInDOM(productId, quantity) {
  // Find the subtotal element corresponding to the productId
  const subtotalCell = document.querySelector(`[data-subtotal][data-product-id="${productId}"]`);
  const productPriceCell = document.querySelector(`[data-price][data-product-id="${productId}"]`);

  if (subtotalCell ) {
    // Retrieve the product price from the data-subtotal attribute
    // const productPrice = parseFloat(subtotalCell.getAttribute('data-subtotal'));
    const productPrice = parseFloat(productPriceCell.getAttribute('data-price'));
    
    // Calculate the new subtotal
    const newSubtotal = productPrice * quantity;

    // Update the inner HTML of the subtotal element
    subtotalCell.textContent = `₹${newSubtotal.toFixed(2)}`;

    // Update the data-subtotal attribute for future reference
    subtotalCell.setAttribute('data-subtotal', newSubtotal);
  }
}

  expressRadio.addEventListener('change', () => {
    updateSubtotalAndTotal();
  });

  freeRadio.addEventListener('change', () => {
    updateSubtotalAndTotal();
  });

  async function updateSubtotalAndTotal() {
    let totalSubTotal = 0;

    const subTotalElements = document.querySelectorAll('.subTotal');

    subTotalElements.forEach((subTotalElement) => {
      const subtotalValue = parseFloat(subTotalElement.getAttribute('data-subtotal'));
      totalSubTotal += subtotalValue;
    });

    let total = totalSubTotal;

    if (expressRadio.checked) {
      total += 15;
    }

    subTotalCheckout.innerText = `${totalSubTotal.toFixed(2)}`;
    totalCheckout.innerText = ` ${total.toFixed(2)}`;
  }

    updateSubtotalAndTotal();

      

  deleteBtns.forEach(deleteBtn => {
    deleteBtn.addEventListener('click', () =>{
      const deleteItem = deleteBtn.getAttribute('data-delete');
      const cartId = deleteBtn.getAttribute('cart-id');
     deleteCartItem(deleteItem , cartId);
    // console.log(deleteItem , 'lkjasdflkjasdf');
    })
  })


  function deleteCartItem(deleteItemId , cartId) {
    fetch('/delete-cartItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ deleteItemId,cartId })//passing the Id's of cart and product
    })
    .then(response => response.json())
    .then(result => {
      const removeCartIteModal = new bootstrap.Modal(document.getElementById('removeCartIteSuccess'));
      removeCartIteModal.show();
      setTimeout(() => {
        removeCartIteModal.hide();
      }, 1000);
      window.location.reload();
    })
    .catch(err => {
      console.error(err);
    });
  }

  checkoutBtn.addEventListener('click', () => {
    window.location.href = 'checkout'
  })


});

