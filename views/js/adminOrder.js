
    const updateStatusButtons = document.querySelectorAll(".update-status");

    updateStatusButtons.forEach(button => {
      button.addEventListener("click", function(e) {
        e.preventDefault();

        const orderId = button.getAttribute("data-order-id");
        const newStatus = button.getAttribute("data-status");

        
        fetch(`/admin/update-status/${orderId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: newStatus })
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

