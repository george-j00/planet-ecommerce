const mongoose = require('mongoose');
require('dotenv').config();
// Connect to MongoDB
async function connectToMongoDB() {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
  module.exports = {
    connectToMongoDB,
  };