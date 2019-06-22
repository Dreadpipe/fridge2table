// Establish our Express Dependancy
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Expo } = require("expo-server-sdk");

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
      //console.log(err);
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
      //console.log(err);
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
      //console.log(err);
    });
});

//-------------------------------------

// Find one Product Route
router.get('/findOneProduct/:objid', function (req, res) {
  db.Product.find({
      _id: req.params.objid
    })
    .populate('associatedRecipes')
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log("We ran into a problem finding one of our Products.\n------------------------");
      //console.log(err);
    });
});


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
      //console.log(err);
    });
});

//-------------------------------------

//Create new Product
router.post('/newProduct', function (req, res) {
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
        if (req.body.expDate) {
          Object.assign(newProduct, {
            expDate: req.body.expDate,
            sevenDayWarning: addDays(req.body.expDate, 7),
            twoDayWarning: addDays(req.body.expDate, 2),
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
});

//Request push notification
router.post("/users/push-token", function(req, res) {
  // Create a new Expo SDK client
  let expo = new Expo();
  // Create the messages that you want to send to clents
  console.log(req.body);
  let messages = [];
  let pushToken = req.body.pushToken;
  let somePushTokens = [];
  somePushTokens.push(pushToken);
  for (let pushToken of somePushTokens) {
    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
    // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
    messages.push({
      to: pushToken,
      sound: 'default',
      body: req.body.message,
      data: { foodExp: req.body.name },
    })
  }
  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
      } catch (error) {
        console.error(error);
      }
    }
  })();
  // ...
  // Later, after the Expo push notification service has delivered the
  // notifications to Apple or Google (usually quickly, but allow the the service
  // up to 30 minutes when under load), a "receipt" for each notification is
  // created. The receipts will be available for at least a day; stale receipts
  // are deleted.
  //
  // The ID of each receipt is sent back in the response "ticket" for each
  // notification. In summary, sending a notification produces a ticket, which
  // contains a receipt ID you later use to get the receipt.
  //
  // The receipts may contain error codes to which you must respond. In
  // particular, Apple or Google may block apps that continue to send
  // notifications to devices that have blocked notifications or have uninstalled
  // your app. Expo does not control this policy and sends back the feedback from
  // Apple and Google so you can handle it appropriately.
  let receiptIds = [];
  for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }
  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);

        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        for (let receipt of receipts) {
          if (receipt.status === 'ok') {
            continue;
          } else if (receipt.status === 'error') {
            console.error(`There was an error sending a notification: ${receipt.message}`);
            if (receipt.details && receipt.details.error) {
              // The error codes are listed in the Expo documentation:
              // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
              // You must handle the errors appropriately.
              console.error(`The error code is ${receipt.details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();
  res.status(200).end();
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
router.put('/updateProduct', function (req, res) {
    const reqTarget = req.body.target;
    const reqUpdate = req.body.update;
    updateProduct(reqTarget, reqUpdate);
});

//++++++++++++++++++++++
// All DELETE Routes Below ------------
//++++++++++++++++++++++

//Remove User
router.delete('/removeUser', function (req, res) {
  const reqTarget = req.body.target;
  const userId = { owner: req.body.target.id };
  db.User.deleteOne(targetUser(reqTarget))
    .then(data => {
      db.Product.deleteMany(targetProduct({userId}))
        .then(data => {
          res.end();
        })
        .catch(err => {
          console.log("We've got a problem deleting all items associated with the removed user!")
          //console.log(err);
        });
      res.end();
    })
    .catch(err => {
        console.log("We've got a problem deleing the user!")
        //console.log(err);
    });
});

//-------------------------------------

//Remove Product
router.delete('/removeProduct', function (req, res) {
  const reqTarget = req.body.target;
  const userId = { id: req.body.target.owner };
  const removeFromUser = { removeThisProduct: [req.body.target._id] }
  console.log(`I am removing ${removeFromUser}`)
  if (req.body.target.owner && req.body.target._id) {
    db.Product.deleteOne(targetProduct(reqTarget))
    .then(data => {
      updateUser(userId, removeFromUser);
      res.end();
    })
    .catch(err => {
        console.log("We've got a problem deleing the product!")
        //console.log(err);
    });
  } else {
    console.log('You need to include the owner\'s id and the food\'s id when removing a product!');
  }
});

//++++++++++++++++++++++
// All Modular Functions Below ------------
//++++++++++++++++++++++

// Target User Function
function targetUser (reqTarget) {
  let finalTarget = {};
  switch (true) {
      case (reqTarget.username !== undefined):
          Object.assign(finalTarget, { username: reqTarget.username });
          break;
      case (reqTarget.id !== undefined):
          Object.assign(finalTarget, { thirdPartyId: reqTarget.id });
          break;
      case (reqTarget.token !== undefined):
          Object.assign(finalTarget, { deviceToken: reqTarget.token });
          break;
      case (reqTarget.joinedBefore !== undefined):
          Object.assign(finalTarget, { dateJoined: { $lte: new Date(joinedBefore) } });
          break;
      case (reqTarget.joinedAfter !== undefined):
          Object.assign(finalTarget, { dateJoined: { $gte: new Date(joinedAfter) } });
          break;
      case (reqTarget.lastLoggedBefore !== undefined):
          Object.assign(finalTarget, { lastLogin: { $lte: new Date(lastLoggedBefore) } });
          break;
      case (reqTarget.lastLoggedAfter !== undefined):
          Object.assign(finalTarget, { lastLogin: { $gte: new Date(lastLoggedAfter) } });
          break;
      case (finalTarget === undefined):
          console.log('There was no valid target.');
          break;
      default:
  };
  console.log('The target data will be:');
  console.log(finalTarget);
  return finalTarget;
};

//--------------------------------

// Update User Function
function updateUser (reqTarget, reqUpdate) {
    const finalTarget = targetUser(reqTarget);
    let finalUpdate = {};
    switch (true) {
        case (reqUpdate.username !== undefined):
            Object.assign(finalUpdate, { username: reqUpdate.username });
            break;
        case (reqUpdate.token !== undefined):
            Object.assign(finalUpdate, { deviceToken: reqUpdate.token });
            break;
        case (reqUpdate.pushToken !== undefined):
            Object.assign(finalUpdate, { pushToken: reqUpdate.pushToken });
            break;
        case (reqUpdate.brandNewProduct !== undefined):
            Object.assign(finalUpdate, { $push: { allProducts: reqUpdate.brandNewProduct } });
            break;
        case (reqUpdate.removeThisProduct !== undefined): // removeThisProduct has to be an array.
          Object.assign(finalUpdate, { $pullAll:{ allProducts: reqUpdate.removeThisProduct } });
          break;
        case (reqUpdate.productObjId !== undefined):
            Object.assign(finalUpdate, { $push:{ inventoryProducts: reqUpdate.productObjId } });
            break;
        case (reqUpdate.addExpired !== undefined):
            Object.assign(finalUpdate, { $inc: { expiredFood: 1} });
            break;
        case (reqUpdate.throwExpired !== undefined):
            Object.assign(finalUpdate, { $inc: { expiredFood: -1} });
            break;
        case (reqUpdate.justLogged !== undefined):
            Object.assign(finalUpdate, { lastLogin: Date.now() });
            break;
        case (finalUpdate === undefined):
            console.log('There was no valid update.');
            break;
        default:
    };
    const now = Date.now()
    Object.assign(finalUpdate, {lastUpdated: now});
    console.log('The update data will be:');
    console.log(finalUpdate);
    db.User.findOneAndUpdate(finalTarget, finalUpdate)
        .then(data => {
            console.log(data)
            console.log('Update has been sent to the targeted User!')
        })
        .catch(err => {
            console.log("We've got a problem. The update to the targeted User failed!")
            //console.log(err);
        });
}

//--------------------------------

// Target Product Function
function targetProduct (reqTarget) {
  console.log(reqTarget);
  let finalTarget = {};
  switch (true) {
      case (reqTarget.productname !== undefined):
          Object.assign(finalTarget, { productname: reqTarget.productname });
          break;
      case (reqTarget.foodId !== undefined):
          Object.assign(finalTarget, { foodId: reqTarget.foodId });
          break;
      case (reqTarget._id !== undefined):
          Object.assign(finalTarget, { _id: reqTarget._id });
          break;
      case (reqTarget.expiringBefore !== undefined):
          Object.assign(finalTarget, { expDate: { $lte: new Date(expiringBefore) } });
          break;
      case (reqTarget.expiringAfter !== undefined):
          Object.assign(finalTarget, { expDate: { $gte: new Date(expiringAfter) } });
          break;
      case (reqTarget.lessThanQuantity !== undefined):
          Object.assign(finalTarget, { quantity: { $lte: lessThanQuantity } });
          break;
      case (reqTarget.greaterThanQuantity !== undefined):
          Object.assign(finalTarget, { quantity: { $gte: greaterThanQuantity } });
          break;
      case (reqTarget.expiredOrNot !== undefined):
          Object.assign(finalTarget, { expiredOrNot: expiredOrNot });
          break;
      case (reqTarget.location !== undefined):
          Object.assign(finalTarget, { location: location });
          break;
      case (reqTarget.owner !== undefined):
          Object.assign(finalTarget, { owner: owner });
          break;
      case (reqTarget.recipe !== undefined):
          Object.assign(finalTarget, { recipes: recipe });
          break;
      case (reqTarget.addedBefore !== undefined):
          Object.assign(finalTarget, { dateAdded: { $lte: new Date(addedBefore) } });
          break;
      case (reqTarget.addedAfter !== undefined):
          Object.assign(finalTarget, { dateAdded: { $gte: new Date(addedAfter) } });
          break;
      case (finalTarget === undefined):
          console.log('There was no valid target.');
          break;
      default:
  };
  console.log('The target data will be:');
  console.log(finalTarget);
  return finalTarget;
};

//--------------------------------

// Update Product Function
function updateProduct (reqTarget, reqUpdate) {
    const finalTarget = targetProduct(reqTarget);
    let finalUpdate = {};
    switch (true) {
        case (reqUpdate.productname !== undefined):
            Object.assign(finalUpdate, { productname: reqUpdate.productname });
            break;
        case (reqUpdate.category !== undefined):
            Object.assign(finalUpdate, { category: reqUpdate.category } );
            break;
        case (reqUpdate.expDate !== undefined):
            Object.assign(finalUpdate, { expDate: reqUpdate.expDate } );
            Object.assign(finalUpdate, { sevenDayWarning: addDays(reqUpdate.expDate, 7) } );
            Object.assign(finalUpdate, { twoDayWarning: addDays(reqUpdate.expDate, 2) } );
            break;
        case (reqUpdate.remove7DayWarning !== undefined):
            Object.assign(finalUpdate, { sevenDayWarning: null } );
            break;
        case (reqUpdate.remove2DayWarning !== undefined):
            Object.assign(finalUpdate, { twoDayWarning: null } );
            break;
        case (reqUpdate.expiredOrNot !== undefined):
            Object.assign(finalUpdate, { expiredOrNot: reqUpdate.expiredOrNot });
            break;
        case (reqUpdate.location !== undefined):
            Object.assign(finalUpdate, { location: reqUpdate.location } );
            break;
        case (reqUpdate.quantity !== undefined):
            Object.assign(finalUpdate, { $inc: { quantity: reqUpdate.quantity} });
            break;
        case (reqUpdate.newRecipes !== undefined): //Recipes needs to be an array, regardless if there is only one or not.
            Object.assign(finalUpdate, { $push:{ recipes: { $each: reqUpdate.newRecipes } } });
            break;
        case (reqUpdate.removeRecipes !== undefined): //Recipes needs to be an array, regardless if there is only one or not.
            Object.assign(finalUpdate, { $pullAll:{ recipes: { $each: reqUpdate.removeRecipes } } });
            break;
        case (finalUpdate === undefined):
            console.log('There was no valid update.');
            break;
        default:
    };
    const now = Date.now()
    Object.assign(finalUpdate, {lastUpdated: now});
    console.log('The update data will be:');
    console.log(finalUpdate);
    db.Product.findOneAndUpdate(finalTarget, finalUpdate)
        .then(data => {
            console.log(data)
            console.log('Update has been sent to the targeted Product!')
        })
        .catch(err => {
            console.log("We've got a problem. The update to the targeted Product failed!")
            //console.log(err);
        });
}

//--------------------------------

// Add Days to a Date - based on a function by Joel Coehoorn at Stack Overflow - Source: "https://stackoverflow.com/questions/563406/add-days-to-javascript-date"
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

module.exports = router;