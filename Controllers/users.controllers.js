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

const bcrypt = require("bcrypt");
const OrderReturn = require('../Models/return.schema');
const Wallet = require('../Models/wallet.schema');
const Coupon = require('../Models/coupon.schema');
const Category = require('../Models/productCategories');
const saltRounds = 10

//signup get function
const signup = (req,res) => {
    res.render('pages/signup');
}

const signUpPost = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email already exists in the database
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      // The email already exists
      const error = 'Email already exists';
      res.render('pages/signup', { error });
      // res.send(error);
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
    // Handle any errors
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
 

  // req.session.otp = +otp;
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
      to: 'gj816373@gmail.com', // Replace with the user's email address
      // to: verifyEmail, 
      subject: 'OTP Verification',
      text: `Your OTP for verification is: ${otp}`,
      // text:'hi everyone'
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
        // Create a new user
        const user = new User({
          name,
          email,
          hashedPassword,
          status
        });
        // Save the user to the database
        await user.save();
        
        console.log('Successfully added user');
        res.redirect('/login');
      } catch (error) {
        console.log(error, "Error on adding user");
      }
    } else {
      console.log('Incorrect OTP');
      res.render('pages/otpVerification', { error });
      // res.redirect('/otp-verification');
    }
  };

const forgotPassword = (req, res) => {
  res.render('pages/emailVerificationFp');
  }

const emailVerifyFp = async (req, res) => {

    const { verifyEmail } = req.body;

    // console.log(verifyEmail , 'this is verify email');

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
    // res.redirect('/otp-verification');
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
    const userId = decodedTokens.id;
    // console.log(userId);

    const products = await Product.find();
    const cart = await Cart.find({ user: userId });


    let cartLength = 0;
    if (cart.length > 0 && cart[0].cartItems) {
      cartLength = cart[0].cartItems.length;
    }

    res.render('pages/home', { products, cartLength});
  } catch (err) {
    console.log(err);
  }
};

const viewProduct = async (req, res) => {

  const token = req.cookies.jwt;
  const decodedTokens = jwt.decode(token);
  const userId = decodedTokens.id;
  const cart = await Cart.find({ user: userId });


  let cartLength = 0;
  if (cart.length > 0 && cart[0].cartItems) {
    cartLength = cart[0].cartItems.length;
  }
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);

    // console.log(product , 'this is product');
  res.render('pages/product',{product,cartLength});
  } catch (err) {
    console.error(err , '****** this is error ********');
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
    const wallet = await Wallet.find({userId: userId},{_id:0 , balance:1});

    const orderReturns = await OrderReturn.find({ orderId: { $in: orders.map(order => order._id) } });

    const balanceValue = wallet[0].balance;
    // console.log(balanceValue); 

    
    const cartLength = cart.cartItems.length;

    res.render('pages/profile', { userData, cartLength, orders,orderReturns,balanceValue});
  } catch (error) {
    console.error(error);
    res.send('An error occurred while fetching user data');
  }
};

const profileUpdate = async (req, res) => { 

  const { name, email, phone, userId } = req.body;

  console.log(name, email, phone, userId);

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
  //  res.json(addressData);

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

  // console.log(userId , addressId);

  const  { addresses } = await User.findById({_id:userId},{addresses:1})
  // console.log(addresses);

  const data = addresses.find((address) => address._id == addressId)

  res.json(data);

  // console.log(data);

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
    // Find the product using the provided productId
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create a new cart item with the product details
    const cartItem = {
      product: productId,
      quantity: quantity,
    };

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

    return res.status(201).json({ message: "Item added to cart"});
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
  // console.log(cartLength + " cartlength = " );

if (!userCart) {
  // Handle case where cart doesn't exist
  return res.status(404).json({ message: "Cart not found" });
}

const populatedCart = userCart.toObject(); // Convert to plain object for manipulation

  res.render('pages/cart',{cartLength , populatedCart});

}

const updateQuantity = async (req, res) => {

  const { productId, quantity } = req.body;

  console.log(productId , quantity);

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

const checkout =  async (req, res) => {

  const token = req.cookies.jwt;
  const decodedTokens = jwt.decode(token);
  const userId = decodedTokens.id
  const cart = await Cart.find({ user: userId });


  let cartLength = 0;
  if (cart.length > 0 && cart[0].cartItems) {
    cartLength = cart[0].cartItems.length;
  }
  try {
    const userCart = await Cart.findOne({ user: userId })
      .populate("user")
      .populate("cartItems.product");
      
    res.render('pages/checkout', { userCart: userCart,cartLength });
  }catch (error) {
    console.error('Error fetching cart data:', error);
    res.status(500).json({ message: 'An error occurred while fetching cart data' });
  }

}

const placeOrder = async (req, res) => {
  const { orderData } = req.body;
  try {

    const paymentMethod = orderData.paymentMethod;

    //payment method cod
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
    // else if (paymentMethod === 'wallet') {
    //    // Check if user has sufficient balance in their wallet
    //    const userWallet = await Wallet.findOne({ userId: orderData.userId });
    //    if (!userWallet || userWallet.balance < orderData.totalAmount) {
    //      return res.status(400).json({ message: 'Insufficient wallet balance' });
    //    }
 
    //    // Create a new instance of the Order model
    //    const newOrder = new Order({
    //      user: orderData.userId,
    //      items: orderData.items.map(item => ({
    //        productId: item.productId,
    //        quantity: item.quantity,
    //        price: item.productPrice,
    //      })),
    //      shippingAddress: orderData.shippingAddress,
    //      paymentMethod: 'wallet',
    //      shippingCharge: orderData.shippingCharge,
    //      subtotals: orderData.subtotal,
    //      totalAmount: orderData.totalAmount,
    //      status: 'Placed',
    //    });
 
    //    // Save the new order to the database
    //  const savedOrder =  await newOrder.save();
       
    //    console.log('wallet successs',savedOrder);
    //    // Update the user's wallet balance
    //    userWallet.balance -= orderData.totalAmount;
    //    await userWallet.save();
 
    //    // Clear the user's cart
    //    const userCart = await Cart.findOne({ user: orderData.userId });
    //    if (userCart) {
    //      userCart.cartItems = [];
    //      await userCart.save();
    //    }
 
    //    res.status(201).json({ message: 'Success Wallet Payment', flag:false });
    // }
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
  
  // console.log(razorpay_payment_id,razorpay_order_id,razorpay_signature);          
  // /// Creating hmac object
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
    res.redirect('/profile');

    // res.status(200).json({ message: 'Return request submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while submitting the return request.' });
  }

}

const applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;

    // Find the coupon by code
    const coupon = await Coupon.findOne({ couponCode });
    if (!coupon) {
        return res.json({ success: false, message: 'Coupon not found' });
    }
    console.log('coupon validated successfully');
    res.json({ success: true, coupon });
} catch (error) {
    console.error('Error applying coupon:', error);
    res.status(500).json({ success: false, message: 'Error applying coupon' });
}
}

const products = async (req, res) => {


  const token = req.cookies.jwt;
  const decodedTokens = jwt.decode(token);
  const userId = decodedTokens.id;
  // console.log(userId);
  const cart = await Cart.find({ user: userId });


  let cartLength = 0;
  if (cart.length > 0 && cart[0].cartItems) {
    cartLength = cart[0].cartItems.length;
  }
  const categories = await Category.find();
  const products = await Product.find();

  res.render('pages/homeProducts',{products,categories ,cartLength});
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
    orderPlacedAnimation

};