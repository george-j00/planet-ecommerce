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
});