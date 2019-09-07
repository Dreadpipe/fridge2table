/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
// Bring in the database models
const { User } = require('../models');

// Target User
const targetUser = (reqTarget) => {
  const finalTarget = {}; // Establish an object that will be filled with the targeting parameters.
  // If any of the following parameters exist, add them to the target object.
  // Target a user by their username
  if (reqTarget.username !== undefined) {
    Object.assign(finalTarget, { username: reqTarget.username });
  }
  // Target a user by their third-party login service's id
  if (reqTarget.id !== undefined) {
    Object.assign(finalTarget, { thirdPartyId: reqTarget.id });
  }
  // Target a user by their database ObjectId
  if (reqTarget._id !== undefined) {
    Object.assign(finalTarget, { _id: reqTarget._id });
  }
  // Target a user depending on if they joined before a date provided in "joinedBefore".
  if (reqTarget.joinedBefore !== undefined) {
    Object.assign(finalTarget, {
      dateJoined: { $lte: new Date(joinedBefore) },
    });
  }
  // Target a user depending on if they joined after a date provided in the "joinedAfter" variable.
  if (reqTarget.joinedAfter !== undefined) {
    Object.assign(finalTarget, { dateJoined: { $gte: new Date(joinedAfter) } });
  }
  // Target a user depending on if they logged in before a date provided in "lastLoggedBefore".
  if (reqTarget.lastLoggedBefore !== undefined) {
    Object.assign(finalTarget, {
      lastLogin: { $lte: new Date(lastLoggedBefore) },
    });
  }
  // Target a user depending on if they logged in after a date provided in "lastLoggedAfter".
  if (reqTarget.lastLoggedAfter !== undefined) {
    Object.assign(finalTarget, {
      lastLogin: { $gte: new Date(lastLoggedAfter) },
    });
  }
  // If the final object doesn't have any targetting data, either none was provided or it's invalid.
  if (finalTarget === undefined) {
    console.log('There was no valid target.');
  }
  // Return the final target object that includes all the targetting parameters.
  return finalTarget;
};

//--------------------------------

// Update User Function
const updateUser = (reqTarget, reqUpdate) => {
  // Create a target for the update by sending the target data through the targetUser function.
  const finalTarget = targetUser(reqTarget);
  // Establish an object that will be filled with the update parameters.
  const finalUpdate = {};
  // If any of the following parameters exist, add them to the update object.
  // Update their username
  if (reqUpdate.username !== undefined) {
    Object.assign(finalUpdate, { username: reqUpdate.username });
  }
  // Update their push token for notifications
  if (reqUpdate.pushToken !== undefined) {
    Object.assign(finalUpdate, {
      $push:  {pushToken: reqUpdate.pushToken },
    });
  }
  // Update their list of all Edamam scanned foods
  if (reqUpdate.brandNewProduct !== undefined) {
    Object.assign(finalUpdate, {
      $push: { allProducts: reqUpdate.brandNewProduct },
    });
  }
  // Update their inventory by adding a new product's ObjectId
  if (reqUpdate.productObjId !== undefined) {
    Object.assign(finalUpdate, {
      $push: { inventoryProducts: reqUpdate.productObjId },
    });
  }
  // Update their inventory by removing the product's ObjectId (which must be nested in an array).
  if (reqUpdate.removeThisProduct !== undefined) {
    Object.assign(finalUpdate, {
      $pullAll: { inventoryProducts: reqUpdate.removeThisProduct },
    });
  }
  // Update their grocery list by adding a new grocery items's ObjectId
  if (reqUpdate.groceryObjId !== undefined) {
    Object.assign(finalUpdate, {
      $push: { groceryList: reqUpdate.groceryObjId },
    });
  }
  // Update inventory by removing the grocery item's ObjectId (which must be nested in an array).
  if (reqUpdate.removeThisGrocery !== undefined) {
    Object.assign(finalUpdate, {
      $pullAll: { groceryList: reqUpdate.removeThisGrocery },
    });
  }
  // Update their number of expired products, incrementing up one.
  if (reqUpdate.addExpired !== undefined) {
    Object.assign(finalUpdate, { $inc: { expiredFood: 1 } });
  }
  // Update their number of expired products, incrementing down one.
  if (reqUpdate.throwExpired !== undefined) {
    Object.assign(finalUpdate, { $inc: { expiredFood: -1 } });
  }
  // Update the date they were last logged in to today
  if (reqUpdate.justLogged !== undefined) {
    console.log(Date.now());
    Object.assign(finalUpdate, { lastLogin: Date.now() });
  }
  // If the final object is empty, then either nothing was provided or it was not valid.
  if (finalUpdate === undefined) {
    console.log('There was no valid update.');
  }
  // Update their lastUpdated date
  const now = Date.now();
  Object.assign(finalUpdate, { lastUpdated: now });
  // Take the target and update objects and feed them to the database call
  User.findOneAndUpdate(finalTarget, finalUpdate)
    .then(() => {
      console.log('Update has been sent to the targeted User!');
    })
    .catch(() => {
      console.log("We've got a problem. The update to the targeted User failed!");
    });
};

//--------------------------------

module.exports = {
  targetUser,
  updateUser,
};
