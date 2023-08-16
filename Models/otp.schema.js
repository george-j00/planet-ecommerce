const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const otpSchema = new mongoose.Schema({
  otp: Number,
  otpExpiresAt: Date
},
{
    collection: 'otps' // Custom collection name
}
);
 
const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
       