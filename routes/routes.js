// Establish our Express Dependancy
const express = require("express");
const router = express.Router();

// Bring in the database models
const { User, Product } = require("../models");

//++++++++++++++++++++++
// All GET Routes Below ------------
//++++++++++++++++++++++

// Check for the health of the database
router.get("/healthCheck", function(req, res) {
	res.send("healthy!");
});

//-------------------------------------

// Find all Users
router.get("/findAllUsers", function(req, res) {
	User.find({})
		.populate("allProduct")
		.populate("currentInventory")
		.then(data => {
			res.json(data); // Send the data in the response to the call.
		})
		.catch(err => {
			console.log(
				"We ran into a problem finding all of our Users.\n------------------------"
			);
		});
});

//-------------------------------------

// Find one User
router.get("/findOneUser/:id", function(req, res) {
	User.find({
		thirdPartyId: req.params.id
	})
		.populate("allProduct")
		.populate("inventoryProducts")
		.then(data => {
			res.json(data); // Send the data in the response to the call.
		})
		.catch(err => {
			console.log(
				"We ran into a problem finding one of our Users.\n------------------------"
			);
		});
});

//-------------------------------------

// Find Product Owner
router.get("/findProductOwner/:id", function(req, res) {
	User.find({
		_id: req.params.id //Using the item's owner's ObjectId from the database.
	})
		.populate("allProduct")
		.populate("inventoryProducts")
		.then(data => {
			res.json(data); // Send the data in the response to the call.
		})
		.catch(err => {
			console.log(
				"We ran into a problem finding one of our Users.\n------------------------"
			);
		});
});

//-------------------------------------

// Find all Products
router.get("/findAllProducts", function(req, res) {
	Product.find({})
		.populate("associatedRecipes")
		.then(data => {
			res.json(data); // Send the data in the response to the call.
		})
		.catch(err => {
			console.log(
				"We ran into a problem finding all of our Products.\n------------------------"
			);
		});
});

//-------------------------------------

// Find one Product
router.get("/findOneProduct/:objid", function(req, res) {
	Product.find({
		_id: req.params.objid // Using the product's ObjectId in the database.
	})
		.populate("associatedRecipes")
		.then(data => {
			res.json(data); // Send the data in the response to the call.
		})
		.catch(err => {
			console.log(
				"We ran into a problem finding one of our Products.\n------------------------"
			);
		});
});

//++++++++++++++++++++++
// All POST Routes Below ------------
//++++++++++++++++++++++

// Create new User
router.post("/newUser", function(req, res) {
	console.log(req.body); // REMOVE FOR FINAL DEPLOYMENT
	// Check for existence of user in database
	User.findOne({
		thirdPartyId: req.body.id // Using the id provided by the login service they are using (third-party id).
	})
		.then(currentUser => {
			// If the user exists, update them.
			if (currentUser) { 
				//Create a target and update object that will be interpreted by the updateUser function.
				const target = {
					id: currentUser.thirdPartyId 
				};
				const update = {
					justLogged: true 
				};
				// Send the target object and update object into the updateUser function.
				updateUser(target, update); 
				res.json(currentUser); // Notify in the response data that the user already registered.
				console.log(`Existing User is: \n${currentUser}`); // REMOVE FOR FINAL DEPLOYMENT
			} else {
				// If the user doesn't exist, create them as a collection.
				new User({
					username: req.body.name,
					thirdPartyId: req.body.id,
					lastLogin: Date.now(),
					dateJoined: Date.now(),
					lastUpdated: Date.now()
				})
					.save() // Save the collection to the Mongo Database
					.then(newUser => {
						console.log(`User added! \nDetails: ${newUser}`); // REMOVE FOR FINAL DEPLOYMENT
						res.json(newUser);
					})
					.catch(err => {
						console.log(
							"We had a problem creating a new user in the database.\n------------------------"
						);
					});
			}
		})
		.catch(err => {
			console.log(
				"We had a problem checking to see if the user was already in the database.\n------------------------"
			);
		});
});

