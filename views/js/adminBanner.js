
    const bannerForm = document.getElementById('bannerForm');
    const editBannerForm = document.getElementById('editBannerForm');
    const newBannerImagesInput = document.getElementById('newBannerImages');


    bannerForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent the default form submission
  
      const formData = new FormData(this); // Serialize the form data
      fetch('/admin/banner', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response data here, e.g., display a success message
          const bannerSuccessModal = new bootstrap.Modal(document.getElementById('successBannerModal'));
          bannerSuccessModal.show();
          setTimeout(() => {
            bannerSuccessModal.hide();
          }, 1000);
          window.location.reload();
          console.log('added banner');
        })
        .catch((error) => {
          // Handle any errors, e.g., display an error message
          console.error('Error:', error);
        });
    });

    const maxFileCount = 3;

    editBannerForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent the default form submission
      
      if (newBannerImagesInput.files.length > maxFileCount) {
        alert(`You can select only up to ${maxFileCount} files.`);
        return; // Prevent form submission if the limit is exceeded
      }

      
      const formData = new FormData(this); // Serialize the form data

  // Convert formData to a plain JavaScript object
  // const formDataObject = {};
  // formData.forEach((value, key) => {
  //   formDataObject[key] = value;
  // });

  // console.log(formDataObject , 'we can only see the form data as this formdataObject');
      fetch('/admin/edit-banner', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response data here, e.g., display a success message
          const bannerSuccessModal = new bootstrap.Modal(document.getElementById('editBannerSuccess'));
          bannerSuccessModal.show();
          setTimeout(() => {
            bannerSuccessModal.hide();
          }, 1000);
          window.location.reload();
          console.log('edited banner');
        })
        .catch((error) => {
          // Handle any errors, e.g., display an error message
          console.error('Error:', error);
        });
    });