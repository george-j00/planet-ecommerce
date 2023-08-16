const jwt = require('jsonwebtoken');
const redisClient = require('../config/redisClient');
require('dotenv').config();

const adminAuthenticated = async (req, res, next) => {
  const token = req.cookies.adminJwt;

  if (!token) {
    return res.redirect('/admin/admin-login');
  }

  try {
    const verifiedAdmin = jwt.verify(token, process.env.JWT_SECRET);

    // Log the verified admin
    console.log(verifiedAdmin);

    req.admin = verifiedAdmin.admin;
    next();
  } catch (err) {
    // Redirect to login page if token verification fails
    res.redirect('/admin/admin-login');
  }
};

module.exports = adminAuthenticated;
