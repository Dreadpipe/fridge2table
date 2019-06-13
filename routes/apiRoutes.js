//const db = require("../models");

module.exports = (app, path) => {
  //Tester route for express routing, will not stay when adding react
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
  });
};