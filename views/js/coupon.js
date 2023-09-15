const saveCouponBtn = document.getElementById('saveCouponBtn');

// create coupon
saveCouponBtn.addEventListener('click', () => {
    const couponCode = document.getElementById('couponCode').value;
    const discountAmount = document.getElementById('discountAmount').value;
    const minPurchase = document.getElementById('minPurchase').value;
    const usageLimit = document.getElementById('usageLimit').value;
    const maxPurchase = document.getElementById('maxPurchase').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const formModal = new bootstrap.Modal(document.getElementById('exampleModalCenter'));


    const couponData = {
        couponCode,
        discountAmount,
        minPurchase,
        maxPurchase,
        usageLimit,
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
        const couponSaveSuccessModal = new bootstrap.Modal(document.getElementById('couponSaveSuccess'));
        formModal.hide();
        couponSaveSuccessModal.show();
        setTimeout(() => {
            couponSaveSuccessModal.hide();
        }, 1000);
        console.log('Coupon created:', data);
        window.location.reload();
    })
    .catch(error => {
        console.error('Error creating coupon:', error);
    });
});




