document.addEventListener('DOMContentLoaded', () => {

  let couponDiscount = 0;
  let minPurchase = 0;
  let isCouponApplied = false;

    const addressCards = document.querySelectorAll('.select-address-card');
    const checkoutFreeRadio = document.getElementById('checkoutFreeShipping');
    const checkoutExpressRadio = document.getElementById('checkoutExpressShipping');
    const subTotalCheckout = document.getElementById('checkoutSubTotal');
    const totalCheckout = document.getElementById('checkoutTotal');
    const couponApplyBtn = document.getElementById('couponApplyBtn');
    const discountCoupon = document.getElementById('discountCouponId');//discountCoupon is the field in the main checkout shows discount 

    checkoutExpressRadio.addEventListener('change', updateSubtotalAndTotal);
    checkoutFreeRadio.addEventListener('change', updateSubtotalAndTotal);


  couponApplyBtn.addEventListener('click', () => {

    const couponCode = document.getElementById('couponCode').value;
    fetch('/apply-coupon', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ couponCode })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        
        console.log('Coupon applied:', data.coupon);
        couponDiscount = data.coupon.discountAmount;
        minPurchase = data.coupon.minPurchase;
        isCouponApplied = true;
        updateSubtotalAndTotal();
      } else {
        console.log('Coupon validation failed:', data.message);
        // Display an error message to the user
      }
    })
    .catch(error => {
      console.error('Error applying coupon:', error);
    });
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
          const tabContent = document.querySelector(targetId);
          
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
    const discountValue = parseFloat(cartItem.textContent.replace('Discount: $', ''));
    if (discountValue > 0) {
      return true; // At least one item has a discount
    }
  }

  return false; // No items have a discount
}

// Update your updateSubtotalAndTotal function
async function updateSubtotalAndTotal() {
  let totalSubTotal = 0;
  let totalDiscount = 0; // Initialize total discount

  const subTotalElements = document.querySelectorAll('.dataSubtotal');
  const discountElements = document.querySelectorAll('.dataDiscount');
  const couponSection = document.getElementById('couponSection'); // Add an ID to the coupon section
  const totalDiscountSection = document.getElementById('totalDiscountSection'); // Add an ID to the total discount section

  subTotalElements.forEach((subTotalElement, index) => {
    const subtotalValue = parseFloat(subTotalElement.textContent.replace('Total: $', ''));
    totalSubTotal += subtotalValue;

    // Check if there's a corresponding discount element for this item
    if (discountElements[index]) {
      const discountValue = parseFloat(discountElements[index].textContent.replace('Discount: $', ''));
      totalDiscount += discountValue; // Accumulate discounts
    }
  });

  let total = totalSubTotal;

  if (isCouponApplied) {
    if (total >= minPurchase) {
      total -= couponDiscount; // Reduce the coupon discount from the total
      discountCoupon.innerText = `$${couponDiscount.toFixed(2)}`;
    } else {
      console.log('Do min purchase');
    }
  }else{
    total -= totalDiscount
    discountCoupon.innerText = `$${totalDiscount.toFixed(2)}`; 
  }

  if (checkoutExpressRadio.checked) {
    total += 15;
  }

  // Display total discount

  subTotalCheckout.innerText = `$${totalSubTotal.toFixed(2)}`;
  // discountCoupon.innerText = `$${totalDiscount.toFixed(2)}`;
  totalCheckout.innerText = `$${total.toFixed(2)}`;

  // Check if any cart items have offers and hide/show sections accordingly
  if (cartItemsHaveOffers()) {
    couponSection.style.display = 'none'; // Hide the coupon section
    totalDiscountSection.style.display = 'none'; // Hide the total discount section
  } else {
    couponSection.style.display = 'block'; // Show the coupon section
    totalDiscountSection.style.display = 'block'; // Show the total discount section
  }
}

  
  
  updateSubtotalAndTotal();
 


});//end of dom content load