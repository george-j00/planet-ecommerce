const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const User = require('../Models/users.schema')

const login = (req,res) => {
    // res.render('login')
    res.render('pages/login')
}

const loginPost = (req,res) => {
    // res.render('login')
   const data = req.body

   console.log("login data ____",data);
}

//signup get function
const signup = (req,res) => {
    res.render('pages/signup');
}

//signup post function
const signUpPost = (req,res) => {
   const {name , email  , password } = req.body

   const userData = {name , email, password };
   console.log("signup data",userData);
   req.session.userData = userData;
   res.redirect('/email-verification');
} 

const emailVerification = (req,res) => {
    res.render('pages/emailVerification');
 }

const emailVerificationPost = (req, res) => {
    // Generate a 6-digit OTP
    const { verifyEmail } = req.body;
    const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
    req.session.otp = +otp;
    console.log('this is otp',otp);
    // Create the transporter object
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        // host: 'smtp.gmail.com', // e.g., 'smtp.gmail.com' for Gmail
        // port: 587, // SMTP port (587 for Gmail)
        // secure: false, // Set to true if using port 465 with SSL/TLS, false for port 587 or 25
        auth: {
          user: 'gj816373@gmail.com',
          pass: 'oykvaqiekefunsfp',
        },
      });
    
      const mailOptions = {
        from: 'gj816373@gmail.com',
        to: 'gj816373@gmail.com', // Replace with the user's email address
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
    const otp = req.session.otp;
    const userData = req.session.userData;


    console.log('this is the otp' ,otp , userOtp);
    console.log(userData);

    const {name  ,email, password } = userData;
  

    if (otp === userOtp) {
        try {
          // Create a new user
          const user = new User({
            name,
            email,
            password 
          });
          // Save the user to the database
          await user.save();
          // Send a success response
         console.log('successfully added user');
        res.redirect('/login');


      } catch (error) {
        console.log(error , "error on adding user ");
      }
    }else{
      res.redirect('/otp-verification');
    }

   }


module.exports = {
    login  , 
    signup,
    signUpPost,
    loginPost,
    emailVerification,
    emailVerificationPost,
    otpVerification,
    otpVerificationPost
};