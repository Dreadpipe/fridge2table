//Dependencies
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const routes = require("./routes/apiRoutes");

const PORT = process.env.PORT || 3001;
const app = express();

//Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//Static assets
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"))
// }
//Routes
app.use('/', routes);

//Connect to Mongo
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fridge2table", {useNewUrlParser: true});
//Start server
app.listen(PORT, function() {
  console.log("🌎  ==> API Server now listening on PORT " + PORT + "!");
});