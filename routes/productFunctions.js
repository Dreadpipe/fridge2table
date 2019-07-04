// Bring in the database models and modular functions
const { Product } = require("../models");
const { addDays, subtractDays } = require("./dateFunctions");
const { targetUser, updateUser } = require("./userFunctions");

// Target Product Function
const targetProduct = function(reqTarget) {
	let finalTarget = {}; // Establish an object that will be filled with the targeting parameters.
	// If any of the following parameters exist, add them to the target object.
	// Target a product by its name
	if (reqTarget.productname !== undefined) {
		Object.assign(finalTarget, { productname: reqTarget.productname });
	}
	// Target a product by its Edamam-provided food Id
	if (reqTarget.foodId !== undefined) {
		Object.assign(finalTarget, { foodId: reqTarget.foodId });
	}
	// Target a product by its database ObjectId
	if (reqTarget._id !== undefined) {
		Object.assign(finalTarget, { _id: reqTarget._id });
	}
	// Target a product by its expiration date if the date occurs before a date provided in the "expiringBefore" variable
	if (reqTarget.expiringBefore !== undefined) {
		Object.assign(finalTarget, { expDate: { $lte: new Date(expiringBefore) } });
	}
	// Target a product by its expiration date if the date occurs after a date provided in the "expiringAfter" variable
	if (reqTarget.expiringAfter !== undefined) {
		Object.assign(finalTarget, { expDate: { $gte: new Date(expiringAfter) } });
	}
	// Target a product by its quantity if it is less than a number provided in the "lessThanQuantity" variable
	if (reqTarget.lessThanQuantity !== undefined) {
		Object.assign(finalTarget, { quantity: { $lte: lessThanQuantity } });
	}
	// Target a product by its quantity if it is less than a number provided in the "greaterThanQuantity" variable
	if (reqTarget.greaterThanQuantity !== undefined) {
		Object.assign(finalTarget, { quantity: { $gte: greaterThanQuantity } });
	}
	// Target a product if it is expired(true) or not expired(false) in the Boolean provided in the "expiredOrNot" variable
	if (reqTarget.expiredOrNot !== undefined) {
		Object.assign(finalTarget, { expiredOrNot: reqTarget.expiredOrNot });
	}
	// Target a product by its location (Fridge, Freezer, Pantry)
	if (reqTarget.location !== undefined) {
		Object.assign(finalTarget, { location: reqTarget.location });
	}
	// Target a product by its owner's ObjectId
	if (reqTarget.owner !== undefined) {
		Object.assign(finalTarget, { owner: reqTarget.owner });
	}
	// Target a product by a recipe (FUTURE FEATURE - NOT ACTIVE YET)
	if (reqTarget.recipe !== undefined) {
		Object.assign(finalTarget, { recipes: recipe });
	}
	// Target a product depending on if it was added before a date provided in the "addedBefore" variable.
	if (reqTarget.addedBefore !== undefined) {
		Object.assign(finalTarget, { dateAdded: { $lte: new Date(addedBefore) } });
	}
	// Target a product depending on if it was added after a date provided in the "addedAfter" variable.
	if (reqTarget.addedAfter !== undefined) {
		Object.assign(finalTarget, { dateAdded: { $gte: new Date(addedAfter) } });
	}
	//If the final object does not have any targetting data, then either none was provided or it was not valid.
	if (finalTarget === undefined) {
		console.log("There was no valid target.");
	}
	// Return the final target object that includes all the targetting parameters.
	return finalTarget;
}

//--------------------------------

// Update Product Function
const updateProduct = function(reqTarget, reqUpdate) {
	const finalTarget = targetProduct(reqTarget);  // Create a target object for the update by sending the requested target data through the targetProduct function.
	let finalUpdate = {}; // Establish an object that will be filled with the update parameters.
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
		// If the expiration date is more than seven days away, add the expiration date, a two day warning and a seven day warning.
		if (new Date(reqUpdate.expDate) >= new Date(sevenDays)) {
			console.log('The expiration date is more than seven days away!');
			Object.assign(finalUpdate, {
				expDate: reqUpdate.expDate,
				sevenDayWarning: subtractDays(reqUpdate.expDate, 7),
				twoDayWarning: subtractDays(reqUpdate.expDate, 2),
				expiredOrNot: false
			});
			// If the product is newly expired, increment the amount of expired food in the user's inventory
			if(reqTarget.expiredOrNot === true) {
				updateUser({ _id: reqTarget.owner }, { throwExpired: true });
			};
		// If the expiration date is less than seven days away, but more than two days away, add an expiration date and a two day warning.
		} else if (new Date(reqUpdate.expDate) >= new Date(twoDays)) {
			console.log('The expiration date is less than seven, but more than two days away!');
			Object.assign(finalUpdate, {
				expDate: reqUpdate.expDate,
				sevenDayWarning: null,
				twoDayWarning: subtractDays(reqUpdate.expDate, 2),
				expiredOrNot: false
			});
			// If the product is newly expired, increment the amount of expired food in the user's inventory
			if(reqTarget.expiredOrNot === true) {
				updateUser({ _id: reqTarget.owner }, { throwExpired: true });
			}; 
		// If the expiration date is less than seven days away, but more than two days away, add an expiration date and a two day warning.
		} else if ((new Date(reqUpdate.expDate) <= new Date(twoDays)) && (new Date(reqUpdate.expDate) >= new Date(today))) {
			console.log('The expiration date is less than two days away!');
			Object.assign(finalUpdate, {
				expDate: reqUpdate.expDate,
				sevenDayWarning: null,
				twoDayWarning: null,
				expiredOrNot: false
			});
			// If the product is newly expired, increment the amount of expired food in the user's inventory
			if(reqTarget.expiredOrNot === true) {
				updateUser({ _id: reqTarget.owner }, { throwExpired: true });
			} ;
		// If the expiration date is older than today, then mark the food as expired.
		} else {
			console.log('The expiration date is older than toay!');
			Object.assign(finalUpdate, {
				sevenDayWarning: null,
				twoDayWarning: null,
				expDate: reqUpdate.expDate,
				expiredOrNot: true
			});
			// If the product is newly expired, increment the amount of expired food in the user's inventory
			if(reqTarget.expiredOrNot === false) {
				updateUser({ _id: reqTarget.owner }, { addExpired: true });
			};
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
	// Update a product's list of recipes. A recipe(s) needs to be an array, regardless if there is only one or not.(FUTURE FEATURE - NOT ACTIVE YET)
	if (reqUpdate.newRecipes !== undefined) {
		Object.assign(finalUpdate, {
			$push: { recipes: { $each: reqUpdate.newRecipes } }
		});
	} 
	// Update a product's list of recipes by removing a recipe (Expects ObjectId). Recipes needs to be an array, regardless if there is only one or not.
	if (reqUpdate.removeRecipes !== undefined) {
		Object.assign(finalUpdate, {
			$pullAll: { recipes: { $each: reqUpdate.removeRecipes } }
		});
	} 
	//If the final object does not have any updating data, then either none was provided or it was not valid.
	if (finalUpdate === undefined) {
		console.log("There was no valid update.");
	}
	// Update its lastUpdated date
	const now = Date.now();
	Object.assign(finalUpdate, { lastUpdated: now });
	// Take the target and update objects and feed them to the database call
	Product.findOneAndUpdate(finalTarget, finalUpdate)
		.then(data => {
			console.log(data);
			console.log("Update has been sent to the targeted Product!");
		})
		.catch(err => {
			console.log(
				"We've got a problem. The update to the targeted Product failed!"
			);
		});
}

//--------------------------------

module.exports = {
	targetProduct,
	updateProduct
};