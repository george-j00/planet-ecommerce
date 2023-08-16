const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const User = require('../Models/users.schema');
const Product = require('../Models/products.schema');
const Otp = require('../Models/otp.schema');
// const Admin = require('../Models/admin.schema');

const bcrypt = require("bcrypt")
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
    const products = await Product.find();
   
    if (!products || products.length === 0 ) {
      return res.status(404).send({ message: "No products!" });
    }
    // console.log(products);
   res.render('pages/home',{products});
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
    viewProduct
};