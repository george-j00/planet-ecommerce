const express = require('express');
const router = express.Router();
const userController = require('../Controllers/users.controllers');
const authController = require('../Controllers/authController');
const isAuthenticated = require('../Middleware/authMiddleware');


router.get('/login' , authController.loginUser); 
router.post('/login' , authController.loginUserPost); 
router.get('/signup' , userController.signup); 
router.post('/signup' , userController.signUpPost); 
router.get('/email-verification' , userController.emailVerification); 
router.post('/email-verification' , userController.emailVerificationPost); 
router.get('/otp-verification' , userController.otpVerification); 
router.post('/otp-verification' , userController.otpVerificationPost); 
router.get('/' ,isAuthenticated, userController.homepage); 
// router.get('/' ,userController.homepage); 
 
//forgot password section
router.get('/forgot-password', userController.forgotPassword); 
router.post('/forgot-password/emailVerification', userController.emailVerifyFp); 
router.post('/forgot-password/otpVerification', userController.otpVerifyFp); 
router.post('/password-reset', userController.passwordReset);

router.get('/products/:productId', isAuthenticated,  userController.viewProduct); 
//user profiles
router.get('/profile',isAuthenticated,  userController.userProfile); 
router.post('/profile/update-profile',  userController.profileUpdate); 

router.post('/profile/add-address',  userController.addUserAddress); 
router.get('/profile/update-address/:addressId',  userController.editUserAddress); 
router.post('/profile/update-address',  userController.editUserAddressPost); 
router.post('/profile/delete-address',  userController.deleteUserAddressPost); 


module.exports = router;