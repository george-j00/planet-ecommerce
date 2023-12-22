const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const User = require('../Models/users.schema');
const Product = require('../Models/products.schema');
const jwt = require('jsonwebtoken')
const Cart = require('../Models/cart.schema');
const Order = require('../Models/orders.schema');
const razorpay = require('razorpay');
const crypto = require('crypto');


const instance = new razorpay({
  key_id:process.env.RAZORPAY_ID,
  key_secret:process.env.RAZORPAY_SECRET_KEY,
});

const bcrypt = require("bcryptjs");
const OrderReturn = require('../Models/return.schema');
const Wallet = require('../Models/wallet.schema');
const Coupon = require('../Models/coupon.schema');
const Category = require('../Models/productCategories');
const Banner = require('../Models/banner.schema');
const saltRounds = 10

const signup = (req,res) => {
    res.render('pages/signup');
}

const signUpPost = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email already exists in the database
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      const error = 'Email already exists';
      res.render('pages/signup', { error });
    } else {
      bcrypt
      .hash(password, saltRounds)
      .then(hashedPassword => {
       const userData = {name , email, hashedPassword };
       console.log("signup data",userData);
       req.session.userData = userData;
       res.redirect('/email-verification');
      })
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error while creating user');
  }
};

const emailVerification = (req,res) => {
    res.render('pages/emailVerification');
 }
