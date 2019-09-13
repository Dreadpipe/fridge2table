/* eslint-disable no-console */
/* eslint-disable no-tabs */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const { Expo } = require('expo-server-sdk');
const { User, Product } = require('../models');
const { updateProduct } = require('../routes/productFunctions');

// Generic push object for testing SendPushNote function
// const pushObject = {
//   productname: 'Celery',
//   pushToken: process.env.PUSH_TOKENS.split(' '),
//   message: 'Your Celery is expiring in seven days!',
// };

// Helper Functions

const SendPushNote = (pushObj) => {
  // Create a new Expo SDK client
  const expo = new Expo();
  // Create the messages that you want to send to clents
  console.log('\n', pushObj);
  // Create an array of messages to send in bulk
  const messages = [];
  // Loop through temp array
  pushObj.pushToken.map((pushToken) => {
    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
    }
    // Construct a message object and push to array (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
    messages.push({
      to: pushToken,
      title: 'Fridge2Table',
      sound: 'default',
      body: pushObj.message,
      badge: 1,
      data: { expFood: pushObj.productname },
    });
    console.log('\n', messages);
    return messages;
  });
  // Chunking together multiple notications to send at once
  const chunks = expo.chunkPushNotifications(messages);
  // Create array for response from each chunk
  const tickets = [];
  (async () => {
    // Send one chunk at a time, which nicely spreads the load out.
    // eslint-disable-next-line no-restricted-syntax
    for (const chunk of chunks) {
      try {
        // Assign variable for response from sendPushNotifiationAsync
        // eslint-disable-next-line no-await-in-loop
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        // Console log the response.
        console.log('\n', ticketChunk);
        // Push each response into tickets array.
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();
  // Wait for response from Apple or Google
  // ...THEN...
  // Create array to hold responses from sendPushNotificationsAsynch
  const receiptIds = [];
  // Loop through each response
  tickets.map((ticket) => {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    // Check if ticket contains id
    if (ticket.id) {
      // If no error, push ticket.id into response array
      receiptIds.push(ticket.id);
    }
    return receiptIds;
  });
  // Assign variable for response from sending receiptsIds
  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    // Chunk together multiple receiptIds to send at once.
    // Loop through each chunk
    // eslint-disable-next-line no-restricted-syntax
    for (const chunk of receiptIdChunks) {
      try {
        // Assign variable for receiptId chunk response
        // eslint-disable-next-line no-await-in-loop
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        // Console log response
        console.log('\n', receipts);
        // The receipts specify whether Apple or Google successfully received the notification and information about an error, if one occurred.
        // Loop through each receipt
        // eslint-disable-next-line no-restricted-syntax
        for (const receipt of receipts) {
          // If no error
          if (receipt.status === 'ok') {
            // Keep checking receipts
            // eslint-disable-next-line no-continue
            continue;
            // If receipt contained an error
          } else if (receipt.status === 'error') {
            // Message did not send
            console.error(
              `There was an error sending a notification: ${receipt.message}`,
            );
            // If error details exists
            if (receipt.details && receipt.details.error) {
              // Print the code to console.
              console.error(`The error code is ${receipt.details.error}`);
            }
          }
        }
        // Catch any external errors and log them.
      } catch (error) {
        console.error(error);
      }
    }
  })();
};
// Timeout for testing SendPushNote changes, may use later
// setTimeout(() => SendPushNote(pushObject), 5000);

// Constructs a push notification object and then sends it to SendPushNoth()
function handlePushNotifications(product) {
  const pushObj = {
    productname: product.productname,
    pushToken: product.pushToken,
    message: `Your ${product.productname} is expiring in seven days!`,
  };
  SendPushNote(pushObj);
}

// Find the owner, construct a warning push object and send through SendPushNote()
function handleNotifyUser(warningType) {
  User.find({ _id: product.owner })
    .populate('allProduct')
    .populate('inventoryProducts')
    .then((data) => { handlePushNotifications(data); })
    .catch(() => { console.log(`We ran into a problem finding a user to send the ${warningType} warning to.\n------------------------`); });
}

//--------------------------------------------------------

// Core Logic Function

/* This function is called in server.js to check expirations of all food in the database.
Depending on the results, it triggers push notifications for our users. */
const dailyCheck = () => {
  // Find all Products
  Product.find({})
    .populate('associatedRecipes')
    .then((response) => {
      const allProducts = response;
      const today = Date.now();
      // Iterate over all of our products and check their date
      allProducts.forEach((product) => {
        // If there is a seven day check that hasn't been triggered, and it has passed...
        if (
          product.sevenDayWarning !== null
					&& product.sevenDayWarning <= new Date(today)
        ) {
          handleNotifyUser('seven day');
          // Remove the sent seven-day warning from the item.
          updateProduct({ _id: product._id }, { remove7DayWarning: true });
          // If there is no 7 day warning, but there is a 2 day warning that has passed...
        } else if (
          product.sevenDayWarning === null
					&& product.twoDayWarning !== null
					&& product.twoDayWarning <= new Date(today)
        ) {
          handleNotifyUser('two day');
          // Remove the sent two-day warning from the item.
          updateProduct({ _id: product._id }, { remove2DayWarning: true });
          // If there are no warnings left to send, and the expiration day has passed...
        } else if (
          product.sevenDayWarning === null
					&& product.twoDayWarning === null
					&& product.expDate !== null
					&& product.expDate <= new Date(today)
					&& product.expiredOrNot === false
        ) {
          handleNotifyUser('expiration');
          // Mark the item as expired.
          updateProduct({ _id: product._id, owner: product.owner }, { expiredOrNot: true });
        } else if (product.expiredOrNot === true) {
          console.log(`The ${product.productname} is expired!!!`);
        } else {
          console.log(`There's not a seven-day, two-day, or expiration warning to send for the ${product.productname}!`);
        }
      });
    })
    .catch(() => { console.log('We ran into a problem finding our products.\n------------------------'); });
};


module.exports = dailyCheck;
