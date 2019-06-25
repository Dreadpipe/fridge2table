require("dotenv").config();
const db = require("../models");
const axios = require("axios");

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
					axios
						.get(
							`http://${process.env.IP_ADDRESS}:3001/findProductOwner/${
								product.owner
							}`
						)
						.then(response => {
							const pushObj = {
								productname: product.productname,
								pushToken: response.data[0].pushToken,
								message: "One of your items is expiring within the week."
							};
							axios
								.post(
									`http://${process.env.IP_ADDRESS}:3001/users/push-token`,
									pushObj
								)
								.then(response => {
									//console.log(response)
								})
								.catch(err => {
									console.log(
										"We ran into a problem sending the seven day warning to the push notification.\n------------------------"
									);
									// console.log(err);
								});
						})
						.catch(err => {
							console.log(
								"We ran into a problem finding a user to send the seven day warning to.\n------------------------"
							);
							// console.log(err);
						});
					const query = {
						target: {
							_id: product._id
						},
						update: {
							remove7DayWarning: true
						}
					};
					console.log("HERE!!!!! HERE!!!! HERE!!!!!");
					console.log(query);
					axios
						.put(`http://${process.env.IP_ADDRESS}:3001/updateProduct`, query)
						.then(response => {
							// console.log(response.data)
						})
						.catch(err => {
							console.log(
								"We ran into a problem removing the seven day warning.\n------------------------"
							);
							// console.log(err);
						});
				} else if (
					product.sevenDayWarning === null &&
					product.twoDayWarning !== null &&
					product.twoDayWarning <= new Date(today)
				) {
					axios
						.get(
							`http://${process.env.IP_ADDRESS}:3001/findProductOwner/${
								product.owner
							}`
						)
						.then(response => {
							const pushObj = {
								productname: product.productname,
								pushToken: response.data[0].pushToken,
								message: "One of your items is expiring within two days."
							};
							axios
								.post(
									`http://${process.env.IP_ADDRESS}:3001/users/push-token`,
									pushObj
								)
								.then(response => {
									//console.log(response)
								})
								.catch(err => {
									console.log(
										"We ran into a problem sending the two day warning to the push notification.\n------------------------"
									);
									// console.log(err);
								});
						});
					const query = {
						target: {
							_id: product._id
						},
						update: {
							remove2DayWarning: true
						}
					};
					axios
						.put(`http://${process.env.IP_ADDRESS}:3001/updateProduct`, query)
						.then(response => {
							//console.log(response)
						})
						.catch(err => {
							console.log(
								"We ran into a problem removing the two day warning.\n------------------------"
							);
							// console.log(err);
						});
				} else if (
					product.sevenDayWarning === null &&
					product.twoDayWarning === null &&
					product.expDate !== null &&
					product.expDate <= new Date(today) &&
					product.expiredOrNot === false
				) {
					axios
						.get(
							`http://${process.env.IP_ADDRESS}:3001/findProductOwner/${
								product.owner
							}`
						)
						.then(response => {
							const pushObj = {
								productname: product.productname,
								pushToken: response.data[0].pushToken,
								message: "One of your items just expired!"
							};
							axios
								.post(
									`http://${process.env.IP_ADDRESS}:3001/users/push-token`,
									pushObj
								)
								.then(response => {
									//console.log(response)
								})
								.catch(err => {
									console.log(
										"We ran into a problem sending the expiration alert to the push notification.\n------------------------"
									);
									// console.log(err);
								});
						});
					const query = {
						target: {
							_id: product._id
						},
						update: {
							expiredOrNot: true
						}
					};
					axios
						.put(`http://${process.env.IP_ADDRESS}:3001/updateProduct`, query)
						.then(response => {
							//console.log(response)
						})
						.catch(err => {
							console.log(
								"We ran into a problem expiring the food.\n------------------------"
							);
							// console.log(err);
						});
					const query2 = {
						target: {
							id: product.owner
						},
						update: {
							addExpired: true
						}
					};
					axios
						.put(`http://${process.env.IP_ADDRESS}:3001/updateUser`, query2)
						.then(response => {
							//console.log(response)
						})
						.catch(err => {
							console.log(
								"We ran into a problem updating the user's expired food.\n------------------------"
							);
							// console.log(err);
						});
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

module.exports = dailyCheck;
