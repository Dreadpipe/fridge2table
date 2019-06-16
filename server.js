//Dependencies
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const passportSetup = require('./config/passport');
const routes = require("./routes/routes");
const authRoutes = require('./routes/authRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

//Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//Static assets
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"))
// }

//Routes
app.use('/', routes);
app.use('/auth', authRoutes);

//Connect to Mongo
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fridge2table", {useNewUrlParser: true}).catch(function (err) {
  console.log("We've got a problem with the database!")
  console.log(err);
});
//Start server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT} !`);
});