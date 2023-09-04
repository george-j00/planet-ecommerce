const mongoose = require('mongoose');
require('dotenv').config();
// Connect to MongoDB
async function connectToMongoDB() {
    try {
       mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
     
//       const conn = mongoose.connection;

//       Grid.mongo = mongoose.mongo;

//       let gfs;
//     conn.once("open", () => {
//     gfs = Grid(conn.db, mongoose.mongo);
//     app.locals.gfs = gfs;
// });
      console.log('Connected to MongoDB');
    } catch (error) {``
      console.error('Error connecting to MongoDB:', error);
    }
  }


  module.exports = {
    connectToMongoDB,
  };  
  
  
