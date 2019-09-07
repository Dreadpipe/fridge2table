/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
// Bring in the database models and modular functions
const { Product } = require('../models');
const { addDays, subtractDays } = require('./dateFunctions');
const { updateUser } = require('./userFunctions');

// Helper Functions

// If the product is newly expired, increment the amount of expired food in the user's inventory
function handleExpired(expiredOrNot, owner) {
  if (expiredOrNot === true) {
    updateUser({ _id: owner }, { throwExpired: true });
  }
}

// Target Product Function
const targetProduct = (reqTarget) => {
  const finalTarget = {}; // Establish an object that will be filled with the targeting parameters.
  // If any of the following parameters exist, add them to the target object.
  // Target a product by it's name
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
  // Target by its expiration date if the date occurs before a date provided in "expiringBefore"
  if (reqTarget.expiringBefore !== undefined) {
    Object.assign(finalTarget, { expDate: { $lte: new Date(expiringBefore) } });
  }
  // Target by its expiration date if the date occurs after a date provided in "expiringAfter"
  if (reqTarget.expiringAfter !== undefined) {
    Object.assign(finalTarget, { expDate: { $gte: new Date(expiringAfter) } });
  }
  // Target by its quantity if it is less than a number provided in "lessThanQuantity"
  if (reqTarget.lessThanQuantity !== undefined) {
    Object.assign(finalTarget, { quantity: { $lte: lessThanQuantity } });
  }
  // Target by its quantity if it is greater than a number provided in "greaterThanQuantity"
  if (reqTarget.greaterThanQuantity !== undefined) {
    Object.assign(finalTarget, { quantity: { $gte: greaterThanQuantity } });
  }
  // Target if it is expired(true) or not expired(false) in the Boolean provided in "expiredOrNot"
  if (reqTarget.expiredOrNot !== undefined) {
    Object.assign(finalTarget, { expiredOrNot: reqTarget.expiredOrNot });
  }
  // Target by its location (Fridge, Freezer, Pantry)
  if (reqTarget.location !== undefined) {
    Object.assign(finalTarget, { location: reqTarget.location });
  }
  // Target by its owner's ObjectId
  if (reqTarget.owner !== undefined) {
    Object.assign(finalTarget, { owner: reqTarget.owner });
  }
  // Target by a recipe (FUTURE FEATURE - NOT ACTIVE YET)
  if (reqTarget.recipe !== undefined) {
    Object.assign(finalTarget, { recipes: recipe });
  }
  // Target depending on if it was added before a date provided in the "addedBefore" variable.
  if (reqTarget.addedBefore !== undefined) {
    Object.assign(finalTarget, { dateAdded: { $lte: new Date(addedBefore) } });
  }
  // Target depending on if it was added after a date provided in the "addedAfter" variable.
  if (reqTarget.addedAfter !== undefined) {
    Object.assign(finalTarget, { dateAdded: { $gte: new Date(addedAfter) } });
  }
  // If the final object is empty, then either nothing was provided or it was not valid.
  if (finalTarget === undefined) { console.log('There was no valid target.'); }
  // Return the final target object that includes all the targetting parameters.
  return finalTarget;
};

//--------------------------------

