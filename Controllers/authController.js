const redisClient = require('../config/redisClient');
const Admin = require('../Models/admin.schema');
const User = require('../Models/users.schema');
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const loginUser = (req,res) => {
    res.render('pages/login')
}
const adminLogin = (req,res) => {
  //shows the login page
  res.render('pages/adminLogin')
  // res.render('pages/new')
}

const loginUserPost = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = 'create accound';
      return res.render('pages/login', { error });
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (passwordMatch) {

      const payload = {
        id: user._id,
        email: user.email,
        user: user.name,
        status: user.status // Assuming you have a 'status' field in your user model
      };
      
      const secretKey = process.env.JWT_SECRET; // Load secret key from .env
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

      res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // Set the cookie

      // res.send('success')
      res.redirect('/');

    } else {
      const error = 'Password is incorrect';
      res.render('pages/login', { error });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const adminLoginPost = async (req, res) => {
  try {

    // res.send('Welcome');
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email: email });


    if (!existingAdmin) {
      const error = 'Invalid credentials';
      return res.render('pages/adminLogin', { error });
    }
    // if (!existingAdmin) {
    //   return res.status(404).json({
    //     status: 0,
    //     data: {
    //       err: {
    //         generatedTime: new Date(),
    //         errMsg: 'ADMIN not available with this email address.',
    //         msg: 'admi not available with this email address.',
    //         type: 'NotFoundError',
    //       },
    //     },
    //   });
    // }

    const isPasswordCorrect =  bcrypt.compare(
      password,
      existingAdmin.hashedPassword
    );

    const passwordMatch = await bcrypt.compare(password, existingAdmin.hashedPassword);
  
    if (passwordMatch) {

      const payload = {
        id: existingAdmin._id,
        email: existingAdmin.email
      };
      
      const secretKey = process.env.JWT_SECRET; // Load secret key from .env
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

      res.cookie('adminJwt', token, { httpOnly: true, maxAge: 3600000 }); // Set the cookie

      // res.send('success')
      res.redirect('/admin/dashboard');

    }else {
      const error = 'Invalid credentials';
      return res.render('pages/adminLogin', { error });
    }

    // if (!isPasswordCorrect) {
    //   return res.status(401).json({
    //     status: 0,
    //     data: {
    //       err: {
    //         generatedTime: new Date(),
    //         errMsg: 'Password is incorrect',
    //         msg: 'Password is incorrect',
    //         type: 'Internal Server Error',
    //       },
    //     },
    //   });
    // }

    // const admin = { admin: existingAdmin.email};
    // const token =  jwt.sign(admin, process.env.JWT_SECRET, {
    //   expiresIn: '1d',
    // });
    //  // Set the token in a cookie
    //  res.cookie('token', token, {
    //     maxAge: 86400, // 1 day in seconds
    //     httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    //   });
      
    // //  res.status(200).json({
    // //   status: 1,
    // //   message: `Logged in Successfully`,
    // //   data: {
    // //     token: token,
    // //     name: existingUser.name,
    // //     email: existingUser.email
    // //   },
    // // });

    //   res.redirect('/admin/dashboard');
    
  } catch (err) {
    return res.status(500).json({
      status: -1,
      data: {
        err: {
          generatedTime: new Date(),
          errMsg: err.stack,
          msg: err.message,
          type: err.name,
        },
      },
    });
  }
};

//logout 

// const logoutUser = async (req, res) => {
//   try {
    
//     const token = req.headers["authorization"].split(" ")[1];

//     if (!token) {
//       return res.status(401).json({
//         status: 0,
//         data: {
//           err: {
//             generatedTime: new Date(),
//             errMsg: 'User is not authenticated.',
//             msg: 'User is not authenticated.',
//             type: 'AuthenticationError',
//           },
//         },
//       }); 
//     }
    
//     // Add the token to the blacklist with a TTL (time-to-live) of the token's remaining validity period
//     const decodedUser = await jwt.verify(token, process.env.JWT_SECRET);

//     const now = Math.floor(Date.now() / 1000);
//     const expiresIn = decodedUser.exp - now; 

//     redisClient.setEx(`blacklist:${token}`, expiresIn, 'true');
    

//     res.status(200).json({ status: 1, data: {}, message: 'Logged out successfully!' });

//   } catch (err) {
//     return res.status(500).json({
//       status: -1,
//       data: {
//         err: {
//           generatedTime: new Date(),
//           errMsg: err.stack,
//           msg: err.message,
//           type: err.name,
//         },
//       },
//     });
//   }
// };

module.exports = {
  loginUser,
  adminLogin,
  loginUserPost,
  adminLoginPost
//   logoutUser
};