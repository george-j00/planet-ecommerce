const Category = require("../Models/productCategories");
const Product = require("../Models/products.schema");
const User = require("../Models/users.schema");
const cloudinary = require("../services/cloudinary")
const redisClient = require('../config/redisClient');
const Order = require("../Models/orders.schema");
const OrderReturn = require("../Models/return.schema");
const Coupon = require("../Models/coupon.schema");
const Banner = require("../Models/banner.schema");


//signup get function
const dashboard = async (req,res) => {

  const itemsPerPage = 6;
  const page = parseInt(req.query.page) || 1;

  // Calculate the skip value to skip items based on the page number
  const skip = (page - 1) * itemsPerPage;

    try {
      const products = await Product.find({ status: 'active' });
      const totalProducts = await Product.countDocuments({ status: 'active' });
      


      const users = await User.find().skip(skip).limit(itemsPerPage);
      const totalUsers = await User.countDocuments();
      const totalPages = Math.ceil(totalUsers / itemsPerPage);
      
      const categories = await Category.find();

      const orders = await Order.find().skip(skip).limit(itemsPerPage);
      const totalOrders = await Order.countDocuments();
      const totalOrderPages = Math.ceil(totalOrders / itemsPerPage);

    // Total Price (Sum of totalAmount in orders)
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalAmount: { $sum: '$totalAmount' } } }
    ]);
    // Today's Orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysOrders = await Order.countDocuments({ createdOn: { $gte: today } });

  // Create an array for the entire week (Monday to Sunday)
  const weeklySalesData = await Order.aggregate([
    {
      $project: {
        dayOfWeek: { $dayOfWeek: "$createdOn" }, // Get the day of the week (1 = Sunday, 2 = Monday, ..., 7 = Saturday)
        totalAmount: "$totalAmount"
      }
    },
    {
      $group: {
        _id: "$dayOfWeek",
        totalAmount: { $sum: "$totalAmount" }
      }
    }
  ]);
  
  // Create an array to represent sales data for each day (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
  const weeklySales = Array(7).fill(0);
  
  // Iterate over the weeklySalesData and populate the weeklySales array
  weeklySalesData.forEach(data => {
    const dayOfWeek = data._id - 1; // Subtract 1 to adjust for JavaScript's 0-based index
    weeklySales[dayOfWeek] = data.totalAmount;
  });
  

    const totalQuantity = await Product.aggregate([
  {
    $group: {
      _id: null,
      totalQuantity: { $sum: '$totalQuantity' }
    }
  }
    ]);

    const returnData = await OrderReturn.find();

    const coupons = await Coupon.find();


        // console.log(weeklySalesData);
    res.render('pages/dashboard', {
      products ,
      users ,
      categories,
      orders,
      totalProducts, totalOrders, totalSales: totalSales[0].totalAmount,totalQuantity: totalQuantity[0].totalQuantity, todaysOrders,weeklySales ,
      returnData,
      coupons,
      currentPage: page,
      totalPages,
      totalOrderPages,
    });
     
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
      productImages: uploadedImages ,
      status : "active"
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
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { status: 'deleted' },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send('Product not found');
    }

    res.send('Product has been marked as deleted');

  } catch (error) {
    console.log('Error while marking product as deleted:', error);
    res.status(500).send('Error while marking product as deleted');
  } 
};

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
    const query = req.body.categoryName;

    // Use a case-insensitive regex to perform the query
    const uniqueness = await Category.findOne({ name: { $regex: new RegExp(`^${query}$`, 'i') } });

    if (uniqueness) {
      const message = 'Category exists';
      console.log(message);
      return res.json(message); // Return the error message as JSON
    } else {
      let category = new Category({
        name: req.body.categoryName,
      });

      // Save the category
      await category.save();
      console.log('Successfully added category data');
      const success = 'success';
      return res.json(success);
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteCategory = async (req, res) => {
  const { categoryName, categoryId } = req.body;

  try {
    // Update all products with the given category name to set their status to "deleted"
    const productData = await Product.updateMany({
      category: { $in: [categoryName] },
    }, {
      status: 'deleted',
    });
    // const products = await Product.find({ category: categoryName });
    // // Delete the category by its ID
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    console.log('success' , productData);
    if (!deletedCategory) {
      return res.status(404).send('Category not found'); // Return an error if the category is not found
    }
    res.send('successsssss');
  } catch (error) {
    console.log('Error while deleting category and updating products:', error);
    res.status(500).send('Error while deleting category and updating products');
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

const updateReturnStatus = async (req, res) => {
  try {
    const {returnId, status} = req.body;

    const updatedReturn = await OrderReturn.findByIdAndUpdate(
      returnId,
      { $set: { status: status } },
      { new: true }
    );

    if (!updatedReturn) {
      return res.status(404).json({ message: 'Return not found' });
    }

    // if (status === 'Approved') {
    //   for (const product of updatedReturn.products) {
    //     const returnedQuantity = product.productReason === 'baad' ? 1 : 0; // Check if it's a whole order or partial
    //     const existingProduct = await Product.findById(product.productId);
    //     if (existingProduct) {
    //       existingProduct.totalQuantity += returnedQuantity; // Increment the product quantity
    //       await existingProduct.save(); // Save the changes to the product
    //     }
    //   }
    // }
    console.log('updated quantity');
    // console.log(updatedReturn ,'update return productss');
    res.status(200).json({ message: `Return status updated ` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating return status' });
  }
};

const couponManagement = async (req, res) => {
  try {
    const { couponCode, discountAmount, minPurchase, expiryDate } = req.body;

    // Create a new coupon instance using the Mongoose schema
    const newCoupon = new Coupon({
      couponCode,
      discountAmount,
      minPurchase,
      expiryDate: new Date(expiryDate),
    });

    // Save the coupon to the database
    const savedCoupon = await newCoupon.save();

    res.status(201).json(savedCoupon); // Return the saved coupon as JSON
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ message: 'Error creating coupon' });
  }

}

const bannerManagement = async (req, res) => {
  const files = req.files; // Access the uploaded files
  const { bannerTitle, bannerFeaturedTitle } = req.body;

  try {
    // Upload images to Cloudinary and collect their secure URLs and IDs
    const uploadedImages = await Promise.all(files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path);
      return {
        secure_url: result.secure_url,
        cloudinary_id: result.public_id
      };
    }));

    // Delete the existing banners (if any)
    await Banner.deleteMany();

    const newBanner = new Banner({
      bannerTitle,
      bannerFeaturedTitle,
      bannerImages: uploadedImages,
    });

    await newBanner.save();
    console.log('Added successfully');
    // res.status(201).json(newBanner); // Return the saved banner as JSON
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ message: 'Error creating banner' });
  }
};



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
    adminOrderStaus,
    updateReturnStatus,
    couponManagement,
    bannerManagement,
};