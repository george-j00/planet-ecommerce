const approveButtons = document.querySelectorAll('.approveBtn');
const rejectButtons = document.querySelectorAll('.rejectBtn');

approveButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const returnId = button.getAttribute('data-return-id');
    const response = await fetch(`/admin/update-return-status`, {
      method: 'POST',
      body: JSON.stringify({ status: 'Approved' ,returnId: returnId}),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      console.log('Success: Return status updated to Approved');
      window.location.reload();
    } else {
      console.log('Error: Failed to update return status');
    }
  });
});

rejectButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const returnId = button.getAttribute('data-return-id');
    const response = await fetch(`/admin/update-return-status`, {
      method: 'POST',
      body: JSON.stringify({ status: 'Rejected', returnId: returnId}),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      console.log('Success: Return status updated to Rejected');
      window.location.reload();
    } else {
      console.log('Error: Failed to update return status');
    }
  });
});
