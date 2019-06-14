# Fridge2Table
The app that helps get your food fresh from your fridge to your table.

## Overview and Goals
Fridge2Table has one overarching goal - to make the modern problem of food management smooth and efficient all the way from when you first bring your food home until you eat it. 
In achieving this goal, Fridge2Table will give users the ability to track their food wherever they store it with expiration dates and regular notifications if their food sits unused for too long. Our users will be able to make and store recipies, and see which recipes they can make with the food thay have. If they're missing food from their home inventory, our users will be able to automatically or manually create shopping lists with new items and items populated from their inventory, past and present. 

Every feature of our app has the singular goal of enhancing the food management experience for our users, and we intend to make that experience great.

## Deployment 
Our app will be deployed on Android and IOS phones, and our database will be hosted on AWS - [AWS](https://aws.amazon.com/)

## MVP

_Phase 1_
* Have a login/signup page.
* Track users and user data.
* Give users the ability to input and track their foods expiration dates.
* Keep inventory of each user’s input food.
* Give the users the ability to scan the items in via barcode, or to manually input them.
* Give users the ability to remove food.
* Give users the ability to search their inventory.
* Give users the ability to sort their inventory. Particularly by expiration date.
* Notify users when their food is soon to expire.

_Phase 2_
* Have multiple lists based on item location (fridge, freezer, pantry, etc.)
* Give the users the ability to add fresh produce to their inventory.
* Give the users the ability to add a ripeness or freshness quality to their produce.
* Give the user an expiration window for fresh produce.
* Give the user the ability to make grocery lists using the complete inventory.
* Give users the ability to keep a Recipe Inventory that is searchable by various factors such as name, ingredients, etc.
* Give the users the ability to make their own recipes, and associate parts of the recipes with certain foods in their inventory, or that they can scan.
* Compare recipes to their food inventory to see what recipes can be made with what is in stock.
* Have both an iOS and android version.

## Dependancies
Our app will be using the following NPM:
* [Axios](https://www.npmjs.com/package/axios) - Our app will be making route calls with this NPM.
* [Dotenv](https://www.npmjs.com/package/dotenv) - We will use this NPM to keep our secrets safe.
* [Express](https://www.npmjs.com/package/express) - We will be using Express to communicate between our back and front ends.
* [MongoDB](https://www.npmjs.com/package/mongodb) - Our database will be Mongo.
* [Mongoose](https://www.npmjs.com/package/mongoose) - We will be using the Mongoose ORM to manipulate our database.
* [Passport](https://www.npmjs.com/package/passport) - We will have login and authentication for our users and for that we will be using Passport.
* [React](https://reactjs.org/), [React Router](https://www.npmjs.com/package/react-router), [React Native](https://facebook.github.io/react-native/) - Our app is first and foremost a mobile React app, utilizing React Router for our pages, and React Native for our mobile structure.
  _As part of our React program we will be using the following tech_
  * [Expo](https://expo.io/) - 
  * [Barcode](https://docs.expo.io/versions/latest/sdk/bar-code-scanner/) - 

## API
Our app will be using the following API:
* [Edamam](https://developer.edamam.com/) - Edamam will be our food and recipe API.

## Active Bugs and Issues
* 

## Future Features
* A website version of the app.
* Keep track of past purchased items that are no longer in the inventory.
* Allow users to track how much of an item is left in servings matching those on the food label.
* Make amount tracking automatic when combined with recipes.
* Give the user the ability to automatically add items to the grocery list based on what is missing from the recipe.
* Give users the ability to share their recipes.
* Track user meta-data, and include ways to display it.
  * How often certain items go expired without being used.
  * How much, or how often certain items are purchased by the user.
* Track and display item meta data:
  * Are there items that tend to go expired earlier than their expiration date for most users?

