const cloudinary = require('cloudinary');
require('dotenv').config();


// cloudinary.v2.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
//   secure: true, 
// });

cloudinary.v2.config({
  cloud_name:  "dyawq6e7r",
  api_key:  "844611149398845",
  api_secret: "xn9B4Tmz_x_hYWe6JbwQGZgmJuk",
  secure: true, 
});




module.exports = cloudinary;

