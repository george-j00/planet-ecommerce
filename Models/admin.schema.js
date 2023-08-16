const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const adminSchema = new mongoose.Schema({
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
  }
},

{
    collection: 'admin' // Custom collection name
}
);

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
       