/* eslint-disable no-console */
// Dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line prefer-destructuring
const CronJob = require('cron').CronJob;
const dailyCheck = require('./cronJobs/expirationCheck');
const routes = require('./routes/routes').router;

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'))
// }

// Routes
app.use('/', routes);

// Connection options
const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  reconnectTries: 5,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 25000,
};

// //Connect to Mongo
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/fridge2table', options)
  .catch((err) => {
    console.log("We've got a problem with the database!");
    console.log(err);
  });


// '0 0 0 1-31 * *' = Daily Check.
// '0 0 0-23 1-31 * *' = Hourly Check.
// '0,15,30,45 * * * * *' = every 15 seconds
// '0 * * * * *' = once a minute
// eslint-disable-next-line no-new
new CronJob('0 0 0-23 1-31 * *', () => {
  dailyCheck();
}, null, true, 'America/Los_Angeles');

// Start server
app.listen(PORT, () => {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT} !`);
});
