require("dotenv").config();
const db = require("../models");
const { Expo } = require("expo-server-sdk");
const updateProduct = require("../routes/routes").updateProduct;
const updateUser = require("../routes/routes").updateUser;

const dailyCheck = function() {
	console.log("\nDaily Check");
	db.Product.find({})
		.populate("associatedRecipes")
		.then(response => {
			const allProducts = response;
			const today = Date.now();
			allProducts.forEach(product => {
				if (
					product.sevenDayWarning !== null &&
					product.sevenDayWarning <= new Date(today)
				) {
					console.log("Seven day warning!");
					db.User.find({
						_id: product.owner
					})
						.populate("allProduct")
						.populate("inventoryProducts")
						.then(data => {
							const pushObj = {
								productname: product.productname,
								pushToken: data[0].pushToken,
								message: "One of your items is expiring within the week."
							};
							SendPushNote(pushObj);
						})
						.catch(err => {
							console.log(
								"We ran into a problem finding a user to send the seven day warning to.\n------------------------"
							);
							//console.log(err);
						});

					updateProduct({ _id: product._id }, { remove7DayWarning: true });
				} else if (
					product.sevenDayWarning === null &&
					product.twoDayWarning !== null &&
					product.twoDayWarning <= new Date(today)
				) {
					db.User.find({
						_id: product.owner
					})
						.populate("allProduct")
						.populate("inventoryProducts")
						.then(data => {
							const pushObj = {
								productname: product.productname,
								pushToken: data[0].pushToken,
								message: "One of your items is expiring within two days."
							};
							SendPushNote(pushObj);
						})
						.catch(err => {
							console.log(
								"We ran into a problem finding a user to send the two day warning to.\n------------------------"
							);
							//console.log(err);
						});

					updateProduct({ _id: product._id }, { remove2DayWarning: true });
				} else if (
					product.sevenDayWarning === null &&
					product.twoDayWarning === null &&
					product.expDate !== null &&
					product.expDate <= new Date(today) &&
					product.expiredOrNot === false
				) {
					db.User.find({
						_id: product.owner
					})
						.populate("allProduct")
						.populate("inventoryProducts")
						.then(data => {
							const pushObj = {
								productname: product.productname,
								pushToken: data[0].pushToken,
								message: "One of your items just expired!"
							};
							SendPushNote(pushObj);
						})
						.catch(err => {
							console.log(
								"We ran into a problem finding a user to send the expiration warning to.\n------------------------"
							);
							//console.log(err);
						});

					updateProduct({ _id: product._id }, { expiredOrNot: true });

					updateUser({ _id: product.owner }, { addExpired: true });
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
			console.log(err);
		});
};

const SendPushNote = obj => {
	// Create a new Expo SDK client
	let expo = new Expo();
	// Create the messages that you want to send to clents
	console.log(obj);
	let messages = [];
	let pushToken = obj.pushToken;
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
			title: "Fridge2Table",
			sound: "default",
			body: obj.message,
			badge: 1,
			data: { expFood: obj.productname }
		});
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
					if (receipt.status === "ok") {
						continue;
					} else if (receipt.status === "error") {
						console.error(
							`There was an error sending a notification: ${receipt.message}`
						);
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
};

module.exports = dailyCheck;
