require("dotenv").config();
const { User, Product } = require("../models");
const { Expo } = require("expo-server-sdk");
const { updateProduct } = require("../routes/productFunctions");

// This function is called by the cron job in server.js to check for the expiration status of all food in the database.
// Depending on the results, it triggers push notifications for our users.
const dailyCheck = function() {
	// Find all Products
	Product.find({})
		.populate("associatedRecipes")
		.then(response => {
			const allProducts = response;
			const today = Date.now();
			// Iterate over all of our products and check their date
			allProducts.forEach(product => {
				// If there is a seven day check that hasn't been triggered, and it has passed...
				if (
					product.sevenDayWarning !== null &&
					product.sevenDayWarning <= new Date(today)
				) {
					// Find the item's owner, construct a push object for a seven day warning, and send it into the SendPushNote function
					User.find({
						_id: product.owner
					})
						.populate("allProduct")
						.populate("inventoryProducts")
						.then(data => {
							data[0].pushToken.forEach(token => {
								const pushObj = {
									productname: product.productname,
									pushToken: token,
									message: `Your ${product.productname} is expiring in seven days!`
								};
								SendPushNote(pushObj);
							});
						})
						.catch(err => {
							console.log(
								"We ran into a problem finding a user to send the seven day warning to.\n------------------------"
							);
						});
					// Remove the sent seven-day warning from the item.
					updateProduct({ _id: product._id }, { remove7DayWarning: true });
					// If there is no seven day warning, but there is a remaining two day warning that has passed...
				} else if (
					product.sevenDayWarning === null &&
					product.twoDayWarning !== null &&
					product.twoDayWarning <= new Date(today)
				) {
					// Find the item's owner, construct a push object for a two day warning, and send it into the SendPushNote function
					User.find({
						_id: product.owner
					})
						.populate("allProduct")
						.populate("inventoryProducts")
						.then(data => {
							data[0].pushToken.forEach(token => {
								const pushObj = {
									productname: product.productname,
									pushToken: token,
									message: `Your ${product.productname} is expiring in two days!`
								};
								SendPushNote(pushObj);
							});
						})
						.catch(err => {
							console.log(
								"We ran into a problem finding a user to send the two day warning to.\n------------------------"
							);
						});
					// Remove the sent two-day warning from the item.
					updateProduct({ _id: product._id }, { remove2DayWarning: true });
					// If there are no warnings left to send, and the expiration day has passed...
				} else if (
					product.sevenDayWarning === null &&
					product.twoDayWarning === null &&
					product.expDate !== null &&
					product.expDate <= new Date(today) &&
					product.expiredOrNot === false
				) {
					// Find the item's owner, construct a push object for an expired warning and send it into the SendPushNote function
					User.find({
						_id: product.owner
					})
						.populate("allProduct")
						.populate("inventoryProducts")
						.then(data => {
							data[0].pushToken.forEach(token => {
								const pushObj = {
									productname: product.productname,
									pushToken: token,
									message: `Your ${product.productname} has expired!`
								};
								SendPushNote(pushObj);
							});
						})
						.catch(err => {
							console.log(
								"We ran into a problem finding a user to send the expiration warning to.\n------------------------"
							);
						});
					// Mark the item as expired.
					updateProduct(
						{ _id: product._id, owner: product.owner },
						{ expiredOrNot: true }
					);
				} else if (product.expiredOrNot === true) {
					console.log(`The ${product.productname} is expired!!!`);
				} else {
					console.log(
						`There's not a seven-day, two-day, or expiration warning to send for the ${
							product.productname
						}!`
					);
				}
			});
		})
		.catch(err => {
			console.log(
				"We ran into a problem finding our products.\n------------------------"
			);
		});
};

const SendPushNote = obj => {
	// Create a new Expo SDK client
	let expo = new Expo();
	// Create the messages that you want to send to clents
	console.log(obj);
	// Create an array of messages to send in bulk
	let messages = [];
	//Assign each receive push token to variable.
	let pushToken = obj.pushToken;
	// Create temp array for received push tokens
	let somePushTokens = [];
	//Push received tokes into temp array
	somePushTokens.push(pushToken);
	//Loop through temp array
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
			title: "Fridge2Table",
			sound: "default",
			body: obj.message,
			badge: 1,
			data: { expFood: obj.productname }
		});
	}
	//Chunking together multiple notications to send at once
	let chunks = expo.chunkPushNotifications(messages);
	//Create array for response from each chunk
	let tickets = [];
	(async () => {
		// Send one chunk at a time, which nicely spreads the load out.
		for (let chunk of chunks) {
			try {
				// Assign variable for response from sendPushNotifiationAsync
				let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
				// Console log the response.
				console.log(ticketChunk);
				// Push each response into tickets array.
				tickets.push(...ticketChunk);
			} catch (error) {
				console.error(error);
			}
		}
	})();
	//Wait for response from Apple or Google
	// ...THEN...
	// Create array to hold responses from sendPushNotificationsAsynch
	let receiptIds = [];
	// Loop through each response
	for (let ticket of tickets) {
		// NOTE: Not all tickets have IDs; for example, tickets for notifications
		// that could not be enqueued will have error information and no receipt ID.
		// Check if ticket contains id
		if (ticket.id) {
			//If no error, push ticket.id into response array
			receiptIds.push(ticket.id);
		}
	}
	// Assign variable for response from sending receiptsIds
	let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
	(async () => {
		// Chunk together multiple receiptIds to send at once.
		// Loop through each chunk
		for (let chunk of receiptIdChunks) {
			try {
				// Assign variable for receiptId chunk response
				let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
				// Console log response
				console.log(receipts);
				// The receipts specify whether Apple or Google successfully received the
				// notification and information about an error, if one occurred.
				// Loop through each receipt
				for (let receipt of receipts) {
					//If no error
					if (receipt.status === "ok") {
						//Keep checking receipts
						continue;
						//If receipt contained an error
					} else if (receipt.status === "error") {
						//Message did not send
						console.error(
							`There was an error sending a notification: ${receipt.message}`
						);
						// If error details exists
						if (receipt.details && receipt.details.error) {
							// Print the code to console.
							console.error(`The error code is ${receipt.details.error}`);
						}
					}
				}
				//Catch any external errors and log them.
			} catch (error) {
				console.error(error);
			}
		}
	})();
};

module.exports = dailyCheck;
