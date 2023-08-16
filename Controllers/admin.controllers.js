const Category = require("../Models/productCategories");
const Product = require("../Models/products.schema");
const User = require("../Models/users.schema");
const cloudinary = require("../services/cloudinary")


//signup get function
const dashboard = async (req,res) => {
    try {
      const products = await Product.find();
      const users = await User.find();
      const categories = await Category.find();
  
      if (!products || products.length === 0 || !users || users.length === 0) {
        return res.status(404).send({ message: "No products!" });
      }
      // console.log(products);
    res.render('pages/dashboard', {products , users ,categories});
     
    } catch (err) {
      console.log(err);
    }
}
const addproductGet = (req,res) => {
 res.redirect('/admin/dashboard');  
}

const addProduct =  async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
     // Create new user
    let product = new Product({
      productTitle: req.body.productTitle,
      productDescription :req.body.productDescription,
      productPrice:req.body.productPrice,
      totalQuantity:req.body.totalQuantity,
      category:req.body.category,
      additionalInformation: req.body.additionalInformation,
      productImage: result.secure_url,
      cloudinary_id: result.public_id,
    });
    // Save user
    await product.save();

    console.log('this is result' , result);
    // res.json(product);
    console.log('successsfully added product data');
    res.redirect('/admin/add-product');
  } catch (err) {
    console.log(err);
  }}; 

const editProduct = async (req,res) => {
    const productId = req.params.productId;
    try {
      const product = await Product.findById(productId);

      // console.log(product , 'this is product');
      res.json(product); // Respond with JSON containing the product data
    } catch (err) {
      console.error(err , '****** this is error ********');
      res.status(500).json({ error: 'Error fetching product data.' });
    }  
   }

const editProductPost =  async (req,res) => {

  const { currentImage } = req.body ; 

let result ; 
  // console.log(currentImage , 'this is current image');
if (req.file && req.file.path !== undefined) {

   result = await cloudinary.uploader.upload(req.file.path);
  
    if (currentImage) {
      await cloudinary.uploader.destroy(currentImage);
    }
}
  
    const {
      productTitle,
      productPrice,
      productDescription,
      productCategory,
      additionalInformation,
      totalQuantity,
      currentProduct
    } = req.body
    
    try {
      const updateFields = {
        productTitle: productTitle,
        productPrice: productPrice,
        productDescription: productDescription,
        productCategory: productCategory,
        additionalInformation: additionalInformation,
        totalQuantity: totalQuantity
      };
  
      if (result) {
        updateFields.productImage = result.secure_url;
        updateFields.cloudinary_id = result.public_id;
      }
  
      await Product.updateOne({ _id: currentProduct }, updateFields);
      console.log('Data updated successfully.');
      res.redirect('/admin/dashboard')
    } catch (error) {
      console.log('Error while updating:', error);
    }
  };

const deleteProduct = async (req, res) => { 
  const productId = req.params.productId;
  
  try {
    const deletedUser = await Product.findByIdAndDelete(productId);

    if (!deletedUser) {
      return res.status(404).send('User not found'); // Return an error if the user is not found
    }
    res.send('successsssss');

  } catch (error) {
    console.log('Error while deleting user:', error);
    res.status(500).send('Error while deleting user');
  } 
}

const blockAndUnblockUser = async (req, res) => {
  const userId = req.params.userId;

  console.log(userId, 'block user');

  try {
    const user = await User.findById(userId);
    let blockStatus = user.status;

    console.log(!blockStatus , 'block statusss');

    await User.findByIdAndUpdate(
      { _id: userId },
      { status: !blockStatus}
    );
    
    res.json({blockStatus : !blockStatus});
    // console.log('Blocked/unblocked successfully');
  } catch (error) {
    console.log(error, 'error while updating user');
  }
};

const addCategory = async (req, res) => {
  try {
     // Create new user
    let category = new Category({
      name: req.body.categoryName,
    });
    // Save user
    await category.save();
    console.log('successsfully added category data');
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.log(err);
}
}

const deleteCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  
  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).send('Cannot delete'); // Return an error if the user is not found
    }
    res.send('successsssss');

  } catch (error) {
    console.log('Error while deleting user:', error);
    res.status(500).send('Error while deleting user');
  }
}


 
module.exports = {
    dashboard ,
    addproductGet,
    addProduct,
    editProduct,
    editProductPost,
    deleteProduct,
    blockAndUnblockUser,
    addCategory,
    deleteCategory
};