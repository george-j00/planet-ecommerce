const addToCartBtns  = document.querySelectorAll('.newArrivalsAddToCartBtn');
const successModal = new bootstrap.Modal(document.getElementById('addedSuccess'));


addToCartBtns.forEach(item => {
  item.addEventListener('click', () => {
    const productId = item.getAttribute('data-product-id');
    addToCartFunction(productId);
    console.log('clickedd add to cart button');
})
})


//this function is called inside the products partial , onclick
function addToCart(productId){
    addToCartFunction(productId);
}

function addToCartFunction(productId){
    let quantity = 1;
    fetch('/add-to-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    })
    .then(response => response.json())
    .then(data => {
        successModal.show();
        setTimeout(() => {
          successModal.hide();
        }, 1000);
      })
      console.log('added to cart');

}



