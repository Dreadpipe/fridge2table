/* eslint-disable no-console */
// Establish our Express Dependancy
const express = require('express');

const router = express.Router();

// Bring in the database models
const { GroceryItem, Product, User } = require('../models');

// Bring in the modular functions
const { targetUser, updateUser } = require('./userFunctions');
const { targetProduct, updateProduct } = require('./productFunctions');
const { targetGroceryItem, updateGroceryItem } = require('./groceryFunctions');
const { finishShopping } = require('./finishShopping');
const { addDays, subtractDays } = require('./dateFunctions');

//++++++++++++++++++++++
// All GET Routes Below ------------
//++++++++++++++++++++++

// Check for the health of the database
router.get('/healthCheck', (req, res) => {
  res.send('healthy!');
});

//-------------------------------------

// Find all Users
router.get('/findAllUsers', (req, res) => {
  User.find({})
    .populate('allProduct')
    .populate('inventoryProducts')
    .populate('groceryList')
    .then((data) => {
      res.json(data); // Send the data in the response to the call.
    })
    .catch((err) => {
      console.log('We ran into a problem finding all of our Users.\n------------------------');
      console.log(err);
    });
});

//-------------------------------------

// Find one User
router.get('/findOneUser/:id', (req, res) => {
  User.find({
    thirdPartyId: req.params.id,
  })
    .populate('allProduct')
    .populate('inventoryProducts')
    .populate('groceryList')
    .then((data) => {
      res.json(data); // Send the data in the response to the call.
    })
    .catch((err) => {
      console.log('We ran into a problem finding one of our Users.\n------------------------');
      console.log(err);
    });
});

//-------------------------------------

// Find Product Owner
router.get('/findProductOwner/:id', (req, res) => {
  User.find({
    _id: req.params.id, // Using the item's owner's ObjectId from the database.
  })
    .populate('allProduct')
    .populate('inventoryProducts')
    .then((data) => {
      res.json(data); // Send the data in the response to the call.
    })
    .catch((err) => {
      console.log('We ran into a problem finding one of our Users.\n------------------------');
      console.log(err);
    });
});

//-------------------------------------

// Find all Products
router.get('/findAllProducts', (req, res) => {
  Product.find({})
    .populate('associatedRecipes')
    .then((data) => {
      res.json(data); // Send the data in the response to the call.
    })
    .catch((err) => {
      console.log('We ran into a problem finding all of our Products.\n------------------------');
      console.log(err);
    });
});

//-------------------------------------

// Find one Product
router.get('/findOneProduct/:objid', (req, res) => {
  Product.find({
    _id: req.params.objid, // Using the product's ObjectId in the database.
  })
    .populate('associatedRecipes')
    .then((data) => {
      res.json(data); // Send the data in the response to the call.
    })
    .catch((err) => {
      console.log('We ran into a problem finding one of our Products.\n------------------------');
      console.log(err);
    });
});

//-------------------------------------

// Find all Groceries
router.get('/findAllGroceries', (req, res) => {
  GroceryItem.find({})
    .then((data) => {
      res.json(data); // Send the data in the response to the call.
    })
    .catch((err) => {
      console.log('We ran into a problem finding all of our Groceries.\n------------------------');
      console.log(err);
    });
});

//-------------------------------------

// Find one Grocery Item
router.get('/findOneGroceryItem/:objid', (req, res) => {
  GroceryItem.find({
    _id: req.params.objid, // Using the Grocery Item's ObjectId in the database.
  })
    .then((data) => {
      res.json(data); // Send the data in the response to the call.
    })
    .catch((err) => {
      console.log('We ran into a problem finding one of our Groceries.\n------------------------');
      console.log(err);
    });
});

//++++++++++++++++++++++
// All POST Routes Below ------------
//++++++++++++++++++++++

