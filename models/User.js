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
  deviceToken: {
    type: String,
    required: true,
  },
  pushToken: {
    type: String,
    required: false,
  },
  allProducts: [ // An array of every foodID ever scanned into the inventory.
    {
      type: String,
      ref: 'allProduct',
      required: true,
      default: null,
    },
  ],
  inventoryProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'currentInventory',
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