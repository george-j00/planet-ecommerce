const express = require('express');
const app = express();
const path = require('path');
const database = require('./config/database')
const userRoutes = require('./Routes/users.routes');

database.connectToMongoDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("views"));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use("/" , userRoutes ); 

app.listen(3000, () => {
  console.log('Server started on port 3000');
}); 