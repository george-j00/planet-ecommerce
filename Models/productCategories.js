const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
},
{
    collection: 'Categories' // Custom collection name
}
);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
       