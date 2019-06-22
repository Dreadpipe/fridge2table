const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
  productname: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  expDate: {
    type: Date,
    required: false,
    default: null,
  },
  sevenDayWarning: {
    type: Date,
    required: false,
    default: null,
  },
  twoDayWarning: {
    type: Date,
    required: false,
    default: null,
  },
  expiredOrNot: {
    type: Boolean,
    required: true,
    default: false,
  },
  foodId: {
    type: String,
    required: false,
    default: null,
  },
  pic: {
    type: String,
    required: false,
    default: null,
  },
  location: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  recipes: [ 
    {
      type: Schema.Types.ObjectId,
      required: true,
      default: null,
      ref: 'associatedRecipes'
    },
  ],
  dateAdded: {
    type: Date,
    required: true,
  },
  lastUpdated: {
    type: Date,
    required: true,
  }
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;
