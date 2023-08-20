const jwt = require('jsonwebtoken')
const redisClient = require('../config/redisClient');
require('dotenv').config();

// const adminAuthenticated = async (req, res, next) => {


//   const token = req.cookies.adminJwt;

//   if (!token) {
//     return  res.redirect('/admin/admin-login');
//     // Use "return" to ensure the function exits after the redirect
//   }

//   try {
   

//     // Check if the token is present in the cookie.
  

//   console.log(token);
//   // if (!token) {
//   //   // The user is not authenticated, so redirect them to the login page.
//   //   res.redirect('/login');
//   //   return;
//   // }

//     // if (!token) {
//     //   return res.status(401).json({
//     //     status: 0,
//     //     data: {
//     //       err: {
//     //         generatedTime: new Date(),
//     //         errMsg: 'User is not authenticated.',
//     //         msg: 'User is not authenticated.',
//     //         type: 'AuthenticationError',
//     //       },
//     //     },
//     //   }); 
//     // }

//     // console.log('tokennnn',token);

//     // // Check if the token is blacklisted
//     // const blacklisted = await redisClient.get(`blacklist:${token}`);

//     // if (blacklisted) {
//     //   return res.status(401).json({
//     //     status: 0,
//     //     data: {
//     //       err: {
//     //         generatedTime: new Date(),
//     //         errMsg: 'Invalid or expired token.',
//     //         msg: 'Invalid or expired token.',
//     //         type: 'AuthenticationError',
//     //       },
//     //     },
//     //   }); 
//     // }

    
//     const verifiedAdmin =  jwt.verify(token, process.env.JWT_SECRET);
//     // if (!verifiedUser) {
//     //   return res.status(401).json({
//     //     status: 0,
//     //     data: {
//     //       err: {
//     //         generatedTime: new Date(),
//     //         errMsg: 'User is not authenticated.',
//     //         msg: 'User is not authenticated.',
//     //         type: 'AuthenticationError',
//     //       },
//     //     },
//     //   });
//     // }


//     console.log(verifiedUser);
//     req.admin = verifiedAdmin.admin;
    
// // console.log('this is verified user',verifiedUser);
//     // proceed after authentication
//     next();
//   } catch (err) {
//     // res.status(500).json({
//     //   status: -1,
//     //   data: {
//     //     err: {
//     //       generatedTime: new Date(),
//     //       errMsg: err.message,
//     //       msg: 'Internal Server Error.',
//     //       type: err.name,
//     //     },
//     //   },
//     // });

//     res.redirect('/admin/admin-login');
//   }
// };

// module.exports = adminAuthenticated;


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
