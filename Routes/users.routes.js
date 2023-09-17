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
router.get('/' , userController.homepage); 
router.get('/forgot-password', userController.forgotPassword); 
router.post('/forgot-password/emailVerification', userController.emailVerifyFp); 
router.post('/forgot-password/otpVerification', userController.otpVerifyFp); 
router.post('/password-reset', userController.passwordReset);

router.get('/products/:productId',  userController.viewProduct); 
router.get('/profile',isAuthenticated,  userController.userProfile); 
router.post('/profile/update-profile',isAuthenticated,  userController.profileUpdate); 
router.post('/profile/add-address',  userController.addUserAddress); 
router.get('/profile/update-address/:addressId',isAuthenticated,  userController.editUserAddress); 
router.post('/profile/update-address',isAuthenticated,  userController.editUserAddressPost); 
router.post('/profile/delete-address',isAuthenticated,  userController.deleteUserAddressPost); 
//cart
router.get('/cart',isAuthenticated, userController.cart);
router.post('/update-quantity' , userController.updateQuantity);
router.post('/add-to-cart' ,isAuthenticated, userController.addToCart); 
router.post('/delete-cartItem', isAuthenticated, userController.deleteCartItem); 

router.get('/checkout',isAuthenticated, userController.checkout); 
router.post('/place-order',isAuthenticated , userController.placeOrder); 
router.post('/verify-payment',isAuthenticated , userController.verifyPayment); 
router.post('/order-cancel',isAuthenticated , userController.orderCancel); 
router.post('/return-request/:orderId', isAuthenticated, userController.orederReturnRequest);

router.post('/apply-coupon', isAuthenticated, userController.applyCoupon);
router.get('/products', userController.products);
router.get('/search-product', userController.searchProduct);
router.get('/order-placed', isAuthenticated, userController.orderPlacedAnimation);
router.post('/logout', isAuthenticated, userController.userLogout);

module.exports = router;