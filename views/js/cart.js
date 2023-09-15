
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
            updateSubtotalInDOM(productId, quantity);
            console.log('Quantity updated successfully:', data.message);
          })
  .catch(error => {
    throw new Error('Error updating quantity:', error);
  });
}

function updateSubtotalInDOM(productId, quantity) {
  const subtotalCell = document.querySelector(`[data-subtotal-cell][data-product-id="${productId}"]`);
  const productPrice = parseFloat(subtotalCell.getAttribute('data-subtotal')) / quantity;

  const newSubtotal = productPrice * quantity;
  subtotalCell.textContent = `₹${newSubtotal.toFixed(2)}`;
  subtotalCell.setAttribute('data-subtotal', newSubtotal);
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
      alert('Cart item deleted successfully');
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

