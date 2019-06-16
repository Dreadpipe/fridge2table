// Establish our Express Dependancy
const express = require('express');
const path = require('path');
const router = express.Router();
const axios = require('axios');

// Bring in the database models
const db = require('../models');

//-------------------------------------

// HealthCheck Route
router.get('/healthCheck', function (req, res) {
    res.send('healthy!');
});

//-------------------------------------

// Create new User
router.post('/newUser', function (req, res) {

});

//-------------------------------------

//Create new Product
router.post('/newProduct', function (req, res) {

});

//-------------------------------------

//Update Product Quantity

//-------------------------------------

//Remove Product

//-------------------------------------

module.exports = router;