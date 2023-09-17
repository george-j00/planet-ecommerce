
const cancelBtns = document.querySelectorAll('.orderCancelBtn');

cancelBtns.forEach(cancelBtn => {
    cancelBtn.addEventListener('click', () =>{
        const orderId = cancelBtn.getAttribute('data-order-id');
        sendOrderId(orderId);
    })
});

function sendOrderId(orderId) {

    console.log(orderId ,'order id ');
    fetch(`/order-cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({orderId})
    })
    .then(response => response.json())
    .then(data => {
      console.log('Order canceled');
      window.location.reload();
    })
    .catch(error => {
      console.error('Error canceling order:', error);
      // Handle errors if needed
    });
  }