//-------------------------------------

//Create a new Product
router.post("/newProduct", function(req, res) {
	// Create a new product object using the data in the request.
	let newProduct = {
		productname: req.body.name,
		category: req.body.category,
		foodId: req.body.id,
		pic: req.body.pic,
		location: req.body.location,
		quantity: req.body.quantity,
		dateAdded: Date.now(),
		lastUpdated: Date.now(),
		owner: req.body.userId
	};
	// If the new product has an expiration date, add it to the product as well as dates for expiration warnings.
	if (req.body.expDate) {
		// Establish the dates for today, two days from now and seven days from now.
		const today = Date.now();
		const twoDays = addDays(today, 2);
		const sevenDays = addDays(today, 7);
		// If the expiration date is more than seven days away, add the expiration date, a two day warning and a seven day warning.
		if (new Date(req.body.expDate) >= new Date(sevenDays)) {
			Object.assign(newProduct, {
				expDate: req.body.expDate,
				sevenDayWarning: subtractDays(req.body.expDate, 7),
				twoDayWarning: subtractDays(req.body.expDate, 2)
			});
		// If the expiration date is less than seven days away, but more than two days away, add an expiration date and a two day warning.
		} else if (new Date(req.body.expDate) >= new Date(twoDays)) {
			Object.assign(newProduct, {
				expDate: req.body.expDate,
				sevenDayWarning: null,
				twoDayWarning: subtractDays(req.body.expDate, 2)
			});
		// If the expiration date is less than two days away, add an expiration date only.
		} else if ((new Date(req.body.expDate) <= new Date(twoDays)) && (new Date(req.body.expDate) >= new Date(today))) {
			Object.assign(newProduct, {
				sevenDayWarning: null,
				twoDayWarning: null,
				expDate: req.body.expDate
			});
		// If the expiration date is already passed, mark the food as expired.
		} else {
			Object.assign(newProduct, {
				sevenDayWarning: null,
				twoDayWarning: null,
				expDate: req.body.expDate,
				expiredOrNot: true
			});
		}
	}
	// use the newProduct object to create and then save the new product to the Mongo database.
	new Product(newProduct).save().then(newProduct => {
		console.log(`Product added! \nDetails: ${newProduct}`); // REMOVE FOR FINAL DEPLOYMENT
		//Create a target and update object for a new query to update the user who added the product.
		const target = {
			_id: newProduct.owner
		};
		let update = {
			brandNewProduct: newProduct.foodId,
			productObjId: newProduct._id
		};
		// If the new product is already expired, increment the amount of expired food in the user's inventory
		if(newProduct.expiredOrNot === true) {
			Object.assign(update, { addExpired: true })
		}
		console.log(update); // REMOVE FOR FINAL DEPLOYMENT
		// Send the data to the user so that their array of products includes the new product.
		updateUser(target, update);
		res.json(newProduct);
	})
	.catch(err => {
		console.log(
			"We had a problem creating a new product in the database.\n------------------------"
		);
	});
});

//++++++++++++++++++++++
// All PUT Routes Below ------------
//++++++++++++++++++++++

//Update User
router.put("/updateUser", function(req, res) {
	const reqTarget = req.body.target;
	const reqUpdate = req.body.update;
	updateUser(reqTarget, reqUpdate);
	res.end();
});

//-------------------------------------

//Update Product
router.put("/updateProduct", function(req, res) {
	const reqTarget = req.body.target;
	const reqUpdate = req.body.update;
	updateProduct(reqTarget, reqUpdate);
	res.end();
});

//++++++++++++++++++++++
// All DELETE Routes Below ------------
//++++++++++++++++++++++