// Create new User
router.post('/newUser', (req, res) => {
  // Check for existence of user in database
  User.findOne({
    thirdPartyId: req.body.id, // Using the id provided by the login service they are using (third-party id).
  })
    .then((currentUser) => {
      // If the user exists, update them.
      if (currentUser) {
        // Create a target and update object that will be interpreted by the updateUser function.
        const target = {
          id: currentUser.thirdPartyId,
        };
        const update = {
          justLogged: true,
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
          lastUpdated: Date.now(),
        })
          .save() // Save the collection to the Mongo Database
          .then((newUser) => {
            res.json(newUser);
          })
          .catch((err) => {
            console.log('We had a problem creating a new user in the database.\n------------------------');
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log('We had a problem checking to see if the user was already in the database.\n------------------------');
      console.log(err);
    });
});

//-------------------------------------

// Create a new Product
router.post('/newProduct', (req, res) => {
  // Create a new product object using the data in the request.
  const newProduct = {
    productname: req.body.name,
    category: req.body.category,
    foodId: req.body.id,
    pic: req.body.pic,
    location: req.body.location,
    quantity: req.body.quantity,
    dateAdded: Date.now(),
    lastUpdated: Date.now(),
    owner: req.body.userId,
  };
  // If the product has an exp date, add it to the product with dates for warnings.
  if (req.body.expDate) {
    // Establish the dates for today, two days from now and seven days from now.
    const today = Date.now();
    const twoDays = addDays(today, 2);
    const sevenDays = addDays(today, 7);
    // If the exp date > 7 days away, add the exp date, a 2 day warning and a 7 day warning.
    if (new Date(req.body.expDate) >= new Date(sevenDays)) {
      Object.assign(newProduct, {
        expDate: req.body.expDate,
        sevenDayWarning: subtractDays(req.body.expDate, 7),
        twoDayWarning: subtractDays(req.body.expDate, 2),
      });
      // If the exp date is < 7 days away, but > 2 days away, add an exp date and 2 day warning.
    } else if (new Date(req.body.expDate) >= new Date(twoDays)) {
      Object.assign(newProduct, {
        expDate: req.body.expDate,
        sevenDayWarning: null,
        twoDayWarning: subtractDays(req.body.expDate, 2),
      });
      // If the expiration date is less than two days away, add an expiration date only.
    } else if ((new Date(req.body.expDate) <= new Date(twoDays)) 
      && (new Date(req.body.expDate) >= new Date(today))) {
      Object.assign(newProduct, {
        sevenDayWarning: null,
        twoDayWarning: null,
        expDate: req.body.expDate,
      });
      // If the expiration date is already passed, mark the food as expired.
    } else {
      Object.assign(newProduct, {
        sevenDayWarning: null,
        twoDayWarning: null,
        expDate: req.body.expDate,
        expiredOrNot: true,
      });
    }
  }
  // use the newProduct object to create and then save the new product to the Mongo database.
  new Product(newProduct).save().then((newProduct) => {
    // Create a target and update object for a new query to update the user who added the product.
    const target = {
      _id: newProduct.owner,
    };
    const update = {
      brandNewProduct: newProduct.foodId,
      productObjId: newProduct._id,
    };
    // If the product is already expired, increment the amount of expired food in the inventory.
    if (newProduct.expiredOrNot === true) {
      Object.assign(update, { addExpired: true });
    }
    // Send the data to the user so that their array of products includes the new product.
    updateUser(target, update);
    res.json(newProduct);
  })
    .catch((err) => {
      console.log('We had a problem creating a new product in the database.\n------------------------');
      console.log(err);
    });
});


//-------------------------------------

// Create a new Grocery Item
router.post('/newGroceryItem', (req, res) => {
  // Create a new grocery item object using the data in the request.
  const newGroceryItem = {
    productname: req.body.name,
    category: req.body.category,
    location: req.body.location,
    foodId: req.body.id,
    pic: req.body.pic,
    numNeeded: req.body.needed,
    dateAdded: Date.now(),
    lastUpdated: Date.now(),
    owner: req.body.userId,
  };
  // use the newGroceryItem object to create and then save the new product to the Mongo database.
  new GroceryItem(newGroceryItem).save().then((newGroceryItem) => {
    // Create a target and update object for a new query to update the user who added the product.
    const target = {
      _id: newGroceryItem.owner,
    };
    const update = {
      groceryObjId: newGroceryItem._id,
    };
    // Send the data to the user so that their array of groceries includes the new grocery item.
    updateUser(target, update);
    res.json(newGroceryItem);
  })
    .catch((err) => {
      console.log('We had a problem creating a new grocery item in the database.\n------------------------');
      console.log(err);
    });
});

//++++++++++++++++++++++
// All PUT Routes Below ------------
//++++++++++++++++++++++

// Update User
router.put('/updateUser', (req, res) => {
  const reqTarget = req.body.target;
  const reqUpdate = req.body.update;
  updateUser(reqTarget, reqUpdate);
  res.end();
});

//-------------------------------------

// Update Product
router.put('/updateProduct', (req, res) => {
  const reqTarget = req.body.target;
  const reqUpdate = req.body.update;
  updateProduct(reqTarget, reqUpdate);
  res.end();
});

//-------------------------------------

// Update Grocery Item
router.put('/updateGroceryItem', (req, res) => {
  const reqTarget = req.body.target;
  const reqUpdate = req.body.update;
  updateGroceryItem(reqTarget, reqUpdate);
  res.end();
});

// Finish Shopping
router.put('/finishShopping/:ownerid', (req, res) => {
  const grocerListOwner = req.params.ownerid;
  finishShopping(grocerListOwner);
  res.end();
});

//++++++++++++++++++++++
// All DELETE Routes Below ------------
//++++++++++++++++++++++

// Remove User
router.delete('/removeUser', (req, res) => {
  const reqTarget = req.body.target;
  const userId = { owner: req.body.target.id };
  User.deleteOne(targetUser(reqTarget))
    .then((data) => {
      // After deleting the user, delete all products assciated with that user.
      Product.deleteMany(targetProduct({ userId }))
        .then((data) => {
          res.end();
        })
        .catch((err) => {
          console.log("We've got a problem deleting all items associated with the removed user!\n------------------------");
          console.log(err);
        });
      res.end();
    })
    .catch((err) => {
      console.log("We've got a problem deleing the user!\n------------------------");
      console.log(err);
    });
});

//-------------------------------------

// Remove Product
router.post('/removeProduct', (req, res) => {
  const reqTarget = req.body.target;
  const userId = { _id: reqTarget.owner };
  const removeFromUser = { removeThisProduct: [reqTarget._id] };
  console.log(reqTarget);
  if (reqTarget.expiredOrNot === true) {
    Object.assign(removeFromUser, { throwExpired: true });
  }
  // If the response has both the owner's id and product id, delete the item.
  if (reqTarget.owner && reqTarget._id) {
    Product.deleteOne(targetProduct(reqTarget))
      .then((data) => {
        // Remove the item from the owner's inventory of products.
        updateUser(userId, removeFromUser);
        res.end();
      })
      .catch((err) => {
        console.log("We've got a problem deleting the product!");
        console.log(err);
      });
  } else {
    console.log("You need to include the owner's id and the food's id when removing a product!");
  }
});

//-------------------------------------

// Remove Grocery Item
router.post('/removeGroceryItem', (req, res) => {
  const reqTarget = req.body.target;
  console.log(reqTarget);
  const userId = { _id: reqTarget.owner };
  const removeFromUser = { removeThisGrocery: [reqTarget._id] };
  // If the response has both the owner's id and the grocery id, delete the item.
  if (reqTarget.owner && reqTarget._id) {
    GroceryItem.deleteOne(targetGroceryItem(reqTarget))
      .then((data) => {
        // Remove the item from the owner's inventory of products.
        updateUser(userId, removeFromUser);
        res.end();
      })
      .catch((err) => {
        console.log("We've got a problem deleting the grocery item!");
        console.log(err);
      });
  } else {
    console.log("You need to include the owner's id and the food's id when removing a grocery item!");
  }
});

module.exports = {
  router,
  updateProduct,
  updateUser,
};
