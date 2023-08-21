const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const User = require('../Models/users.schema');
const Product = require('../Models/products.schema');
const jwt = require('jsonwebtoken')
const Cart = require('../Models/cart.schema');



const bcrypt = require("bcrypt");
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

}

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
    const userId = decodedTokens.id
    console.log(userId);
    const products = await Product.find();
    const cart = await Cart.find({user:userId});

  if (cart || cart.cartItems ) {
    const cartLength = cart[0].cartItems.length
   res.render('pages/home',{products,cartLength});

  }
  } catch (err) {
    console.log(err);
  }
   
}

const viewProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);

    // console.log(product , 'this is product');
  res.render('pages/product',{product});
  } catch (err) {
    console.error(err , '****** this is error ********');
    res.status(500).json({ error: 'Error fetching product data.' });
  }  
}

const userProfile = async (req, res) => { 

  const token = req.cookies.jwt;
  const decodedTokens = jwt.decode(token);
  const userId = decodedTokens.id

  const cart = await Cart.find({user:userId});

const cartLength = cart[0].cartItems.length

  try {
    const userData = await User.findById({_id : userId});

    // console.log(userData, 'this is userData');
   res.render('pages/profile', {userData,cartLength});
  //   console.log(decodedTokens.user , 'this is user profile');
  } catch (error) {
   res.send('no user found');
  }
}

const profileUpdate = async (req, res) => { 

  const { name, email, phone, userId } = req.body;

  console.log(name, email, phone, userId);

  await User.findByIdAndUpdate({_id : userId} , {phone: phone});

  res.json({ message: 'Profile updated successfully' });
}

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
  const {country, streetAddress, city,state ,pincode ,userId ,editAddressId} = req.body;
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
  const { productId } = req.body;
  const token = req.cookies.jwt;
  const decodedTokens = jwt.decode(token);
  const userId = decodedTokens.id;

  try {
    // Find the product using the provided productId
    const product = await Product.findById(productId, { productTitle: 1, productPrice: 1 });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create a new cart item with the product details
    const cartItem = {
      product: productId,
      quantity: 1,
    };

    // Find the user's cart or create a new cart if it doesn't exist
    let userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      userCart = new Cart({ user: userId, cartItems: [] });
    }

    // Check if the product already exists in the cart, and update quantity if needed
    const existingCartItemIndex = userCart.cartItems.findIndex(item => item.product.equals(productId));

    if (existingCartItemIndex !== -1) {
      userCart.cartItems[existingCartItemIndex].quantity += 1;
    } else {
      userCart.cartItems.push(cartItem);
    }
    //  console.log(userCart , 'this is pop');
     console.log(data , 'this is pop');

    // Save the updated cart
    await data.save();

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

  // const cart = await Cart.find({user:userId});

  // res.render('pages/cart',{cartLength , cart});

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
    addToCart
};