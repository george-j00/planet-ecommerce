const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }, 
  hashedPassword: {
    type: String,
    required: true
  },
  status:{
    type: Boolean,
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
       