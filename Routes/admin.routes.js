const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/admin.controllers');
const authController = require('../Controllers/authController');
const adminAuthenticated = require('../Middleware/adminAuthMiddleware');
const upload = require("../services/multer");


router.get('/admin-login' , authController.adminLogin); 
router.post('/admin-login' , authController.adminLoginPost); 

router.get('/dashboard' ,adminAuthenticated, adminController.dashboard); 
//for testing purposes  
// router.get('/get-products', adminController.getAllProducts); 
 

// router.get('/dashboard', adminController.dashboard); 
router.get('/add-product', adminController.addproductGet); 
router.post('/add-product',upload.array("productImage"), adminController.addProduct); 

router.post('/add-category',adminController.addCategory); 
router.post('/delete-category',adminController.deleteCategory); 


router.get('/edit-product/:productId', adminController.editProduct); 
router.post('/edit-product',upload.single("productImage"), adminController.editProductPost); 
router.post('/delete-product/:productId', adminController.deleteProduct);

router.post('/block-user/:userId', adminController.blockAndUnblockUser);
router.post('/update-status/:orderId', adminController.adminOrderStaus);

router.post('/update-return-status', adminController.updateReturnStatus);

router.post('/create-coupon', adminController.couponManagement);

router.post('/banner',upload.array("bannerImages"), adminController.bannerManagement);

router.post('/logout', adminController.adminLogout);
router.get('/download-sales-report', adminController.salesReportManagement);

router.post('/product/add-offer', adminController.offerManagement);
router.post('/category/add-offer', adminController.categoryOfferManagement);

router.get('/get-order-data/:orderId', adminController.getFullOrderData);
router.get('/search-orders', adminController.searchOrders);


module.exports = router;