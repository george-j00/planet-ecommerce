const express = require('express');
const app = express();
const path = require('path');
const database = require('./config/database')
const userRoutes = require('./Routes/users.routes');
const adminRoutes = require('./Routes/admin.routes');
const cors = require("cors");
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const adminGetProducts = require('./Controllers/admin.controllers');
// const redisClient = require('./config/redisClient');

app.use(cookieParser());

database.connectToMongoDB();



app.use(
  session({
    secret: 'your_secret_key', // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: false, // Set to true if using HTTPS
      maxAge:  60 * 1000 // Set the expiration time in milliseconds (1 min in this example)
    }
  })
);

// process.on('SIGINT', () => {
//   redisClient.quit(() => {
//     console.log('Redis client disconnected');
//     process.exit(0);
//   });
// });

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("views"));



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// app.use("/admin/get-products" ,adminGetProducts.getAllProducts); 
app.use("/" , userRoutes ); 
app.use("/admin" , adminRoutes); 


app.listen(3000, () => {
  console.log('Server started on port 3000');
}); 