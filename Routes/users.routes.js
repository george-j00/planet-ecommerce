const express = require('express');
const router = express.Router();
const userController = require('../Controllers/users.controllers');



router.get('/login' , userController.login); 
router.post('/login' , userController.loginPost); 
router.get('/signup' , userController.signup); 
router.post('/signup' , userController.signUpPost); 
router.get('/email-verification' , userController.emailVerification); 
router.post('/email-verification' , userController.emailVerificationPost); 
router.get('/otp-verification' , userController.otpVerification); 
router.post('/otp-verification' , userController.otpVerificationPost); 



module.exports = router;