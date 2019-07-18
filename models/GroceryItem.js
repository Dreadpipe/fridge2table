const mongoose = require('mongoose');

const { Schema } = mongoose;

const groceryItemSchema = new Schema({
  productname: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: false,
    default: null,
  },
  foodId: {
    type: String,
    required: false,
    default: null,
  },
  expDate: {
    type: Date,
    required: false,
    default: null,
  },
  pic: {
    type: String,
    required: false,
    default: null,
  },
  owner: {
    type: String,
    required: true,
  },
  numNeeded: {
    type: Number,
    required: true,
    default: 1,
  },
  numGot: {
    type: Number,
    required: true,
    default: 0,
  },
  dateAdded: {
    type: Date,
    required: true,
  },
  lastUpdated: {
    type: Date,
    required: true,
  }
});

const GroceryItem = mongoose.model('groceryItem', groceryItemSchema);

module.exports = GroceryItem;
