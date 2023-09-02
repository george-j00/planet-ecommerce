const saveCouponBtn = document.getElementById('saveCouponBtn');

// create coupon
saveCouponBtn.addEventListener('click', () => {
    const couponCode = document.getElementById('couponCode').value;
    const discountAmount = document.getElementById('discountAmount').value;
    const minPurchase = document.getElementById('minPurchase').value;
    const expiryDate = document.getElementById('expiryDate').value;

    const couponData = {
        couponCode,
        discountAmount,
        minPurchase,
        expiryDate
    };

    fetch('/admin/create-coupon', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(couponData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Coupon created:', data);
        window.location.reload();
    })
    .catch(error => {
        console.error('Error creating coupon:', error);
    });
});




