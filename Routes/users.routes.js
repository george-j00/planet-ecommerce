const express = require('express');
const router = express.Router();
const userController = require('../Controllers/users.controllers');

router.get('/login' , userController.login); 


module.exports = router;