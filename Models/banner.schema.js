// models/banner.js
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  bannerTitle: String,
  bannerFeaturedTitle: String,
  bannerImages:  [
    {
      secure_url: { type: String },
      cloudinary_id: { type: String }
    }
  ], // Store image URLs as an array of strings
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;