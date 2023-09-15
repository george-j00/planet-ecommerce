document.addEventListener('DOMContentLoaded', () => {

  let couponDiscount = 0;
  let minPurchase = 0;
  let maxPurchase = 0;
  let isCouponApplied = false;
  // let targetPaymentMode = 0
    const addressCards = document.querySelectorAll('.select-address-card');
    const checkoutFreeRadio = document.getElementById('checkoutFreeShipping');
    const checkoutExpressRadio = document.getElementById('checkoutExpressShipping');
    const subTotalCheckout = document.getElementById('checkoutSubTotal');
    const totalCheckout = document.getElementById('checkoutTotal');
    const couponApplyBtn = document.getElementById('couponApplyBtn');
    const discountCoupon = document.getElementById('discountCouponId');//discountCoupon is the field in the main checkout shows discount 
    const couponError = document.getElementById('couponError');
    const minCouponError = document.getElementById('minCouponError');

    checkoutExpressRadio.addEventListener('change', updateSubtotalAndTotal);
    checkoutFreeRadio.addEventListener('change', updateSubtotalAndTotal);
    
  couponApplyBtn.addEventListener('click', () => {
    const couponCode = document.getElementById('couponCode').value;
    const totalValue = totalCheckout.innerText.replace('₹','');
    
    // Clear previous error messages
    couponError.style.display = 'none';
    couponError.innerText = '';
    minCouponError.style.display = 'none';
  
    if (couponError.style.display === 'none' && minCouponError.style.display === 'none' && couponCode ) {

      // console.log(totalValue , 'total value value');
      fetch('/apply-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ couponCode ,totalValue })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('Coupon applied:', data.coupon);
            couponDiscount = data.coupon.discountAmount;
            minPurchase = data.coupon.minPurchase;
            maxPurchase = data.coupon.maxPurchase;
            isCouponApplied = true;
            couponApplyBtn.style.display = 'none';
            updateSubtotalAndTotal();
          } else {
            console.log('Coupon validation failed:', data.message);
            // Display an error message to the user
            couponError.style.display = 'block';
            couponError.innerText = data.message;
          }
        })
        .catch(error => {
          console.error('Error applying coupon:', error);
        });
    } else {
      couponError.style.display = 'block';
      couponError.innerText = 'Please enter a coupon code.';
    }
  });
  
    addressCards.forEach(addressCard => {
      addressCard.addEventListener('click', () => {
        // Toggle the 'selected' class on click
        addressCard.classList.toggle('selected');
        
        // Remove 'selected' class from other address cards
        addressCards.forEach(card => {
          if (card !== addressCard) {
            card.classList.remove('selected');
          }
        });
      });
    });

  const tabLinks = document.querySelectorAll('.nav-link');

  tabLinks.forEach(link => {
      link.addEventListener('click', (event) => {
          const targetId = event.target.getAttribute('href');
          const targetPaymentMode = event.target.getAttribute('href').replace('#','');
          const tabContent = document.querySelector(targetId);

          // Update the wallet radio based on the selected payment method
         updateWalletRadio(targetPaymentMode);

          // Call the function to update the order summary
        updateSubtotalAndTotal();
          // Hide all tab contents
          document.querySelectorAll('.tab-pane').forEach(content => {
              content.classList.remove('show', 'active');
          });
          
          // Show the selected tab content
          tabContent.classList.add('show', 'active');

          // Remove focus from all tab links
          tabLinks.forEach(tabLink => {
              tabLink.classList.remove('active');
          });

          // Set focus on the clicked tab link
          event.target.classList.add('active');
      });
  });

// Define a function to check if any cart item has offers
function cartItemsHaveOffers() {
  const cartItems = document.querySelectorAll('.dataDiscount'); // Assuming this class exists on elements associated with cart items

  for (const cartItem of cartItems) {
    const discountValue = parseFloat(cartItem.textContent.replace('Discount: ₹', ''));
    if (discountValue > 0) {
      return true; // At least one item has a discount
    }
  }

  return false; // No items have a discount
}