//Remove User
router.delete("/removeUser", function(req, res) {
	const reqTarget = req.body.target;
	const userId = { owner: req.body.target.id };
	User.deleteOne(targetUser(reqTarget))
		.then(data => {
			// After deleting the user, delete all products assciated with that user.
			Product.deleteMany(targetProduct({ userId }))
				.then(data => {
					res.end();
				})
				.catch(err => {
					console.log(
						"We've got a problem deleting all items associated with the removed user!"
					);
				});
			res.end();
		})
		.catch(err => {
			console.log("We've got a problem deleing the user!");
		});
});

//-------------------------------------

//Remove Product
router.post("/removeProduct", function(req, res) {
	const reqTarget = req.body.target;
	const userId = { _id: reqTarget.owner };
	let removeFromUser = { removeThisProduct: [reqTarget._id] };
	console.log(reqTarget);
	if (reqTarget.expiredOrNot === true) {
		Object.assign(removeFromUser, { throwExpired: true })
	};
	console.log('I am removing\n'); // REMOVE FOR FINAL DEPLOYMENT
	console.log(removeFromUser) // REMOVE FOR FINAL DEPLOYMENT
	// If the response has both the product's owner's id, and the product id, proceed with deleting the item.
	if (reqTarget.owner && reqTarget._id) {
		Product.deleteOne(targetProduct(reqTarget))
			.then(data => {
				// Remove the item from the owner's inventory of products.
				updateUser(userId, removeFromUser);
				res.end();
			})
			.catch(err => {
				console.log("We've got a problem deleting the product!");
			});
	} else {
		console.log(
			"You need to include the owner's id and the food's id when removing a product!"
		);
	}
});

//++++++++++++++++++++++
// All Modular Functions Below ------------
//++++++++++++++++++++++

// Target User
function targetUser(reqTarget) {
	let finalTarget = {}; // Establish an object that will be filled with the targeting parameters.
	// If any of the following parameters exist, add them to the target object.
	//Target a user by their username
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
	// Target a user depending on if they joined before a date provided in the "joinedBefore" variable.
	if (reqTarget.joinedBefore !== undefined) {
		Object.assign(finalTarget, {
			dateJoined: { $lte: new Date(joinedBefore) }
		});
	}
	// Target a user depending on if they joined after a date provided in the "joinedAfter" variable.
	if (reqTarget.joinedAfter !== undefined) {
		Object.assign(finalTarget, { dateJoined: { $gte: new Date(joinedAfter) } });
	}
	// Target a user depending on if they logged in before a date provided in the "lastLoggedBefore" variable.
	if (reqTarget.lastLoggedBefore !== undefined) {
		Object.assign(finalTarget, {
			lastLogin: { $lte: new Date(lastLoggedBefore) }
		});
	}
	// Target a user depending on if they logged in after a date provided in the "lastLoggedAfter" variable.
	if (reqTarget.lastLoggedAfter !== undefined) {
		Object.assign(finalTarget, {
			lastLogin: { $gte: new Date(lastLoggedAfter) }
		});
	}
	//If the final object does not have any targetting data, then either none was provided or it was not valid.
	if (finalTarget === undefined) {
		console.log("There was no valid target.");
	}
	console.log("The target data will be:"); // REMOVE FOR FINAL DEPLOYMENT
	console.log(finalTarget); // REMOVE FOR FINAL DEPLOYMENT
	// Return the final target object that includes all the targetting parameters.
	return finalTarget;
}

//--------------------------------

