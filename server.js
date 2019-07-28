//Dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const CronJob = require('cron').CronJob;
const dailyCheck = require('./cronJobs/expirationCheck');
const routes = require("./routes/routes").router;

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

//Connection options
const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  reconnectTries: 5,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, 
  socketTimeoutMS: 25000
};

// Cron to create open connections, set to every minute.
// new CronJob('0 * * * * *', function() {
//   console.log("\nConnecting to DB");
//   mongoose.disconnect();
//   //Connect to Mongo
//   mongoose
//     .connect(process.env.MONGODB_URI || "mongodb://localhost/fridge2table", options)
//     .catch(function(err) {
//       console.log("We've got a problem with the database!");
//       console.log(err);
//     });
// }, null, true, 'America/Los_Angeles');

// //Connect to Mongo
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fridge2table", options)
.catch(function(err) {
  console.log("We've got a problem with the database!");
  console.log(err);
});

// Cron to disconnect the server, set for every 15 seconds.
// new CronJob('0,15,30,45 * * * * *', function() {
//   console.log("\nDisconnecting from DB")
//   mongoose.disconnect();
// }, null, true, 'America/Los_Angeles');


			//'0 0 0 1-31 * *' = Daily Check.
			//'0 0 0-23 1-31 * *' = Hourly Check.
			//'0,15,30,45 * * * * *' = every 15 seconds
			//'0 * * * * *' = once a minute
new CronJob('0,15,30,45 * * * * *', function() {
	dailyCheck();
}, null, true, 'America/Los_Angeles');

//Start server
app.listen(PORT, function() {
	console.log(`🌎  ==> API Server now listening on PORT ${PORT} !`);
});     
  