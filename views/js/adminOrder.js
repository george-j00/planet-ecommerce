
function attachUpdateStatusEventListeners() {
  const updateStatusButtons = document.querySelectorAll(".update-status");

  updateStatusButtons.forEach(button => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      const orderId = button.getAttribute("data-order-id");
      const newStatus = button.getAttribute("data-status");


      // console.log(orderId, newStatus , 'order id and status');
      fetch(`/admin/update-status/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })
        .then(response => {
          if (response.ok) {
            // Update the UI or refresh the page as needed
            location.reload(); // Reload the page to reflect the updated status
          } else {
            console.error("Error updating status");
          }
        })
        .catch(error => {
          console.error("Fetch error:", error);
        });
    });
  });
}
attachUpdateStatusEventListeners();

async function openModal(orderId, context) {
  const modalID = `${context}ViewOrderModal${orderId}`;
  const viewOrderModal = new bootstrap.Modal(document.getElementById(modalID));
  const modalContent = document.querySelector(`#${modalID} .modal-body`);
  

  try {
    const response = await fetch(`/admin/get-order-data/${orderId}`, {
      method: 'GET',
    });
    if (!response.ok) {
      console.log('error on admin order open modal function');
    }
    const resData = await response.json();
    const orderData = resData.order;
    const productData = resData.product;

    // const modalContent = document.querySelector(`#viewOrderModal${orderId} .modal-body`);
    modalContent.innerHTML = `
      <h6>Order ID: ${orderData._id}</h6>
      <p>User ID: ${orderData.user}</p>
      <p>Products:</p>
      <ul>
        ${productData
          .map((product) => `
            <li>
              <strong>Product ID:</strong> ${product._id}<br>
              <strong>Product Name:</strong> ${product.productTitle}<br>
              <strong>Product Price:</strong> ${product.productPrice}<br>
              <strong>Product Category:</strong> ${product.category}<br>
            </li>
          `)
          .join('')}
      </ul>
      <p>Shipping Address:</p>
      <ul>
        <li>Name: ${orderData.shippingAddress.name}</li>
        <li>Country: ${orderData.shippingAddress.country}</li>
        <li>Street Address: ${orderData.shippingAddress.streetAddress}</li>
        <li>City: ${orderData.shippingAddress.city}</li>
        <li>State: ${orderData.shippingAddress.state}</li>
        <li>Pincode: ${orderData.shippingAddress.pincode}</li>
      </ul>
      <p>Payment Method: ${orderData.paymentMethod}</p>
      <p>Shipping Charge: ${orderData.shippingCharge}</p>
      <p>Subtotal: ${orderData.subtotals}</p>
      <p>Total Amount: ${orderData.totalAmount}</p>
      <p>Status: ${orderData.status}</p>
      <p>Is Coupon Applied: ${orderData.isCouponApplied}</p>
      <p>Date: ${new Date(orderData.createdOn).toLocaleString()}</p>
    `;

    viewOrderModal.show();
  } catch (error) {
    console.log(error, ' : error on order open modal function');
  }
}