// Update Product Function
const updateProduct = (reqTarget, reqUpdate) => {
  // Create a target for the update - sends the target data through the targetProduct function.
  const finalTarget = targetProduct(reqTarget);
  const finalUpdate = {}; // Establish an object that will be filled with the update parameters.
  // Update the product's name string
  if (reqUpdate.productname !== undefined) {
    Object.assign(finalUpdate, { productname: reqUpdate.productname });
  }
  // Update the product's category string
  if (reqUpdate.category !== undefined) {
    Object.assign(finalUpdate, { category: reqUpdate.category });
  }
  // Update the product's expiration dates and warning dates
  if (reqUpdate.expDate !== undefined) {
    // Establish the dates for today, two days from now and seven days from now.
    const today = Date.now();
    const twoDays = addDays(today, 2);
    const sevenDays = addDays(today, 7);
    // If the expiration date >= 7 days away, add expiration date, & 2 & 7 day warnings.
    if (new Date(reqUpdate.expDate) >= new Date(sevenDays)) {
      Object.assign(finalUpdate, {
        expDate: reqUpdate.expDate,
        sevenDayWarning: subtractDays(reqUpdate.expDate, 7),
        twoDayWarning: subtractDays(reqUpdate.expDate, 2),
        expiredOrNot: false,
      });
      handleExpired(reqTarget.expiredOrNot, reqTarget.owner);
    // If the exp date is < 7 days away, but > 2 days away, add an exp date and 2 day warning.
    } else if (new Date(reqUpdate.expDate) >= new Date(twoDays)) {
      Object.assign(finalUpdate, {
        expDate: reqUpdate.expDate,
        sevenDayWarning: null,
        twoDayWarning: subtractDays(reqUpdate.expDate, 2),
        expiredOrNot: false,
      });
      handleExpired(reqTarget.expiredOrNot, reqTarget.owner);
    // If the exp date is < 7 days away, but > 2 days away, add an exp date and 2 day warning.
    } else if ((new Date(reqUpdate.expDate) <= new Date(twoDays))
                && (new Date(reqUpdate.expDate) >= new Date(today))) {
      Object.assign(finalUpdate, {
        expDate: reqUpdate.expDate,
        sevenDayWarning: null,
        twoDayWarning: null,
        expiredOrNot: false,
      });
      handleExpired(reqTarget.expiredOrNot, reqTarget.owner);
      // If the expiration date is older than today, then mark the food as expired.
    } else {
      Object.assign(finalUpdate, {
        sevenDayWarning: null,
        twoDayWarning: null,
        expDate: reqUpdate.expDate,
        expiredOrNot: true,
      });
      handleExpired(true, reqTarget.owner);
    }
  }
  // Update the product's 7-day warning by removing it (Use Boolean - True)
  if (reqUpdate.remove7DayWarning !== undefined) {
    Object.assign(finalUpdate, { sevenDayWarning: null });
  }
  // Update the product's 2-day warning by removing it (Use Boolean - True)
  if (reqUpdate.remove2DayWarning !== undefined) {
    Object.assign(finalUpdate, { twoDayWarning: null });
  }
  // Update the product's expiration status (Expects Boolean)
  if (reqUpdate.expiredOrNot !== undefined && finalUpdate.expiredOrNot === undefined) {
    Object.assign(finalUpdate, { expiredOrNot: reqUpdate.expiredOrNot });
  }
  // Update the product's location
  if (reqUpdate.location !== undefined) {
    Object.assign(finalUpdate, { location: reqUpdate.location });
  }
  // Update the product's quantity (Expects Number)
  if (reqUpdate.quantity !== undefined) {
    Object.assign(finalUpdate, { $set: { quantity: reqUpdate.quantity } });
  }
  // Update recipes. Recipe(s) needs to be in an array.(FUTURE FEATURE - NOT ACTIVE YET)
  if (reqUpdate.newRecipes !== undefined) {
    Object.assign(finalUpdate, {
      $push: { recipes: { $each: reqUpdate.newRecipes } },
    });
  }
  // Update recipes by removing one (Expects ObjectId). Recipes needs to be in an array.
  if (reqUpdate.removeRecipes !== undefined) {
    Object.assign(finalUpdate, {
      $pullAll: { recipes: { $each: reqUpdate.removeRecipes } },
    });
  }
  // If the final object is empty, then nothing was provided or it was not valid.
  if (finalUpdate === undefined) { console.log('There was no valid update.'); }
  // Update its lastUpdated date
  Object.assign(finalUpdate, { lastUpdated: Date.now() });
  // Take the target and update objects and feed them to the database call
  Product.findOneAndUpdate(finalTarget, finalUpdate)
    .then((data) => {
      console.log(data);
      console.log('Update has been sent to the targeted Product!');
    })
    .catch(() => {
      console.log("We've got a problem. The update to the targeted Product failed!");
    });
};

//--------------------------------

module.exports = {
  targetProduct,
  updateProduct,
};
