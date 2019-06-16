// Establish our Express Dependancy
const express = require('express');
const path = require('path');
const router = express.Router();
const axios = require('axios');

// Bring in the database models
const db = require('../models');
const { User } = db;

//++++++++++++++++++++++
// All GET Routes Below ------------
//++++++++++++++++++++++

// HealthCheck Route
router.get('/healthCheck', function (req, res) {
    res.send('healthy!');
});

//-------------------------------------

// Find all Users Route
router.get('/findAllUsers', function (req, res) {
    db.User.find({})
        .populate('allProduct')
        .populate('currentInventory')
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log("We ran into a problem finding all of our Users.\n------------------------");
            console.log(err);
        });
});

//-------------------------------------

// Find one User Route
router.get('/findOneUser', function (req, res) {
    db.User.find({
        thirdPartyId: req.body.id
    })
        .populate('allProduct')
        .populate('currentInventory')
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log("We ran into a problem finding one of our Users.\n------------------------");
            console.log(err);
        });
});

//-------------------------------------

// Find all Products Route
router.get('/findAllProducts', function (req, res) {
    db.User.find({})
        .populate('associatedRecipes')
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log("We ran into a problem finding all of our Products.\n------------------------");
            console.log(err);
        });
});

//-------------------------------------

//++++++++++++++++++++++
// All POST Routes Below ------------
//++++++++++++++++++++++

// Create new User
router.post('/newUser', function (req, res) {
    console.log(req.body)
    // Check for existence of user in database
    db.User.findOne({
        thirdPartyId: req.body.id
    }).then((currentUser) => {
        if (currentUser) {
            // User already registered
            res.send('User already exists!');
            console.log(`Existing User is: \n${currentUser}`);
        } else {
            // Create user
            new User({
                    username: req.body.name,
                    thirdPartyId: req.body.id,
                    lastLogin: Date.now(),
                    dateJoined: Date.now(),
                })
                .save()
                .then((newUser) => {
                    console.log(`User added! \nDetails: ${newUser}`);
                });
        }
    })
    .catch(err => {
        console.log("We had a problem creating a new user in the database.\n------------------------")
        console.log(err);
    });
});

//-------------------------------------

//Create new Product
router.post('/newProduct', function (req, res) {

});


//++++++++++++++++++++++
// All PUT Routes Below ------------
//++++++++++++++++++++++

//-------------------------------------

//Update Product Quantity

//-------------------------------------


//++++++++++++++++++++++
// All DELETE Routes Below ------------
//++++++++++++++++++++++

//Remove Product

//-------------------------------------

module.exports = router;