const Category = require("../Models/productCategories");
const Product = require("../Models/products.schema");
const User = require("../Models/users.schema");
const cloudinary = require("../services/cloudinary")
const redisClient = require('../config/redisClient');
const Order = require("../Models/orders.schema");


//signup get function
const dashboard = async (req,res) => {
    try {
      const products = await Product.find();
      const users = await User.find();
      const categories = await Category.find();
      const orders = await Order.find();
      const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    // Total Price (Sum of totalAmount in orders)
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalAmount: { $sum: '$totalAmount' } } }
    ]);
    // Today's Orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysOrders = await Order.countDocuments({ createdOn: { $gte: today } });

    // Perform aggregation to group orders by hour and calculate total amount
const hourlySalesData = await Order.aggregate([
  {
    $project: {
      hour: { $hour: "$createdOn" },
      totalAmount: "$totalAmount"
    }
  },
  {
    $group: {
      _id: "$hour",
      totalAmount: { $sum: "$totalAmount" }
    }
  },
  {
    $sort: { _id: 1 }
  }
]);

const totalQuantity = await Product.aggregate([
  {
    $group: {
      _id: null,
      totalQuantity: { $sum: '$totalQuantity' }
    }
  }
]);

        // console.log(hourlySalesData);
    res.render('pages/dashboard', {products , users ,categories,orders, totalProducts, totalOrders, totalSales: totalSales[0].totalAmount,totalQuantity: totalQuantity[0].totalQuantity, todaysOrders,hourlySalesData});
     
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
    const files = req.files; // Access the uploaded files

    // Upload images to Cloudinary and collect their secure URLs and IDs
    const uploadedImages = await Promise.all(files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path);
      return {
        secure_url: result.secure_url,
        cloudinary_id: result.public_id
      };
    }));


    console.log(uploadedImages);

    // const result = await cloudinary.uploader.upload(req.file.path);
     // Create new user
    let product = new Product({
      productTitle: req.body.productTitle,
      productDescription :req.body.productDescription,
      productPrice:req.body.productPrice,
      totalQuantity:req.body.totalQuantity,
      category:req.body.category,
      additionalInformation: req.body.additionalInformation,
      // productImage: result.secure_url,
      productImages: uploadedImages 
      // cloudinary_id: result.public_id,
    });
    console.table(product);
    // Save user
    await product.save();

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


const editProductPost = async (req, res) => {
  const { currentImage1 } = req.body;

  let result;
  if (req.file && req.file.path !== undefined) {
    result = await cloudinary.uploader.upload(req.file.path);

    if (currentImage1) {
      await cloudinary.uploader.destroy(currentImage1);
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
  } = req.body;

  try {
    const updateFields = {
      productTitle: productTitle,
      productPrice: productPrice,
      productDescription: productDescription,
      productCategory: productCategory,
      additionalInformation: additionalInformation,
      totalQuantity: totalQuantity,
    };

    // Fetch the existing product document
    const existingProduct = await Product.findOne({ _id: currentProduct });

    if (result && existingProduct.productImages.length > 0) {
      // Update the secure_url of the first item in the productImages array
      existingProduct.productImages[0].secure_url = result.secure_url;
      
      // Update the entire productImages array in the updateFields object
      updateFields.productImages = existingProduct.productImages;
    }

    // Update the document in the database
    await Product.updateOne({ _id: currentProduct }, updateFields);
    console.log('Data updated successfully.');
    res.redirect('/admin/dashboard');
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

const data = req.body.categoryName;


  try {
    const query = req.body.categoryName;

    
    const uniqueness = await Category.findOne({name:query});

    // const value = uniqueness.name ;
    // console.log(uniqueness.name );

    if ( uniqueness ) {

      const message = 'Category exists';

      console.log(message);
      return res.json(message); // Return the error message as JSON
    }
    else{
      
      let category = new Category({
        name: req.body.categoryName,
      });
  
      // Save user
      await category.save();
      console.log('successsfully added category data');
    //  return res.status(200).json({success: 'success'});
    const success = 'success';
    return res.json(success)  
         // res.redirect('/admin/dashboard');
  
    }
    
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

// const logout = async (req, res) => {
//   const token = req.cookies.adminJwt;

//   if (!token) {
//     return res.render('pages/adminLogin');
//   }

//   redisClient.set(token, 'revoked');
//   return res.redirect('/admin/admin-login');
// };

const adminOrderStaus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const newStatus = req.body.status;

    // Find the order by ID and update the status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status: newStatus } },
      { new: true } // Return the updated order
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', order: updatedOrder });
    console.log('status updated');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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
    deleteCategory,
    adminOrderStaus
    // logout
};