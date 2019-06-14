const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  expDate: {
    type: Date,
    required: true,
  },
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;
