// Bring in the database models and modular functions
const { GroceryItem } = require("../models");
const { targetUser, updateUser } = require("./userFunctions");

const finishShopping = function(req) {

    GroceryItem.find({ owner: req.owner })
        .then( groceries => {

        })
        .catch(err => {
			console.log(
				"We've got a problem. The update to the targeted grocery item failed!"
			);
		});

}

//Step 1 - Find all items on the grocery list

//Step 2 - For each item, check to see if the amount aquired is equal to or exceeds the amount needed.

//Step 3 - If the amount aquired is 0, ignore the item.

//Step 4a - If the amount aquired is less than the amount needed. Create the amount aquired as a new product.

//Step 4b - Then, update the grocery item with the new amount needed, subtracting the amount aquired.

//Step 5a - If the amount aquired is equal to, or more than the amount needed, create the amount aquired as a new product.

//Step 5b - Then, remove the grocery item.

//Step 5c - Then, remove the grocery item's Object Id from the owner's grocery list array.


module.exports = {
	finishShopping
};