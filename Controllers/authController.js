const Admin = require('../Models/admin.schema');
const User = require('../Models/users.schema');
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const loginUser = (req,res) => {
    res.render('pages/login')
}
const adminLogin = (req,res) => {
  //shows the admin login page
  res.render('pages/adminLogin')
}
const loginUserPost = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = 'create account';
      return res.render('pages/login', { error });
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (passwordMatch) {
      const payload = {
        id: user._id,
        email: user.email,
        user: user.name,
        status: user.status, 
      };

      const secretKey = process.env.JWT_SECRET;
      const accessToken = jwt.sign(payload, secretKey, { expiresIn: '15m' });

      // Create a refresh token with a longer expiration time (e.g., 7 days)
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
      });

      // Set both tokens in cookies
      res.cookie('jwt', accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

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

    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email: email });

    if (!existingAdmin) {
      const error = 'Invalid credentials';
      return res.render('pages/adminLogin', { error });
    }
    const passwordMatch = await bcrypt.compare(password, existingAdmin.hashedPassword);
  
    if (passwordMatch) {
      const payload = {
        id: existingAdmin._id,
        email: existingAdmin.email
      };
      
      const secretKey = process.env.JWT_SECRET; // Load secret key from .env
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

      res.cookie('adminJwt', token, { httpOnly: true, maxAge: 3600000 }); // Set the cookie
      res.redirect('/admin/dashboard');
    }else {
      const error = 'Invalid credentials';
      return res.render('pages/adminLogin', { error });
    }    
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

module.exports = {
  loginUser,
  adminLogin,
  loginUserPost,
  adminLoginPost
};