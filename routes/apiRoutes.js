//const db = require("../models");
const path = require('path');
const router = require("express").Router();

// API Routes
router.get('/', (req, res) => {
  res.send('Hi!')
});

module.exports = router;
