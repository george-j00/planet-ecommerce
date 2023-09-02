const jwt = require('jsonwebtoken')
const redisClient = require('../config/redisClient');
const User = require('../Models/users.schema');
require('dotenv').config();

const isAuthenticated = async(req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect('/login');
    // Use "return" to ensure the function exits after the redirect
  }

  const decodedTokens = jwt.decode(token);
  const userId = decodedTokens.id;

  //instead of taking status from the token. it should be taken from the databse.
  // const userStatus = decodedTokens.status;
  const user = await User.findById(userId);
  // if user status is false then he is not blocked by admin
  const userStatus = user.status;

  if (userStatus === false) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedToken;
      next();
      console.log("Verified user");
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    const message = 'You are blocked by Admin';
    return res.render('pages/login', { message });
  }
};

// module.exports = {
//   isAuthenticated,
// };

module.exports = isAuthenticated;