//Dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const path = require("path");
const passport = require("passport");
//Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//Static assets
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"))
// }
//Routes
require("./routes/apiRoutes")(app, path);
//Connect to Mongo
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fridge2table", {useNewUrlParser: true});
//Start server
app.listen(PORT, function() {
  console.log("🌎  ==> API Server now listening on PORT " + PORT + "!");
});