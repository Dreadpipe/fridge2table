const db = require('../models');
const axios = require('axios');

const dailyCheck = function() {
console.log('Daily Check');
	db.Product.find({})
    .populate('associatedRecipes')
    .then(response => {
			const allProducts = response;
			const today = Date.now();
			allProducts.forEach( product => {
				if (product.sevenDayWarning !== null && product.sevenDayWarning <= today) {
                    console.log('Seven day warning!');
                    const pushObj = {
                        productname: product.productname,
                        pushToken: product.pushToken,
                        message: 'One of your items is expiring within the week.'
                    }
                    axios.post('/users/push-token', pushObj)
                        .then(response => {
							console.log(response)
						})
						.catch(err => {
							console.log("We ran into a problem sending the seven day warning to the push notification.\n------------------------");
							console.log(err);
						})
					const query = {
						target: {
							product: product._id
						},
						update: {
							remove7DayWarning: true
						}
					}
					axios.put(`http://${process.env.IP_ADDRESS}:3001/updateProduct`, query)
						.then(response => {
							console.log(response)
						})
						.catch(err => {
							console.log("We ran into a problem removing the seven day warning.\n------------------------");
							console.log(err);
						})
				} else if (product.sevenDayWarning === null && product.twoDayWarning !== null && product.twoDayWarning <= today) {
                    const pushObj = {
                        productname: product.productname,
                        pushToken: product.pushToken,
                        message: 'One of your items is expiring within two days!'
                    }
                    axios.post('/users/push-token', pushObj)
                    .then(response => {
                        console.log(response)
                    })
                    .catch(err => {
                        console.log("We ran into a problem sending the two day warning to the push notification.\n------------------------");
                        console.log(err);
                    })
					const query = {
						target: {
							product: product._id
						},
						update: {
							remove2DayWarning: true
						}
					}
					axios.put(`http://${process.env.IP_ADDRESS}:3001/updateProduct`, query)
						.then(response => {
							console.log(response)
						})
						.catch(err => {
							console.log("We ran into a problem removing the two day warning.\n------------------------");
							console.log(err);
						})
				} else if (product.sevenDayWarning === null && product.twoDayWarning === null && product.expDate !== null && product.expDate <= today && product.expiredOrNot === false) {
                    const pushObj = {
                        productname: product.productname,
                        pushToken: product.pushToken,
                        message: 'One of your items has expired!'
                    }
                    axios.post('/users/push-token', pushObj)
                    .then(response => {
                        console.log(response)
                    })
                    .catch(err => {
                        console.log("We ran into a problem sending the food-expired warning to the push notification.\n------------------------");
                        console.log(err);
                    })
					const query = {
						target: {
							product: product._id
						},
						update: {
							expiredOrNot: true
						}
					}
					axios.put(`http://${process.env.IP_ADDRESS}:3001/updateProduct`, query)
						.then(response => {
							console.log(response)
						})
						.catch(err => {
							console.log("We ran into a problem expiring the food.\n------------------------");
							console.log(err);
						})
					const query2 = {
						target: {
							id: product.owner
						},
						update: {
							addExpired: true
						}
					}
					axios.put(`http://${process.env.IP_ADDRESS}:3001/updateUser`, query2)
					.then(response => {
						console.log(response)
					})
					.catch(err => {
						console.log("We ran into a problem updating the user's expired food.\n------------------------");
						console.log(err);
					})
				} else (console.log(`The ${product.productname} isn\'t expiring today or within a week!`));
			})
		})
		.catch(err => {
			console.log("We ran into a problem finding our products.\n------------------------");
			console.log(err);
		})
}

module.exports = dailyCheck;