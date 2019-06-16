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
  thirdPartyAccessToken: {
    type: String,
    required: true,
  },
  thirdPartyRefreshToken: {
    type: String,
    required: true,
  },
  allProducts: [ // An array of every barcode ever scanned into the inventory.
    {
      type: Number,
      ref: 'allProduct',
    },
  ],
  inventoryProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'currentInventory',
    },
  ],
  expiredFood: 
  // [ //If we expand the data we keep on expired foods, we can uncomment the needed bits here.
    {
//     type: Schema.Types.ObjectId,
      type: Number,
      ref: 'expiredProduct',
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
});

const User = mongoose.model('user', userSchema);

module.exports = User;