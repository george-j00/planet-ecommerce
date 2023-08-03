const express = require('express');
const app = express();
const path = require('path');
const database = require('./config/database')
const userRoutes = require('./Routes/users.routes');
const cors = require("cors");
const session = require('express-session');

database.connectToMongoDB();

app.use(
  session({
    secret: 'your_secret_key', // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("views"));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use("/" , userRoutes ); 

app.listen(3000, () => {
  console.log('Server started on port 3000');
}); 