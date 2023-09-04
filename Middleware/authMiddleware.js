const jwt = require('jsonwebtoken')
const redisClient = require('../config/redisClient');
const User = require('../Models/users.schema');
require('dotenv').config();

const isAuthenticated = async (req, res, next) => {
  const accessToken = req.cookies.jwt;
  const refreshToken = req.cookies.refreshToken; // Get the refresh token from the cookies

  if (!accessToken) {
    return res.redirect('/login');
  }

  try {
    // Verify the access token
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decodedToken;
    
    // Check if the user is blocked (you can add other checks here)
    const user = await User.findById(decodedToken.id);
    if (user.status === true) {
      const message = 'You are blocked by Admin';
      return res.render('pages/login', { message });
    }

    // Access token is valid; proceed
    next();
    console.log("Verified user");
  } catch (error) {
    // Access token is invalid; check the refresh token
    if (!refreshToken) {
      console.log('invalid refresh token');
      return res.status(401).json({ message: 'Invalid token' });
    }

    try {
      // Verify the refresh token
      const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      // Check if the refresh token is valid (you can add other checks here)

      // If the refresh token is valid, issue a new access token
      const newAccessToken = jwt.sign(
        { id: decodedRefreshToken.id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Adjust the expiration time as needed
      );

      // Set the new access token in the response cookie
      res.cookie('jwt', newAccessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 }); // 15 minutes

      // Proceed with the request
      next();
      console.log("Verified user with a new access token");
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
};

// const isAuthenticated = async (req, res, next) => {
//   const token = req.cookies.jwt;

//   if (!token) {
//     return res.redirect('/login');
//   }

//   const decodedTokens = jwt.decode(token);
//   const userId = decodedTokens.id;

//   // Instead of taking status from the token, it should be taken from the database.
//   const user = await User.findById(userId);
//   const userStatus = user.status;

//   if (userStatus === false) {
//     try {
//         // Token is not blacklisted; verify the token and proceed
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decodedToken;
//         next();
//         console.log("Verified user");
//     } catch (error) {
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//   } else {
//     const message = 'You are blocked by Admin';
//     return res.render('pages/login', { message });
//   }
// };

module.exports = isAuthenticated;