// Update User Function
function updateUser(reqTarget, reqUpdate) {
	console.log(reqTarget)
	const finalTarget = targetUser(reqTarget); // Create a target object for the update by sending the requested target data through the targetUser function.
	let finalUpdate = {}; // Establish an object that will be filled with the update parameters.
	// If any of the following parameters exist, add them to the update object.
	// Update their username
	if (reqUpdate.username !== undefined) {
		Object.assign(finalUpdate, { username: reqUpdate.username });
	}
	// Update their push token for notifications
	if (reqUpdate.pushToken !== undefined) {
		Object.assign(finalUpdate, { pushToken: reqUpdate.pushToken });
	}
	// Update their list of all Edamam scanned foods
	if (reqUpdate.brandNewProduct !== undefined) {
		Object.assign(finalUpdate, {
			$push: { allProducts: reqUpdate.brandNewProduct }
		});
	}
	// Update their inventory by adding a new product's ObjectId
	if (reqUpdate.productObjId !== undefined) {
		Object.assign(finalUpdate, {
			$push: { inventoryProducts: reqUpdate.productObjId }
		});
	}
	// Update their inventory by removing the product's ObjectId (which must be nested in an array).
	if (reqUpdate.removeThisProduct !== undefined) {
		Object.assign(finalUpdate, {
			$pullAll: { inventoryProducts: reqUpdate.removeThisProduct }
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
		console.log(Date.now())
		Object.assign(finalUpdate, { lastLogin: Date.now() });
	}
	//If the final object does not have any updating data, then either none was provided or it was not valid.
	if (finalUpdate === undefined) {
		console.log("There was no valid update.");
	}
	// Update their lastUpdated date
	const now = Date.now();
	Object.assign(finalUpdate, { lastUpdated: now });
	console.log("The update data will be:"); // REMOVE FOR FINAL DEPLOYMENT
	console.log(finalUpdate); // REMOVE FOR FINAL DEPLOYMENT
	// Take the target and update objects and feed them to the database call
	User.findOneAndUpdate(finalTarget, finalUpdate)
		.then(data => {
			console.log(data); // REMOVE FOR FINAL DEPLOYMENT
			console.log("Update has been sent to the targeted User!");
		})
		.catch(err => {
			console.log(
				"We've got a problem. The update to the targeted User failed!"
			);
		});
}

//--------------------------------

// Target Product Function
function targetProduct(reqTarget) {
	console.log(reqTarget); // REMOVE FOR FINAL DEPLOYMENT
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
	console.log("The target data will be:"); // REMOVE FOR FINAL DEPLOYMENT
	console.log(finalTarget); // REMOVE FOR FINAL DEPLOYMENT
	// Return the final target object that includes all the targetting parameters.
	return finalTarget;
}

//--------------------------------

// Update Product Function
function updateProduct(reqTarget, reqUpdate) {
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
			Object.assign(finalUpdate, {
				expDate: reqUpdate.expDate,
				sevenDayWarning: subtractDays(reqUpdate.expDate, 7),
				twoDayWarning: subtractDays(reqUpdate.expDate, 2)
			});
		// If the expiration date is less than seven days away, but more than two days away, add an expiration date and a two day warning.
		} else if (new Date(reqUpdate.expDate) >= new Date(twoDays)) {
			Object.assign(finalUpdate, {
				expDate: reqUpdate.expDate,
				sevenDayWarning: null,
				twoDayWarning: subtractDays(reqUpdate.expDate, 2)
			});
		// If the expiration date is less than two days away, add an expiration date only.
		} else {
			Object.assign(finalUpdate, {
				sevenDayWarning: null,
				twoDayWarning: null,
				expDate: reqUpdate.expDate
			});
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
	if (reqUpdate.expiredOrNot !== undefined) {
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
	console.log("The update data will be:"); // REMOVE FOR FINAL DEPLOYMENT
	console.log(finalUpdate); // REMOVE FOR FINAL DEPLOYMENT
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

// Add Days to a Date - based on a function by Joel Coehoorn at Stack Overflow - Source: "https://stackoverflow.com/questions/563406/add-days-to-javascript-date"
function addDays(date, days) {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

// Subtract Days from a Date
function subtractDays(date, days) {
	const result = new Date(date);
	result.setDate(result.getDate() - days);
	return result;
}

module.exports = {
	router,
	updateProduct,
	updateUser
};
