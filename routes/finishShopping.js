// Bring in the database models and modular functions
const { GroceryItem, Product, User } = require("../models");
const { updateGroceryItem } = require("./groceryFunctions");
const { targetUser, updateUser } = require("./userFunctions");

// This function is called when the "Finish Shopping Button" is clicked.
const finishShopping = function(targetOwner) {
    // Find all items on the grocery list
    GroceryItem.find({ owner: targetOwner})
        .then(data => {
			console.log(data)
			const allGroceries = data;
			//For each item, check to see if the amount aquired is equal to or exceeds the amount needed...
			allGroceries.forEach(grocery => {
				console.log(grocery);
				//If the amount aquired isn't 0, and if the amount aquired is less than the amount needed...
				if (grocery.numGot !== 0 && (grocery.numGot < grocery.numNeeded)) {
					// Create the amount aquired as a new product.
					createNewProduct(grocery);
					// Then, update the grocery item with the new amount needed, subtracting the amount aquired.
					const targetGrocery = {
						_id: grocery._id
					}
					const groceryUpdate = {
						numGot: 0,
						numNeeded: parseFloat(grocery.numNeeded - grocery.numGot)
					}
					updateGroceryItem(targetGrocery, groceryUpdate);
				// If the amount aquired is not zero and equal to, or more than the amount needed
				} else if (grocery.numGot !== 0 && (grocery.numGot >= grocery.numNeeded)) {
					// ...then create the amount aquired as a new product.
					createNewProduct(grocery);
					// Then, remove the grocery item.
					deleteGroceryItem(grocery);
				} else {
					console.log("You didn't actually get any of this grocery item. What do you take me for, exactly? Am I a joke to you?")
				}
			})
        })
        .catch(err => {
			console.log(
				"We've got a problem. We couldn't find the targeted grocery items!"
			);
		});
}

// new product function
const createNewProduct = function(grocery) {
	// Create a new product object using the data from the grocery item.
	let newProduct = {
		productname: grocery.productname,
		category: grocery.category,
		foodId: grocery.foodId,
		pic: grocery.pic,
		location: grocery.location,
		quantity: grocery.numGot,
		dateAdded: Date.now(),
		lastUpdated: Date.now(),
		owner: grocery.owner
	};
	// If the new product has an expiration date, add it to the product as well as dates for expiration warnings.
	if (grocery.expDate) {
		// Establish the dates for today, two days from now and seven days from now.
		const today = Date.now();
		const twoDays = addDays(today, 2);
		const sevenDays = addDays(today, 7);
		// If the expiration date is more than seven days away, add the expiration date, a two day warning and a seven day warning.
		if (new Date(grocery.expDate) >= new Date(sevenDays)) {
			Object.assign(newProduct, {
				expDate: grocery.expDate,
				sevenDayWarning: subtractDays(grocery.expDate, 7),
				twoDayWarning: subtractDays(grocery.expDate, 2)
			});
		// If the expiration date is less than seven days away, but more than two days away, add an expiration date and a two day warning.
		} else if (new Date(grocery.expDate) >= new Date(twoDays)) {
			Object.assign(newProduct, {
				expDate: grocery.expDate,
				sevenDayWarning: null,
				twoDayWarning: subtractDays(grocery.expDate, 2)
			});
		// If the expiration date is less than two days away, add an expiration date only.
		} else if ((new Date(grocery.expDate) <= new Date(twoDays)) && (new Date(grocery.expDate) >= new Date(today))) {
			Object.assign(newProduct, {
				sevenDayWarning: null,
				twoDayWarning: null,
				expDate: grocery.expDate
			});
		// If the expiration date is already passed, mark the food as expired.
		} else {
			Object.assign(newProduct, {
				sevenDayWarning: null,
				twoDayWarning: null,
				expDate: grocery.expDate,
				expiredOrNot: true
			});
		}
	}
	// use the newProduct object to create and then save the new product to the Mongo database.
	new Product(newProduct).save().then(newProduct => {
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
		// Send the data to the user so that their array of products includes the new product.
		updateUser(target, update);
	})
	.catch(err => {
		console.log(
			"We had a problem creating a new product in the database.\n------------------------"
		);
	});
}

// Delete grocery function
const deleteGroceryItem = function(grocery) {
	const reqTarget = grocery;
	const userId = { _id: reqTarget.owner };
	let removeFromUser = { removeThisGrocery: [reqTarget._id] };
	// If the response has both the product's owner's id, and the grocery id, proceed with deleting the item.
	if (reqTarget.owner && reqTarget._id) {
		GroceryItem.deleteOne(targetGroceryItem(reqTarget))
			.then(data => {
				// Remove the item from the owner's inventory of products.
				updateUser(userId, removeFromUser);
				res.end();
			})
			.catch(err => {
				console.log("We've got a problem deleting the grocery item!");
			});
	} else {
		console.log(
			"You need to include the owner's id and the food's id when removing a grocery item!"
		);
	}
}

module.exports = {
	finishShopping
};