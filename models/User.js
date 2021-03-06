const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  thirdPartyId: {
    type: String,
    required: true,
  },
  pushToken: [
    {
    type: String,
    ref: 'pushTokens',
    required: false,
  }
],
  allProducts: [ // An array of every foodID ever scanned into the inventory.
    {
      type: String,
      ref: 'historicProducts',
      required: true,
      default: null,
    },
  ],
  inventoryProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'product',
      required: true,
      default: null,
    },
  ],
  groceryList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'groceryItem',
      required: true,
      default: null,
    },
  ],
  expiredFood: 
  // [ //If we expand the data we keep on expired foods, we can uncomment the needed bits here.
    {
//     type: Schema.Types.ObjectId,
      type: Number,
      required: true,
      default: 0,
      // ref: 'expiredProduct',
    },
  // ]
  lastLogin: {
    type: Date,
    required: true,
  },
  dateJoined: {
    type: Date,
    required: true,
  },
  lastUpdated: {
    type: Date,
    required: true,
  }
});

const User = mongoose.model('user', userSchema);

module.exports = User;