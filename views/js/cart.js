document.addEventListener('DOMContentLoaded', () => {
  const increaseButtons = document.querySelectorAll('.increaseQty');
  const decreaseButtons = document.querySelectorAll('.decreaseQty');
  const quantityElements = document.querySelectorAll('.quantity');

  decreaseButtons.forEach((decreaseButton, index) => {
    decreaseButton.addEventListener('click', async () => {
      let currentQuantity = parseInt(quantityElements[index].textContent);
      if (currentQuantity > 0) {
        currentQuantity--;
        quantityElements[index].textContent = currentQuantity;
        await updateQuantityInDatabase(decreaseButton.getAttribute('data-product-id'), currentQuantity);
        // updateTotalAmounts(); // Update subtotal and total
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
      // updateTotalAmounts(); // Update subtotal and total
    });
  });

});
  

  function updateQuantityInDatabase(productId, quantity) {

    console.log(productId , quantity , 'kjahsfdkjlhsafdklj');
    fetch('/update-quantity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Quantity updated successfully:', data.message);
      })
      .catch(error => {
        console.error('Error updating quantity:', error);
      });
  
}
