document.addEventListener('DOMContentLoaded', () => {
    const addressCards = document.querySelectorAll('.select-address-card');
    const checkoutFreeRadio = document.getElementById('checkoutFreeShipping');
    const checkoutExpressRadio = document.getElementById('checkoutExpressShipping');
    const subTotalCheckout = document.getElementById('checkoutSubTotal');
    const totalCheckout = document.getElementById('checkoutTotal');
    
    checkoutExpressRadio.addEventListener('change', updateSubtotalAndTotal);
    checkoutFreeRadio.addEventListener('change', updateSubtotalAndTotal);
  
    
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

  

  async function updateSubtotalAndTotal() {
    let totalSubTotal = 0;
  
    const subTotalElements = document.querySelectorAll('.dataSubtotal');
  
    subTotalElements.forEach((subTotalElement) => {
      const subtotalValue = parseFloat(subTotalElement.textContent.replace('Sub Total : $', ''));
      totalSubTotal += subtotalValue;
    });
  
    let total = totalSubTotal;
  
    if (checkoutExpressRadio.checked) {
      total += 15;
    }
  
    subTotalCheckout.innerText = `$${totalSubTotal.toFixed(2)}`;
    totalCheckout.innerText = `$${total.toFixed(2)}`;
  }
  
  // Call updateSubtotalAndTotal initially to set the initial values
  updateSubtotalAndTotal();

});//end of dom content load