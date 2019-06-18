// Establish our Express Dependancy
const express = require('express');
const path = require('path');
const router = express.Router();
const axios = require('axios');

// Bring in the database models
const db = require('../models');
const {
  User
} = db;
const {
  Product
} = db;

//++++++++++++++++++++++
// All GET Routes Below ------------
//++++++++++++++++++++++

// HealthCheck Route
router.get('/healthCheck', function (req, res) {
  res.send('healthy!');
});

//-------------------------------------

// Find all Users Route
router.get('/findAllUsers', function (req, res) {
  db.User.find({})
    .populate('allProduct')
    .populate('currentInventory')
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log("We ran into a problem finding all of our Users.\n------------------------");
      console.log(err);
    });
});

//-------------------------------------

// Find one User Route
router.get('/findOneUser/:id', function (req, res) {
  db.User.find({
      thirdPartyId: req.params.id
    })
    .populate('allProduct')
    .populate('currentInventory')
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log("We ran into a problem finding one of our Users.\n------------------------");
      console.log(err);
    });
});

//-------------------------------------

// Find all Products Route
router.get('/findAllProducts', function (req, res) {
  db.Product.find({})
    .populate('associatedRecipes')
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log("We ran into a problem finding all of our Products.\n------------------------");
      console.log(err);
    });
});

//-------------------------------------

//++++++++++++++++++++++
// All POST Routes Below ------------
//++++++++++++++++++++++

// Create new User
router.post('/newUser', function (req, res) {
  console.log(req.body)
  // Check for existence of user in database
  db.User.findOne({
      thirdPartyId: req.body.id
    }).then((currentUser) => {
      if (currentUser) {
        const target = {
          thirdPartyId: currentUser.id
        };
        const update = {
          justLogged: true
        }
        updateUser(target, update);
        // User already registered
        res.json(currentUser);
        console.log(`Existing User is: \n${currentUser}`);
      } else {
        // Create user
        new User({
            username: req.body.name,
            thirdPartyId: req.body.id,
            lastLogin: Date.now(),
            dateJoined: Date.now(),
            lastUpdated: Date.now()
          })
          .save()
          .then((newUser) => {
            console.log(`User added! \nDetails: ${newUser}`);
            res.json(newUser);
          });
      }
    })
    .catch(err => {
      console.log("We had a problem creating a new user in the database.\n------------------------")
      console.log(err);
    });
});

//-------------------------------------

//Create new Product
router.post('/newProduct', function (req, res) {
  console.log(req.body)
  // Check for existence of user in database
  db.Product.findOne({
      foodId: req.body.id
    })
    .populate('associatedRecipes')
    .then(data => {
      if (data) {
        // Product already exists
        res.send(data);
      } else {
        let newProduct = {
          productname: req.body.name,
          category: req.body.category,
          foodId: req.body.id,
          location: req.body.location,
          quantity: req.body.quantity,
          dateAdded: Date.now(),
          lastUpdated: Date.now(),
          owner: req.body.userId
        };
        if (req.body.expDate) {
          Object.assign(newProduct, {
            expDate: req.body.expDate
          })
        }
        new Product(newProduct)
          .save()
          .then((newProduct) => {
            console.log(`Product added! \nDetails: ${newProduct}`);
            const target = {
              id: newProduct.owner
            };
            const update = {
              brandNewProduct: newProduct.foodId,
              productObjId: newProduct._id
            };
            updateUser(target, update);
          });
      }
    })
    .catch(err => {
      console.log("We had a problem creating a new product in the database.\n------------------------")
      console.log(err);
    });
});


//++++++++++++++++++++++
// All PUT Routes Below ------------
//++++++++++++++++++++++

//Update User
router.put('/updateUser', function (req, res) {
  const reqTarget = req.body.target;
  const reqUpdate = req.body.update;
  updateUser(reqTarget, reqUpdate);
});

//-------------------------------------

//Update Product

//-------------------------------------


//++++++++++++++++++++++
// All DELETE Routes Below ------------
//++++++++++++++++++++++

//Remove Product

//-------------------------------------

function updateUser(reqTarget, reqUpdate) {
  let finalTarget = {};
  let finalUpdate = {};
  switch (true) {
    case (reqTarget.username !== undefined):
      Object.assign(finalTarget, {
        username: reqTarget.username
      });
      break;
    case (reqTarget.id !== undefined):
      console.log(reqTarget)
      Object.assign(finalTarget, {
        thirdPartyId: reqTarget.id
      });
      console.log(finalTarget)
      break;
    case (reqTarget.joinedBefore !== undefined):
      Object.assign(finalTarget, {
        dateJoined: {
          $lte: new Date(joinedBefore)
        }
      });
      break;
    case (reqTarget.joinedAfter !== undefined):
      Object.assign(finalTarget, {
        dateJoined: {
          $gte: new Date(joinedAfter)
        }
      });
      break;
    case (reqTarget.lastLoggedBefore !== undefined):
      Object.assign(finalTarget, {
        lastLogin: {
          $lte: new Date(lastLoggedBefore)
        }
      });
      break;
    case (reqTarget.lastLoggedAfter !== undefined):
      Object.assign(finalTarget, {
        lastLogin: {
          $gte: new Date(lastLoggedAfter)
        }
      });
      break;
    case (finalTarget === undefined):
      console.log('There was no valid target.');
      break;
    default:
  };
  console.log('The target data will be:');
  console.log(finalTarget);
  switch (true) {
    case (reqUpdate.username !== undefined):
      Object.assign(finalUpdate, {
        username: reqUpdate.username
      });
      break;
    case (reqUpdate.brandNewProduct !== undefined):
      Object.assign(finalUpdate, {
        $push: {
          allProducts: reqUpdate.brandNewProduct
        }
      });
      break;
    case (reqUpdate.productObjId !== undefined):
      Object.assign(finalUpdate, {
        $push: {
          inventoryProducts: reqUpdate.productObjId
        }
      });
      break;
    case (reqUpdate.addExpired !== undefined):
      Object.assign(finalUpdate, {
        $inc: {
          expiredFood: 1
        }
      });
      break;
    case (reqUpdate.throwExpired !== undefined):
      Object.assign(finalUpdate, {
        $inc: {
          expiredFood: -1
        }
      });
      break;
    case (reqUpdate.justLogged !== undefined):
      Object.assign(finalUpdate, {
        lastLogin: Date.now()
      });
      break;
    case (finalUpdate === undefined):
      console.log('There was no valid update.');
      break;
    default:
  };
  const now = Date.now()
  Object.assign(finalUpdate, {
    lastUpdated: now
  });
  console.log('The update data will be:');
  console.log(finalUpdate);
  db.User.findOneAndUpdate(finalTarget, finalUpdate)
    .then(data => {
      console.log(data)
      console.log('Update has been sent to the targeted User!')
    })
    .catch(err => {
      console.log("We've got a problem. The update to the targeted User failed!")
      console.log(err);
    });
}

module.exports = router;