/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
// Bring in the database models and modular functions
const { GroceryItem } = require('../models');
// const { targetUser, updateUser } = require("./userFunctions");

// Target Product Function
const targetGroceryItem = (reqTarget) => {
  const finalTarget = {}; // Establish an object that will be filled with the targeting parameters.
  // If any of the following parameters exist, add them to the target object.
  // Target a grocery item by its name
  if (reqTarget.productname !== undefined) {
    Object.assign(finalTarget, { productname: reqTarget.productname });
  }
  // Target by its Edamam-provided food Id
  if (reqTarget.foodId !== undefined) {
    Object.assign(finalTarget, { foodId: reqTarget.foodId });
  }
  // Target by its database ObjectId
  if (reqTarget._id !== undefined) {
    Object.assign(finalTarget, { _id: reqTarget._id });
  }
  // Target by its acquiredCheck boolean
  if (reqTarget.acquiredCheck !== undefined) {
    Object.assign(finalTarget, { acquiredCheck: reqTarget.acquiredCheck });
  }
  // Target by its expiration date if the date occurs before the "expiringBefore" date.
  if (reqTarget.expiringBefore !== undefined) {
    Object.assign(finalTarget, { expDate: { $lte: new Date(expiringBefore) } });
  }
  // Target by its expiration date if the date occurs after the "expiringAfter" date.
  if (reqTarget.expiringAfter !== undefined) {
    Object.assign(finalTarget, { expDate: { $gte: new Date(expiringAfter) } });
  }
  // Target by its amount needed if it is less than a number in lessThanQuantity.
  if (reqTarget.lessThanNeeded !== undefined) {
    Object.assign(finalTarget, { numNeeded: { $lte: lessThanNeeded } });
  }
  // Target by its amount needed if it is greater than a number provided in greaterThanQuantity.
  if (reqTarget.greaterThanNeeded !== undefined) {
    Object.assign(finalTarget, { numNeeded: { $gte: greaterThanNeeded } });
  }
  // Target by its owner's ObjectId
  if (reqTarget.owner !== undefined) {
    Object.assign(finalTarget, { owner: reqTarget.owner });
  }
  // Target depending on if it was added before a date provided in the "addedBefore" variable.
  if (reqTarget.addedBefore !== undefined) {
    Object.assign(finalTarget, { dateAdded: { $lte: new Date(addedBefore) } });
  }
  // Target depending on if it was added after a date provided in the "addedAfter" variable.
  if (reqTarget.addedAfter !== undefined) {
    Object.assign(finalTarget, { dateAdded: { $gte: new Date(addedAfter) } });
  }
  // If the final object is empty, then nothing was provided or it was not valid.
  if (finalTarget === undefined) { console.log('There was no valid target.'); }
  // Return the final target object that includes all the targetting parameters.
  return finalTarget;
};

//--------------------------------

// Update Grocery Item Function
const updateGroceryItem = (reqTarget, reqUpdate) => {
  // Create a target for the update by sending the requested target data through targetProduct().
  const finalTarget = targetGroceryItem(reqTarget);
  // Establish an object that will be filled with the update parameters.
  const finalUpdate = {};
  // Update the product's name string
  if (reqUpdate.productname !== undefined) {
    Object.assign(finalUpdate, { productname: reqUpdate.productname });
  }
  // Update the grocery item's category string
  if (reqUpdate.category !== undefined) {
    Object.assign(finalUpdate, { category: reqUpdate.category });
  }
  // Update the grocery item's expiration date.
  if (reqUpdate.expDate !== undefined) {
    Object.assign(finalUpdate, { expDate: reqUpdate.expDate });
  }
  // Update the grocery item's acquiredCheck boolean.
  if (reqUpdate.acquiredCheck !== undefined) {
    Object.assign(finalUpdate, { acquiredCheck: reqUpdate.acquiredCheck });
  }
  // Update the grocery item's amount needed (Expects Number)
  if (reqUpdate.numNeeded !== undefined) {
    Object.assign(finalUpdate, { numNeeded: reqUpdate.numNeeded });
  }
  // Update the grocery item's amount obtained (Expects Number)
  if (reqUpdate.numGot !== undefined) {
    Object.assign(finalUpdate, { $set: { numGot: reqUpdate.numGot } });
  }
  // If the final object is empty, then nothing was provided or it was not valid.
  if (finalUpdate === undefined) {
    console.log('There was no valid update.');
  }
  // Update its lastUpdated date
  const now = Date.now();
  Object.assign(finalUpdate, { lastUpdated: now });
  // Take the target and update objects and feed them to the database call
  GroceryItem.findOneAndUpdate(finalTarget, finalUpdate)
    .then((data) => {
      console.log(data);
      console.log('Update has been sent to the targeted grocery item!');
    })
    .catch(() => { console.log("We've got a problem. The update to the targeted grocery item failed!"); });
};

//--------------------------------

module.exports = {
  targetGroceryItem,
  updateGroceryItem,
};