async function updateSubtotalAndTotal() {
  let totalSubTotal = 0;
  let totalDiscount = 0;
  let total = 0;

  const walletBalance = parseFloat(document.getElementById('walletBalance').textContent.replace('₹', ''));
  const useWalletRadio = document.querySelector('input[name="useWallet"]:checked');
  const selectedShipping = document.querySelector('.shipping:checked');
  
  const subTotalElements = document.querySelectorAll('.dataSubtotal');
  const discountElements = document.querySelectorAll('.dataDiscount');
  const couponSection = document.getElementById('couponSection');

  subTotalElements.forEach((subTotalElement, index) => {
    const subtotalValue = parseFloat(subTotalElement.textContent.replace('Total: ₹', ''));
    totalSubTotal += subtotalValue;

    if (discountElements[index]) {
      const discountValue = parseFloat(discountElements[index].textContent.replace('Discount: ₹', ''));
      totalDiscount += discountValue;
    }
  });

  if (useWalletRadio && useWalletRadio.value === 'yes') {
    total = totalSubTotal - walletBalance;
    if (total <= 0) {
      // Notify the user about insufficient balance but keep total above zero
      total = 1; // Set total to a minimum value (e.g., 1)
      couponError.style.display = 'block';
      couponError.innerText = 'Min purchase amount required';
      discountCoupon.innerText = '₹0.00';
      minCouponError.style.display = 'none';
    } else {
      couponError.style.display = 'none';
      discountCoupon.innerText = `₹${couponDiscount.toFixed(2)}`;
      minCouponError.style.display = 'none';
    }
  } else {
    total = totalSubTotal-totalDiscount;
    couponError.style.display = 'none';
    discountCoupon.innerText = `₹${totalDiscount.toFixed(2)}`;
    minCouponError.style.display = 'none';
  }

  if (isCouponApplied) {
    if (total > minPurchase && total < maxPurchase) {
      total -= couponDiscount;
      if (total < 0) {
        // Notify the user about the discount but keep total above zero
        total = 1; // Set total to a minimum value (e.g., 1)
        couponError.style.display = 'block';
        couponError.innerText = 'Total is too low to apply the discount.';
        discountCoupon.innerText = '₹0.00';
        minCouponError.style.display = 'none';
      } else {
        couponError.style.display = 'none';
        discountCoupon.innerText = `₹${couponDiscount.toFixed(2)}`;
        minCouponError.style.display = 'none';
      }
    } else {
      minCouponError.style.display = 'block';
      couponError.style.display = 'none';
    }
  }

  if (selectedShipping && selectedShipping.value === 'express') {
    total += EXPRESS_SHIPPING_CHARGE; 
  }

  subTotalCheckout.innerText = `₹${totalSubTotal.toFixed(2)}`;
  totalCheckout.innerText = `₹${total.toFixed(2)}`;

  if (cartItemsHaveOffers()) {
    couponSection.style.display = 'none';
  } else {
    couponSection.style.display = 'block';
  }
}

function updateWalletRadio(paymentMode) {
  const walletRadio = document.querySelector('input[name="useWallet"][value="yes"]');

  if (paymentMode === 'COD') {
    // If payment mode is COD, set the wallet radio to 'No' and disable it
    walletRadio.checked = false;
    walletRadio.disabled = true;
  } else {
    // If payment mode is not COD, enable the wallet radio
    walletRadio.disabled = false;
  }
}
// Initialize wallet radio based on default payment mode (you can set this as needed)
updateWalletRadio('Online');

// Add event listener for the wallet radio button
const useWalletRadios = document.querySelectorAll('input[name="useWallet"]');
useWalletRadios.forEach(useWalletRadio => {
  useWalletRadio.addEventListener('change', updateSubtotalAndTotal);
});

// Add event listener for shipping radio buttons
const shippingRadios = document.querySelectorAll('.shipping');
shippingRadios.forEach(shippingRadio => {
  shippingRadio.addEventListener('change', updateSubtotalAndTotal);
});

// Update the total initially
updateSubtotalAndTotal();

 
});//end of dom content load