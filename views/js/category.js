
//category management
const categoryForm = document.getElementById('categoryForm');

categoryForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the default form submission

  try {
    const categoryName = document.getElementById('categoryName').value;

    const response = await fetch('/admin/add-category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ categoryName })    
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const data = await response.json();
    document.getElementById('categoryError').innerHTML = data ; 
    if (data == 'success') {
        const modal =   document.getElementById('addUserModal') ;
       const categoryName = document.getElementById('catId');
         categoryName.style.display = 'none';
        const succesId =  document.getElementById('succesId');
        succesId.style.display = block ;

    }
    // window.location.reload();

    // This will print the error message if category exists
  } catch (error) {
    console.error('Error:', error);
    // Handle errors here
  }
});



function deleteCategory(categoryName, categoryId) {
      
    fetch(`/admin/delete-category`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ categoryName , categoryId })  
    })
    .then(res => {
      console.log('Deleted product');
      if (res.ok) {
        window.location.href = '/admin/dashboard';
      }else{
        console.log('failed to delete category');
      }
    })
    .catch(error => console.log(error));
}