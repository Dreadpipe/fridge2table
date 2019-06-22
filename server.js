//Dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const CronJob = require('cron').CronJob;
const db = require('./models');
const axios = require('axios');
const path = require("path");
const routes = require("./routes/routes");

const PORT = process.env.PORT || 3001;
const app = express();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Static assets
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"))
// }

//Routes
app.use("/", routes);

//Connect to Mongo
mongoose
	.connect(process.env.MONGODB_URI || "mongodb://localhost/fridge2table", {
		useNewUrlParser: true
	})
	.catch(function(err) {
		console.log("We've got a problem with the database!");
		console.log(err);
	});

			//'0 0 0 1-31 * *' = Daily Check.
new CronJob('0,15,30,45 * * * * *', function() {
	console.log('Daily Check');
	db.Product.find({})
    .populate('associatedRecipes')
    .then(response => {
			const allProducts = response;
			const today = Date.now();
			allProducts.forEach( product => {
				if (product.sevenDayWarning !== null && product.sevenDayWarning <= today) {
					console.log('Seven day warning!');
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
					console.log('Two day warning!');
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
					console.log('Oh no! Your food has expired!');
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
}, null, true, 'America/Los_Angeles');

//Start server
app.listen(PORT, function() {
	console.log(`🌎  ==> API Server now listening on PORT ${PORT} !`);
});
