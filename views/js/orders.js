
const orderData = {
  userId : null,
  items: [], 
  shippingAddress: {}, 
  paymentMethod: "",
  shippingCharge: 0,
  subtotal: 0, 
  totalAmount: 0, 
  createdOn: new Date(), 
  status: "Pending", //default status
  deliveredOn: null, 
};

// Get references to the HTML elements
const shippingRadios = document.querySelectorAll('.shipping');
const subtotalElement = document.getElementById('checkoutSubTotal');
const totalElement = document.getElementById('checkoutTotal');
const confrimPayementBtns = document.querySelectorAll('.confrimPayementBtn');
const checkoutProductData = document.querySelectorAll('.checkoutProductData');
const addressCards = document.querySelectorAll('.addressCard');
const confirmPaymentButtons = document.querySelectorAll('.confrimPayementBtn');


// Define shipping charges
const FREE_SHIPPING_CHARGE = 0;
const EXPRESS_SHIPPING_CHARGE = 15;

confirmPaymentButtons.forEach(button => {
  button.addEventListener('click', () => {
   if ( handleConfirmPayment()) {
    sendOrderData();
   }
  });
});

function handleConfirmPayment(event) {

  const isAddressSelected = validateAddress();
 
  if (isAddressSelected) {
    console.log('Payment confirmed');
    updateOrderSummary();
    getCheckoutProductSummary();
    getCheckoutAddressSummary();
    getPaymentDetails();
    return true;
  } else {
    console.log('Please make sure all data is selected');
    return false;

  }
}

function validateAddress() {
  // the !! is used to convert data into boolean value
  const selectedAddressCard = document.querySelector('.addressCard.selected');
  return !!selectedAddressCard; 
}

// Attach event listeners to shipping radios
shippingRadios.forEach(shippingRadio => {
  shippingRadio.addEventListener('change', updateOrderSummary);
});


function updateOrderSummary() {
  const selectedShipping = document.querySelector('.shipping:checked');
  const shippingCharge = selectedShipping && selectedShipping.value === 'express' ? EXPRESS_SHIPPING_CHARGE : FREE_SHIPPING_CHARGE;

  const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
  const total = subtotal + shippingCharge; // Calculate total based on subtotal and shipping charge
  
  orderData.shippingCharge = shippingCharge;
  orderData.subtotal = subtotal;
  orderData.totalAmount = total;
}

function getCheckoutProductSummary(){
  checkoutProductData.forEach(hiddenElement => {
    // Retrieve data attributes
    const productId = hiddenElement.getAttribute('data-product-id');
    const productPrice = parseFloat(hiddenElement.getAttribute('data-product-price'));
    const quantity = parseInt(hiddenElement.getAttribute('data-quantity'));
 
      const newItem = {
        productId,
        productPrice,
        quantity
      }
     orderData.items.push(newItem);
  
   
  });
}

function getCheckoutAddressSummary(){
  addressCards.forEach(addressCard => {
    if (addressCard.classList.contains('selected')) {
      // Retrieve the data attributes
      const addressId = addressCard.getAttribute('data-address-id');
      const userId = addressCard.getAttribute('data-user-id');
      const name = addressCard.querySelector('p:nth-child(2)').textContent.split(': ')[1];
      const country = addressCard.querySelector('p:nth-child(3)').textContent.split(': ')[1];
      const streetAddress = addressCard.querySelector('p:nth-child(4)').textContent.split(': ')[1];
      const city = addressCard.querySelector('p:nth-child(5)').textContent.split(': ')[1];
      const state = addressCard.querySelector('p:nth-child(6)').textContent.split(': ')[1];
      const pincode = addressCard.querySelector('p:nth-child(7)').textContent.split(': ')[1];
      console.log(userId , 'this is user id ');
      orderData.userId = userId;

      orderData.shippingAddress={
        addressId:addressId,
        name:name,
        country:country,
        streetAddress:streetAddress,
        city:city,
        state:state,
        pincode:pincode,
      }
    }
  });
  
}

function getPaymentDetails(){
    const activeTabPane = document.querySelector('.tab-pane.active');
    const paymentMode = activeTabPane.id; // Get the ID of the active tab pane
    
    // console.log('Selected Payment Mode:', paymentMode);
    orderData.paymentMethod = paymentMode;

}


 function sendOrderData(){

  // console.log(orderData , 'orderData');
  fetch('/place-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({orderData})
  })
  .then((response) => {
    if (response.ok) {
      console.log('order send succees');
    }
  })
  .catch((error) => console.log(error));
}