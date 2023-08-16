const jwt = require('jsonwebtoken')
const redisClient = require('../config/redisClient');
require('dotenv').config();

// const isAuthenticated = async (req, res, next) => {

//   try {
//     // if (!req.headers['authorization']) {
//     //   return res.status(401).json({
//     //     status: 0,
//     //     data: {
//     //       err: {
//     //         generatedTime: new Date(),
//     //         errMsg: 'You are not logged in!!',
//     //         msg: 'You are not logged in!!',
//     //         type: 'AuthenticationError',
//     //       },
//     //     },
//     //   });
//     // }

//     // const token = req.headers['authorization'].split(' ')[1];

//     // Check if the token is present in the cookie.
//   const token = req.cookies.token;


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

//     const decodedPayload = jwt.decode(token);
//     const userStatus = decodedPayload.status;
//     console.log('User Status:', userStatus);
    
//     if (!userStatus) {
//       const verifiedUser =  jwt.verify(token, process.env.JWT_SECRET);
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

    
    
//     req.user = verifiedUser.user;
//     // console.log('this is verified user',verifiedUser);
//     // proceed after authentication
//     next();
//     }else{
//       const message = 'You are blocked by Admin'
//       res.render('pages/login' , {message})
//     }
    
    
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

//     res.redirect('/login');
//   }
// };

// const jwt = require('jsonwebtoken');
// const secretKey = process.env.SECRET_KEY; 

// const isAuthenticated = (req, res, next) => {
//   const token = req.cookies.jwt;

//   if (!token) {
//     res.redirect('/login');
//     // res.render('pages/login' )

//   }  
//     const decodedTokens = jwt.decode(token);
//     const userStatus = decodedTokens.status;

//     if(!userStatus){
//         try {
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decodedToken; 
//         next(); 
//         console.log("verrified user: ");
//       } catch (error) {
//         return res.status(403).json({ message: 'Invalid token' });
//       }
//     }else{
//         // const error = "you are blocked by admin";
//         // res.render('pages/login',{ error });
//         // console.log(blocked);
//         const message = 'You are blocked by Admin'
//       res.render('pages/login' , {message})
//     }
   
// };

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect('/login');
    // Use "return" to ensure the function exits after the redirect
  }
  
  const decodedTokens = jwt.decode(token);
  const userStatus = decodedTokens.status;

  if (!userStatus) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedToken;
      next();
      console.log("Verified user");
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  } else {
    const message = 'You are blocked by Admin';
    return res.render('pages/login', { message });
  }
};

module.exports = {
  isAuthenticated,
};


module.exports = isAuthenticated;