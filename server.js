//Dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const CronJob = require('cron').CronJob;
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

new CronJob('0 0-59 * \* \* \*', function() {
	console.log('You will see this message the first second of every minute');
}, null, true, 'America/Los_Angeles');

//Start server
app.listen(PORT, function() {
	console.log(`🌎  ==> API Server now listening on PORT ${PORT} !`);
});
