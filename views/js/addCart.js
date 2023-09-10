document.addEventListener('DOMContentLoaded', () => {
    const incrementButton = document.getElementById('incrementButton');
    const decrementButton = document.getElementById('decrementButton');
    const quantityInput = document.getElementById('quantityInput');
    let currentQuantity = parseInt(quantityInput.value);
    const addToCartProductPageBtn = document.getElementById('addToCartProductPageBtn');
    const addedToCartDiv = document.getElementById('addedToCartDiv');
    const successModal = new bootstrap.Modal(document.getElementById('addedSuccess'));

    incrementButton.addEventListener('click', () => {
        currentQuantity++;
        quantityInput.value = currentQuantity;
    });

    decrementButton.addEventListener('click', () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            quantityInput.value = currentQuantity;
        }
    });

    addToCartProductPageBtn.addEventListener('click', () => {
        const productId = quantityInput.getAttribute('product-data-id');
        const quantity = parseInt(quantityInput.value);
        addToCartFunction(productId, quantity);
    });

    function addToCartFunction(productId, quantity) {

        console.log('called the function');
        // fetch('/add-to-cart', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ productId, quantity }),
        // })
        // .then(response => response.json())
        // .then(data => {
        //     successModal.show();
        //     setTimeout(() => {
        //         successModal.hide();
        //     }, 1000);
        //     addedToCartDiv.classList.remove('hidden');
        //     console.log('added to cart');
        // })
        // .catch(error => {
        //     console.error('Error adding to cart:', error);
        // });
    }
});
