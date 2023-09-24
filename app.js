const express = require('express');
const app = express();
const path = require('path');
const database = require('./config/database')
const userRoutes = require('./Routes/users.routes');
const adminRoutes = require('./Routes/admin.routes');
const cors = require("cors");
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

database.connectToMongoDB();

  //to prevent going back after logout on the login page
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

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
// Define a catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).render('pages/404'); // Render the 404 EJS template
});
// Define a middleware for handling 404 errors
app.use((req, res, next) => {
  res.status(404).render('pages/404'); // Render the 404 page with a 404 status code
});

app.listen(8000, () => {
  console.log('Server started on port 8000');
}); 

