// Establish our Express Dependancy
const express = require("express");
const router = express.Router();

// Bring in the database models
const { User, Product } = require("../models");

//Bring in the modular functions
const { targetUser, updateUser } = require("./userFunctions");
const { targetProduct, updateProduct } = require("./productFunctions");
const { addDays, subtractDays } = require("./dateFunctions");

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

module.exports = {
	router,
	updateProduct,
	updateUser
};