//  function for email verification 
 const otpGenerationAndEmailVerification = (req) => {
  const { verifyEmail } = req.body;
  const OTP = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
  console.log('this is otp',OTP);
  const otp = +OTP;

  req.session.otp = otp;
  // Create the transporter object
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gj816373@gmail.com',
        pass: 'oykvaqiekefunsfp',
      },
    });
  
    const mailOptions = {
      from: 'gj816373@gmail.com',
      // to: 'gj816373@gmail.com', // Replace with the user's email address
      to: verifyEmail, 
      subject: 'OTP Verification',
      text: `Your OTP for verification is: ${otp}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent successfully:', info.response);
      }
    });
 }
//email verification 
const emailVerificationPost = async (req, res) => {
    otpGenerationAndEmailVerification(req);
      res.redirect('/otp-verification');
};
 //showing otp verification page
const otpVerification = (req,res) => {
    res.render('pages/otpVerification');
}
 //otp verification post method
const otpVerificationPost = async (req,res) => {
  const { otp1, otp2, otp3, otp4 } = req.body;
  const userOtp = parseInt(otp1 + otp2 + otp3 + otp4);
  const userData = req.session.userData;
  const otpValue = req.session.otp;
  // check status for block and unblock. inititlally will be false
  const status = false; 
  const { name, email, hashedPassword } = userData;

    if (otpValue === userOtp) {
      try {
        const user = new User({
          name,
          email,
          hashedPassword,
          status
        });
        await user.save(); 
        console.log('Successfully added user');
        res.redirect('/login');
      } catch (error) {
        console.log(error, "Error on adding user");
      }
    } else {
      console.log('Incorrect OTP');
      res.render('pages/otpVerification', { error });
    }
};

const forgotPassword = (req, res) => {
  res.render('pages/emailVerificationFp');
}

const emailVerifyFp = async (req, res) => {
    const { verifyEmail } = req.body;
    req.session.verifyEmail = verifyEmail;

    otpGenerationAndEmailVerification(req);
    res.render('pages/otpVerificationFp');
};

const otpVerifyFp = async (req,res) => {
  const { otp1, otp2, otp3, otp4 } = req.body;
  const otpValue = req.session.otp;
  const userOtp = parseInt(otp1 + otp2 + otp3 + otp4);
  console.log(userOtp , "this is user otp");
  if (otpValue === userOtp) {
  res.render('pages/passwordReset');
  } else {
    console.log('Incorrect OTP');
    const error = 'Invalid OTP'
    res.render('pages/otpVerificationFp' , {error});
  }
};

const passwordReset = async (req, res) => {
  const { password } = req.body;
  const verifyEmail = req.session.verifyEmail;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    if (hashedPassword && verifyEmail) {
      try {
        // Update the user's password using the email
        await User.findOneAndUpdate(
          { email: verifyEmail }, // Filter condition
          { hashedPassword: hashedPassword  } // Update
        );
        res.redirect('/login');
      } catch (error) {
        console.error('Error resetting password:', error);
        res.send('fail');
      }
    } else {
      console.log('Cant reset password');
      res.send('fail');
    }
  } catch (error) {
    console.error('Error hashing password:', error);
    res.send('fail');
  }
};

const homepage = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decodedTokens = jwt.decode(token);
    let userId
    if (decodedTokens) {
       userId = decodedTokens.id;
    }
    const products = await Product.find({ status: 'active' });
    const cart = await Cart.find({ user: userId });
    const banners = await Banner.find();
    const bannerTitle = banners[0].bannerTitle;
    const featuredTitle = banners[0].bannerFeaturedTitle;

    let cartLength = 0;
    if (cart.length > 0 && cart[0].cartItems) {
      cartLength = cart[0].cartItems.length;
    }
    res.render('pages/home', { products, cartLength,banners ,bannerTitle, featuredTitle ,userId });
  } catch (err) {
    console.log(err);
  }
};

const viewProduct = async (req, res) => {
  const token = req.cookies.jwt;
  const decodedTokens = jwt.decode(token);
  let userId ;
  if (decodedTokens) {
     userId = decodedTokens.id;
  }
  const cart = await Cart.find({ user: userId });

  let cartLength = 0;
  if (cart.length > 0 && cart[0].cartItems) {
    cartLength = cart[0].cartItems.length;
  }
  let product = null;
  const productId = req.params.productId;
  try {
     product = await Product.findById(productId);

     if (!product) {
      return res.status(404).render('pages/404');
    }
    res.render('pages/product', { product, cartLength });
  } catch (err) {
    if (!product) {
      // Product not found, render a 404 page
      return res.status(404).render('pages/404');
    }
    // Handle other errors here, or you can log them and send a generic error response.
    res.status(500).json({ error: 'Error fetching product data.' });
  }
};

const userProfile = async (req, res) => {
  const token = req.cookies.jwt;
  const decodedTokens = jwt.decode(token);
  const userId = decodedTokens.id;

  try {
    const userData = await User.findById(userId);
    const cart = await Cart.findOne({ user: userId });
    const orders = await Order.find({ user: userId }).populate('items.productId');
    let wallet = await Wallet.findOne({ userId: userId });
    const orderReturns = await OrderReturn.find({ orderId: { $in: orders.map(order => order._id) } });
    const currentDate = new Date();
    // If wallet doesn't exist, create one with a balance of zero
    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0 });
      await wallet.save();
    }
    const balanceValue = wallet.balance;
    const cartLength = cart.cartItems.length;
    res.render('pages/profile', { userData, cartLength, orders, orderReturns, balanceValue ,currentDate ,userId });
  } catch (error) {
    console.error(error);
    res.send('An error occurred while fetching user data');
  }
};

const profileUpdate = async (req, res) => { 
  const {phone, userId } = req.body;
  await User.findByIdAndUpdate({_id : userId} , {phone: phone});
  res.json({ message: 'Profile updated successfully' });
};

const addUserAddress = async (req, res) => {
  const { country, streetAddress, city, state, pincodeValue, userId } = req.body;

  const userAddress = {
    country,
    streetAddress,
    city,
    state,
    pincode: pincodeValue,
  };

  try {
   const addressData =  await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { addresses: userAddress } }
    );
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: 'Error adding address' });
  }

  return res.json({ message: 'Address added successfully' });
};

const editUserAddress = async (req, res) => {

  const addressId = req.params.addressId
  const token = req.cookies.jwt;
  const decodedTokens = jwt.decode(token);
  const userId = decodedTokens.id
  const  { addresses } = await User.findById({_id:userId},{addresses:1})
  const data = addresses.find((address) => address._id == addressId)
  res.json(data);
}

const editUserAddressPost = async (req, res) => {
  const {name ,country, streetAddress, city,state ,pincode ,userId ,editAddressId} = req.body;
 await User.findOneAndUpdate(
  { _id: userId, 'addresses._id': editAddressId },
  {
    $set: {
      'addresses.$.country': country, 
      'addresses.$.streetAddress': streetAddress,
      'addresses.$.city': city,
      'addresses.$.state': state,
      'addresses.$.pincode': pincode,
    },
  }, 
)
res.json().status(200)

//*************  the below query can also be used update the nested Object. by using js higorder methods.**************** 

// User.findById(userId)
//   .then(user => {
//     if (user) {
//       const addressToUpdate = user.addresses.find(address => address._id.toString() === editAddressId);
//       if (addressToUpdate) {
//         // Update address fields here
//         addressToUpdate.country = 'New Country';
//         // addressToUpdate.streetAddress = 'New Street Address';
//         // Update other address fields as needed

//         return user.save();
//       } else {
//         console.log('Address not found');
//         return null;
//       }
//     } else {
//       console.log('User not found');
//       return null;
//     }
//   })
//   .then(updatedUser => {
//     if (updatedUser) {
//       console.log('Updated user:', updatedUser);
//     }
//   })
//   .catch(error => {
//     console.error('Error updating user:', error);
//   });


  }

const deleteUserAddressPost = async (req, res) => {

  const token = req.cookies.jwt;
  const decodedTokens = jwt.decode(token);
  const userId = decodedTokens.id
  const { addressId } = req.body;

  await User.findOneAndUpdate(
   { _id: userId, 'addresses._id': addressId },
   {
    $pull:{
      addresses: {_id: addressId }
    }
   }, 
 )
 res.json().status(200)
}

const addToCart = async (req, res) => {
  const { productId , quantity } = req.body;
  const token = req.cookies.jwt;
  const decodedTokens = jwt.decode(token);
  const userId = decodedTokens.id;
  try {

    if (!token) {
      console.log('Login to add to cart');
      // return res.status(401).json({ message: "Login to add product" });
      res.redirect('/login');
    }
    
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cartItem = {
      product: productId,
      quantity: quantity,
    }
    // Find the user's cart or create a new cart if it doesn't exist
    let userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      userCart = new Cart({ user: userId, cartItems: [] });
    }

    // Check if the product already exists in the cart, and update quantity if needed
    const existingCartItemIndex =  userCart.cartItems.findIndex(item => item.product.equals(productId));

    if (existingCartItemIndex !== -1) {
      userCart.cartItems[existingCartItemIndex].quantity += quantity;
    } else {
      userCart.cartItems.push(cartItem);
    }
    await userCart.save();
     res.status(201).json({ message: "Item added to cart"});
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const cart = async (req, res) => {
  const token = req.cookies.jwt;
  const decodedTokens = jwt.decode(token);
  const userId = decodedTokens.id
  const userCart = await Cart.findOne({ user: userId }).populate("cartItems.product");
  const cartLength = userCart.cartItems.length
  if (!userCart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  const populatedCart = userCart.toObject(); // Convert to plain object for manipulation
  res.render('pages/cart',{cartLength , populatedCart ,userId});
}

const updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    // Find the cart item and update the quantity
    const cartItem = await Cart.findOneAndUpdate(
      { 'cartItems.product': productId },
      { $set: { 'cartItems.$.quantity': quantity } }
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    return res.status(200).json({ message: 'Quantity updated successfully' });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'An error occurred while updating the quantity' });
  }
};

const deleteCartItem = async (req, res) => {
  const { deleteItemId ,cartId } = req.body;
  try {
    await Cart.findOneAndUpdate(
      { _id: cartId, 'cartItems._id': deleteItemId },
      {
       $pull:{
        cartItems: {_id: deleteItemId }
       }
      }, 
    )
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('error deleting');
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the cart item' });
  }
}

const checkout = async (req, res) => {
  const token = req.cookies.jwt;
  const decodedTokens = jwt.decode(token);
  const userId = decodedTokens.id;
  const cart = await Cart.find({ user: userId });
  const walletBalance = await Wallet.find({}, { _id: 0, balance: 1 });
  const coupons = await Coupon.find();

    const validCoupons = coupons.filter(coupon => {
     return coupon.usedCount <= coupon.usageLimit
    })

    let cartLength = 0;
    if (cart.length > 0 && cart[0].cartItems) {
      cartLength = cart[0].cartItems.length;
    }
    try {
      const userCart = await Cart.findOne({ user: userId })
        .populate("user")
        .populate("cartItems.product");

      res.render('pages/checkout', { userCart: userCart, cartLength, walletBalance: walletBalance[0].balance , validCoupons});
    } catch (error) {
      console.error('Error fetching cart data:', error);
      res.status(500).json({ message: 'An error occurred while fetching cart data' });
    }
};

const placeOrder = async (req, res) => {
  const { orderData } = req.body;
  try {
    const paymentMethod = orderData.paymentMethod;
    const walletAdded = orderData.walletAdded;
    // Check if walletAdded is true
    if (walletAdded) {
      // Find the user's wallet
      const userWallet = await Wallet.findOne({ userId: orderData.userId });
        // Calculate the total amount to deduct from the wallet (subtotal + shippingCharge)
      const totalAmountToDeduct = orderData.subtotal + orderData.shippingCharge;
      // Check if the user has sufficient balance
      if (userWallet) {
        userWallet.balance -= totalAmountToDeduct;
        if (userWallet.balance < 0 ) {
          userWallet.balance = 0;
        }
        if (orderData.totalAmount == 1) {
          userWallet.balance += 1 ;
        }
        await userWallet.save();
      }
      //  else {
      //   return res.status(400).json({ message: 'Insufficient wallet balance' });
      // }
    }else{
      console.log('no wallet');
    }
    if (paymentMethod === 'COD' ) {

      const newOrder = new Order({
        user: orderData.userId, // Use the populated user object
        items: orderData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.productPrice
        })),
        shippingAddress: {
          name: orderData.shippingAddress.name,
          country: orderData.shippingAddress.country,
          streetAddress: orderData.shippingAddress.streetAddress,
          city: orderData.shippingAddress.city,
          state: orderData.shippingAddress.state,
          pincode: orderData.shippingAddress.pincode
        },
        paymentMethod: orderData.paymentMethod,
        shippingCharge: orderData.shippingCharge,
        subtotals: orderData.subtotal,
        totalAmount: orderData.totalAmount,
        status:'Placed'
      });
  
      // Save the new order to the database
      const savedOrder = await newOrder.save();
      console.log('Order saved:', savedOrder);
      const userCart = await Cart.findOne({ user: orderData.userId });
      
      if (userCart) {
        userCart.cartItems = []; // Clear the items array to remove cart items
        await userCart.save(); // Save the changes to the cart
      }
      res.status(201).json({ message: 'success cod' , flag : true });
    }

    else if (paymentMethod === 'credit-card'){
      // Create a new instance of the Order model with the orderData
      const newOrder = new Order({
        user: orderData.userId,
        items: orderData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.productPrice,
        })),
        shippingAddress: {
          name: orderData.shippingAddress.name,
          country: orderData.shippingAddress.country,
          streetAddress: orderData.shippingAddress.streetAddress,
          city: orderData.shippingAddress.city,
          state: orderData.shippingAddress.state,
          pincode: orderData.shippingAddress.pincode,
        },
        paymentMethod: orderData.paymentMethod,
        shippingCharge: orderData.shippingCharge,
        subtotals: orderData.subtotal,
        totalAmount: orderData.totalAmount,
      
      });

      // // Save the new order to the database
      const savedOrder = await newOrder.save();
      console.log('Order saved with Razorpay:', savedOrder);

      const userCart = await Cart.findOne({ user: orderData.userId });
      //empty the cart after order
      if (userCart) {
        userCart.cartItems = [];
        await userCart.save();
      }

      const orderAmount = orderData.totalAmount * 100; // Convert to paise
      const options = {
        amount: orderAmount,
        currency: 'INR',
        receipt: "orderId",
        payment_capture: 1,
      };
      
      instance.orders.create(options, async function(err, order) {
        if (err) {
          console.log(err);
        }else{

          savedOrder.set({ razorpayOrderId: order.id });
          await savedOrder.save();
          // console.log(order);
          res.json(order)
        }
      });
    }

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order' });
  }
};

const verifyPayment = async (req, res) => {
  const { paymentData } = req.body;
  // Creating hmac object
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
  //   // Passing the data to be hashed
  hmac.update(paymentData.razorpay_order_id + '|' + paymentData.razorpay_payment_id);
    // Creating the hmac in the required format
  const generated_signature = hmac.digest('hex');
  if (paymentData.razorpay_signature === generated_signature) {
    try {
      // Find the order by razorpayOrderId
      const order = await Order.findOne({ razorpayOrderId: paymentData.razorpay_order_id });

      if (order) {
        // Update the status of the order to "Placed"
        order.status = 'Placed';
        await order.save();
        console.log('Order status updated to "Placed"');
      } else {
        console.log('Order not found with razorpayOrderId:', paymentData.razorpay_order_id);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  } else {
    console.log('payment failed');
    // res.json({ success: false, message: 'Payment verification failed' });
  }

}

const orderCancel = async (req, res) => {
  const { orderId } = req.body;
  try {
    const cancelOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'Canceled' },
      { new: true }
    );

    if (!cancelOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const canceledAmount = cancelOrder.totalAmount;
    const userId = cancelOrder.user;
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      // If wallet doesn't exist, create one
      wallet = new Wallet({ userId, balance: canceledAmount, transactions: [] });
      wallet.transactions.push({ type: 'deposit', amount: canceledAmount, orderId, timestamp: new Date() });
    } else {
      wallet.balance += canceledAmount;
      wallet.transactions.push({ type: 'deposit', amount: canceledAmount, orderId, timestamp: new Date() });
    }
    // Increment the product quantities
    const itemsToUpdate = cancelOrder.items;
    const promises = itemsToUpdate.map(async item => {
      const product = await Product.findById(item.productId);
      if (product) {
        product.totalQuantity += item.quantity; // Increment the product quantity
        await product.save(); // Save the changes to the product
      } else {
        console.log('Product not found for item:', item.productId);
      }
    });

    await Promise.all([wallet.save(), cancelOrder.save(), ...promises]); // Perform all operations in a transactional manner
    res.json({ message: 'Order canceled successfully' });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ message: 'Error canceling order' });
  }
};

const orederReturnRequest = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { returnProduct, returnReason } = req.body;
    let productsArray = [];
    let isWholeOrder = false;

    if (returnProduct === 'all') {
      isWholeOrder = true;
    } else {
      productsArray.push({ productId: returnProduct,  productReason: returnReason });
    }
    const orderReturn = new OrderReturn({
      
      orderId,
      isWholeOrder,
      products: productsArray,
      // returnReason: isWholeOrder ? '' : returnReason,
      returnReason,
      status: 'Pending'
    });

    await orderReturn.save();
    console.log('added to the return ');
    // res.redirect('/profile');

    res.status(200).json({ message: 'Return request submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while submitting the return request.' });
  }

}

const applyCoupon = async (req, res) => {
  try {
    const { couponCode, totalValue } = req.body;
    // Find the coupon based on the provided couponCode
    const coupon = await Coupon.findOne({ couponCode });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    // Check if the coupon has expired
    const currentDate = new Date();
    if (coupon.expiryDate <= currentDate) {
      console.log('Coupon has expired');
      return res.status(401).json({ success: false, message: 'Coupon has expired' });
    }

    // Check if the coupon has reached the usage limit
    if (coupon.usedCount >= coupon.usageLimit) {
      console.log('Coupon has reached the usage limit');
      return res.status(401).json({ success: false, message: 'Coupon has reached the usage limit' });
    }

    // Check if the totalValue is within the valid range
    const { minPurchase, maxPurchase } = coupon;
    if (totalValue >= minPurchase && totalValue <= maxPurchase) {
      // Proceed with coupon application
      coupon.usedCount += 1;
      await coupon.save();

      console.log('Coupon applied successfully');
      return res.json({ success: true, coupon });
    } else {
      // Total value is outside the valid range
      console.log('Purchase amount is outside the coupon range.');
      return res.status(400).json({ success: false, message: 'Purchase amount is outside the coupon range' });
    }
  } catch (error) {
    console.error('Error applying coupon:', error);
    return res.status(500).json({ success: false, message: 'Error applying coupon' });
  }
};

const products = async (req, res) => {
  const token = req.cookies.jwt;
  const decodedTokens = jwt.decode(token);
  let userId ;
  if (decodedTokens) {
     userId = decodedTokens.id;
  }
  const cart = await Cart.find({ user: userId });

  let cartLength = 0;
  if (cart.length > 0 && cart[0].cartItems) {
    cartLength = cart[0].cartItems.length;
  }
  const categories = await Category.find();
  const products = await Product.find();

  res.render('pages/homeProducts',{products,categories ,cartLength ,userId});
}

const searchProduct = async (req, res) => {
  try {
    const products = await Product.find();
    let filteredProducts = [...products];
    const searchValue = req.query.searchTerm ? req.query.searchTerm.toLowerCase() : null; // Get the search term from the query parameter
    const category = req.query.category ? req.query.category.toLowerCase() : null; // Get the selected category from the query parameter

    if (searchValue) {
      // Filter products by search term
      filteredProducts = filteredProducts.filter(product =>
        product.productTitle.toLowerCase().includes(searchValue)
      );
    }

    if (category) {
      // Filter products by category
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === category
      );
    }

    // Send the filtered products as JSON response
    return res.json(filteredProducts);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const orderPlacedAnimation = async (req, res) => {
 res.render('pages/orderPlace');
}

const userLogout = async (req, res) => { 
  // Clear the access token cookie
  res.clearCookie('jwt');
  
  // Clear the refresh token cookie
  res.clearCookie('refreshToken');

  // Redirect to the login page or any other appropriate page
  res.redirect('/login');
}

module.exports = {
    signup,
    signUpPost,
    emailVerification,
    emailVerificationPost,
    otpVerification,
    otpVerificationPost,
    homepage,
    forgotPassword,
    emailVerifyFp,
    otpVerifyFp,
    passwordReset,
    viewProduct,
    userProfile,
    profileUpdate,
    addUserAddress,
    editUserAddress,
    editUserAddressPost,
    deleteUserAddressPost,
    cart,
    updateQuantity ,
    addToCart,
    deleteCartItem,
    checkout,
    placeOrder,
    orderCancel,
    orederReturnRequest,
    verifyPayment,
    applyCoupon,
    products,
    searchProduct,
    orderPlacedAnimation,
    userLogout

};