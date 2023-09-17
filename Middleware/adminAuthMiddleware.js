const jwt = require('jsonwebtoken')
require('dotenv').config();

const adminAuthenticated = async (req, res, next) => {
  const token = req.cookies.adminJwt;
  if (!token) {
    return res.redirect('/admin/admin-login');
  }
  try {
    const verifiedAdmin = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = verifiedAdmin.admin;
    next();
  } catch (err) {
    res.redirect('/admin/admin-login');
  }
};
module.exports = adminAuthenticated;
