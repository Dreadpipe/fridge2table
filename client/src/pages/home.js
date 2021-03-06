import React from 'react';
import { StyleSheet, View, Platform, Alert } from 'react-native';
import { Toast, Spinner } from 'native-base';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { vh } from 'react-native-expo-viewport-units';
import Head from '../components/head';
import OpenFridge from '../components/openFridge';
import Freezer from '../components/freezer';
import Pantry from '../components/pantry';
import AddProduct from '../components/addProduct';
import ViewProducts from '../components/viewProducts';
import ProductDetail from '../components/productDetails';
import GroceryList from '../components/groceryList';
import UpdateProduct from '../components/updateProduct';
import Scanner from '../components/scanner';
import Foot from '../components/foot';
// import API from "../utils/API";
import API from '../utils/API-dev';
import { Notifications, Permissions } from 'expo';

const styles = StyleSheet.create({
	container: {
		height: Platform.OS === 'ios' ? vh(100) : vh(100) - getStatusBarHeight(),
		width: '100%'
	}
});

// Variable to hold token globally to send to backend
let expoToken = '';

async function registerForPushNotifications() {
	const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
	const token = await Notifications.getExpoPushTokenAsync();
	if (status !== 'granted') {
		alert('You did not grant notifications permissions');
		return;
	}
	// console.log(status, token);
	expoToken = token;
}
class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {},
			view: 'spinner',
			productView: 'all',
			productName: '',
			picURL: '',
			selectedLocation: 'Fridge',
			selectedCategory: 'Dairy',
			selectedQuantity: 1,
			expDate: new Date(),
			productIDForUpdate: '',
			productToDetail: {},
			groceryItemLoading: false,
			numNeededLoading: false,
			notification: {}
		};
		this.setDate = this.setDate.bind(this);
	}

	// Mounting function

	componentDidMount() {
		// Once user is fully loaded through API call, view is switched from the spinner to the fridge
		API.getCurrentUser(this.props.user.id)
			.then(response => {
				this.setState({ user: response.data[0], view: 'fridge' }, () => {
					registerForPushNotifications()
						.then(() => {
							// First check if pushToken array contains more than one token, then if the array already contains the generated token
							if (
								Array.isArray(this.state.user.pushToken) &&
								!this.state.user.pushToken.includes(expoToken)
							) {
								// If not, adds the new token to the array
								this.addPushToken();
								// Logs that the token already exists
							} else {
								return console.log('User already has this push token saved!');
							}
						})
						.catch(err => console.log(err));
				});
				if (response.data[0].inventoryProducts.length === 0) {
					// Toast that pops up if user doesn't have any products
					Toast.show({
						text: `Welcome to Fridge2Table! Looks like you don't have any products. Click "New Product" down here!`,
						buttonText: 'Okay',
						position: 'bottom',
						type: 'warning',
						duration: 30000,
						style: { marginBottom: vh(9) }
					});
				}
			})
			.catch(err => console.log(err));
		this._notificationSubscription = Notifications.addListener(
			this._handleNotification
		);
	}

	// Notification functions

	_handleNotification = notification => {
		this.setState({ notification: notification });
		// Toast that pops up when the notification is sent to the user's device
		Toast.show({
			text: `Check the expiration for ${notification.data.expFood}!`,
			buttonText: 'Okay!',
			position: 'bottom',
			duration: 10000,
			style: { marginBottom: vh(9) }
		});
	};

	addPushToken = () => {
		query = {
			target: {
				id: this.props.user.id
			},
			update: {
				pushToken: expoToken
			}
		};
		API.updateUser(query);
	};

	// Input-form functions:

	setDate(newDate) {
		this.setState({ expDate: newDate });
	}

	onNameChange = e => {
		const productName = e.nativeEvent.text;
		this.setState({ productName });
	};

	onLocationChange(value) {
		if (value === 'Fridge') {
			this.setState({
				selectedLocation: value,
				selectedCategory: 'Dairy',
				selectedQuantity: 1
			});
		} else if (value === 'Freezer') {
			this.setState({
				selectedLocation: value,
				selectedCategory: 'Meats',
				selectedQuantity: 1
			});
		} else {
			this.setState({
				selectedLocation: value,
				selectedCategory: 'Canned Goods',
				selectedQuantity: 1
			});
		}
	}

	onCategoryChange(value) {
		this.setState({
			selectedCategory: value
		});
	}

	onQuantityChange(value) {
		this.setState({
			selectedQuantity: value
		});
	}

	addProduct = () => {
		if (
			this.state.productName &&
			this.state.selectedLocation &&
			this.state.selectedCategory &&
			this.state.selectedQuantity
		) {
			// View is set to "spinner" while the addProduct function is being processed

			this.setState({ view: 'spinner' });
			// A new product object is created to be sent to the database
			const newProduct = {
				name: this.state.productName,
				location: this.state.selectedLocation,
				category: this.state.selectedCategory,
				quantity: this.state.selectedQuantity,
				expDate: this.state.expDate,
				userId: this.state.user._id
			};

			// PicURL is only added to the newProduct object if the user scans a barcode and Edamam provides a picURL
			if (this.state.picURL) {
				newProduct.pic = this.state.picURL;
			}

			// The newProduct object is sent up to the database
			API.addFood(newProduct)
				.then(() => {
					// The product's info is cleared from state object after the product is added
					this.setState({
						view: 'addProduct',
						productName: '',
						picURL: '',
						selectedCategory: 'Dairy',
						selectedLocation: 'Fridge',
						selectedQuantity: 1,
						expDate: new Date()
					});
					// A new call to get the user is made, to get their updated list of products for display
					this.updateUser();
					return alert('Product added! Click OK to add more.');
				})
				.catch(err => console.log(err));
		} else {
			// An alert that pops up if the user fails to fill out the entire input form to add a product
			return alert('Please make sure to fill out the entire product form');
		}
	};

	updateUser = () => {
		API.getCurrentUser(this.state.user.thirdPartyId)
			.then(response => {
				this.setState({ user: response.data[0] });
			})
			.catch(err => console.log(err));
	};

	// Navigation functions

	toFridgeScreen = () => {
		this.setState({ view: 'fridge' });
	};

	toFreezerScreen = () => {
		this.setState({ view: 'freezer' });
	};

	toPantryScreen = () => {
		this.setState({ view: 'pantry' });
	};

	toAddProductScreen = () => {
		this.setState({ view: 'addProduct' });
	};

	toProductDetailScreen = id => {
		const filteredProducts = this.state.user.inventoryProducts.filter(
			product => product._id === id
		);
		this.setState({
			view: 'productDetail',
			productToDetail: filteredProducts[0]
		});
	};

	toGroceryListScreen = () => {
		this.setState({ view: 'spinner' });
		this.updateUser();
		this.setState({ view: 'groceryList' });
	};

	toAddProductScreenClear = () => {
		this.setState({
			view: 'addProduct',
			productName: '',
			picURL: '',
			selectedLocation: 'Fridge',
			selectedCategory: 'Dairy',
			selectedQuantity: 1,
			expDate: new Date()
		});
	};

	toScanner = () => {
		this.setState({ view: 'scanner' });
	};

	// Scanner functions

	addProductNameAndPicURL = (name, url) => {
		this.setState({ productName: name, picURL: url });
	};

	// View-Products Screen Functions

	sortByCategoryAndLocation = (category, location) => {
		const filteredArr = this.state.user.inventoryProducts.filter(product => {
			if (product.location === location && product.category === category) {
				return product;
			}
		});
		return filteredArr;
	};

	countByCategoryAndLocation = (category, location) => {
		const filteredArr = this.state.user.inventoryProducts.filter(product => {
			if (product.location === location && product.category === category) {
				return product;
			}
		});
		return filteredArr.length;
	};

	editProduct = id => {
		const filteredProducts = this.state.user.inventoryProducts.filter(
			product => product._id === id
		);
		this.setState({
			view: 'updateProduct',
			productName: filteredProducts[0].productname,
			selectedLocation: filteredProducts[0].location,
			selectedCategory: filteredProducts[0].category,
			selectedQuantity: filteredProducts[0].quantity,
			expDate: new Date(filteredProducts[0].expDate),
			productIDForUpdate: filteredProducts[0]._id
		});
	};

	deleteProduct = id => {
		const filteredProducts = this.state.user.inventoryProducts.filter(
			product => product._id === id
		);
		const data = {
			target: filteredProducts[0]
		};
		Alert.alert(
			'Delete Product',
			'Are you sure you want to do this?',
			[
				{
					text: 'Yes',
					onPress: () => {
						API.removeFood(data)
							.then(() => {
								this.updateUser();
								this.setState({
									view: 'viewProducts',
									productView: 'all'
								});
							})
							.catch(err => console.log(err));
					}
				},
				{
					text: 'No',
					onPress: () => {
						return;
					}
				}
			],
			{ cancelable: false }
		);
	};

	sortByExpDate = () => {
		const sortedArray = this.state.user.inventoryProducts.sort((a, b) => {
			// Function to calculate difference between dates taken in part from this resource: https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
			const _MS_PER_DAY = 1000 * 60 * 60 * 24;

			function dateDiffInDays(a, b) {
				// Discarding time and time-zone info
				const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
				const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

				return Math.floor((utc1 - utc2) / _MS_PER_DAY);
			}

			// test it
			const aExp = new Date(a.expDate);
			const bExp = new Date(b.expDate);
			const today = new Date();
			const aDifference = dateDiffInDays(aExp, today);
			const bDifference = dateDiffInDays(bExp, today);

			return aDifference - bDifference;
		});

		// Inventory products array is pulled out of the user object via ES6 destructuring, then the sorted array is added back in its place
		const { inventoryProducts, ...rest } = this.state.user;
		rest.inventoryProducts = sortedArray;
		this.setState({ view: 'viewProducts', user: rest });
	};

	sortAlphabetically = () => {
		const sortedArray = this.state.user.inventoryProducts.sort((a, b) => {
			if (a.productname < b.productname) {
				return -1;
			}
			if (a.productname > b.productname) {
				return 1;
			}
			return 0;
		});

		// Inventory products array is pulled out of the user object via ES6 destructuring, then the sorted array is added back in its place
		const { inventoryProducts, ...rest } = this.state.user;
		rest.inventoryProducts = sortedArray;
		this.setState({ view: 'viewProducts', user: rest });
	};

	sortByLocation = () => {
		const sortedArray = this.state.user.inventoryProducts.sort((a, b) => {
			if (a.location < b.location) {
				return -1;
			}
			if (a.location > b.location) {
				return 1;
			}
			return 0;
		});

		// Inventory products array is pulled out of the user object via ES6 destructuring, then the sorted array is added back in its place
		const { inventoryProducts, ...rest } = this.state.user;
		rest.inventoryProducts = sortedArray;
		this.setState({ view: 'viewProducts', user: rest });
	};

	// Update-Product Screen Functions

	updateProduct = id => {
		// View is set to "spinner" while the updateProduct function is processed
		this.setState({ view: 'spinner' });
		// Filter call that returns only the product with the matching id
		const filteredProducts = this.state.user.inventoryProducts.filter(
			product => product._id === id
		);
		// The key-value pairs of the filtered product are spread into a new object, and the necessary key-value pairs are then updated
		const updatedProduct = { ...filteredProducts[0] };
		updatedProduct.category = this.state.selectedCategory;
		updatedProduct.expDate = this.state.expDate;
		updatedProduct.location = this.state.selectedLocation;
		updatedProduct.productname = this.state.productName;
		updatedProduct.quantity = this.state.selectedQuantity;

		// The appropriate data object is built for the updateFood API call and plugged into the call
		const data = {
			target: filteredProducts[0],
			update: updatedProduct
		};
		API.updateFood(data)
			.then(() => {
				// A new call to get the user is made, to get the list of products with the updated product details
				this.updateUser();
				// The view is switched to "viewProducts," with the updated product on display
				this.setState({ view: 'viewProducts', productView: 'all' });
				return alert('Product updated! Click OK to view updated products');
			})
			.catch(err => console.log(err));
	};

	// Grocery-List Functions

	addGroceryItem = id => {
		// View is set to "spinner" while the updateProduct function is processed
		this.setState({ view: 'spinner' });
		// Filter call that returns only the product with the matching id
		const filteredProducts = this.state.user.inventoryProducts.filter(
			product => product._id === id
		);
		const groceryItem = {
			name: filteredProducts[0].productname,
			category: filteredProducts[0].category,
			location: filteredProducts[0].location,
			pic: filteredProducts[0].pic,
			needed: 1,
			userId: filteredProducts[0].owner
		};
		API.postGroceryItem(groceryItem).then(() => {
			this.toGroceryListScreen();
		});
	};

	checkAcquired = id => {
		if (!this.state.groceryItemLoading) {
			this.setState({ groceryItemLoading: true });
			const filteredGroceryItems = this.state.user.groceryList.filter(
				item => item._id === id
			);

			const { groceryList, ...rest } = this.state.user;
			groceryList.forEach(item => {
				if (item._id === id) {
					item.checkLoading = true;
				}
			});
			rest.groceryList = groceryList;
			this.setState({ user: rest });

			const updatedItem = { ...filteredGroceryItems[0] };
			updatedItem.acquiredCheck = !updatedItem.acquiredCheck;

			const data = {
				target: filteredGroceryItems[0],
				update: updatedItem
			};

			API.updateGroceryItem(data)
				.then(() => {
					this.toGroceryListScreen();
					this.setState({ groceryItemLoading: false });
				})
				.catch(err => console.log(err));
		}
	};

	addToNumNeeded = id => {
		if (!this.state.numNeededLoading) {
			this.setState({ numNeededLoading: true });
			const filteredGroceryItems = this.state.user.groceryList.filter(
				item => item._id === id
			);

			const { groceryList, ...rest } = this.state.user;
			groceryList.forEach(item => {
				if (item._id === id) {
					item.numNeededLoading = true;
				}
			});
			rest.groceryList = groceryList;
			this.setState({ user: rest });

			const updatedItem = { ...filteredGroceryItems[0] };
			updatedItem.numNeeded++;

			const data = {
				target: filteredGroceryItems[0],
				update: updatedItem
			};

			console.log(data);

			API.updateGroceryItem(data)
				.then(() => {
					this.toGroceryListScreen();
					this.setState({ numNeededLoading: false });
				})
				.catch(err => console.log(err));
		}
	};

	subtractFromNumNeeded = id => {
		if (!this.state.numNeededLoading) {
			this.setState({ numNeededLoading: true });
			const filteredGroceryItems = this.state.user.groceryList.filter(
				item => item._id === id
			);
			if (filteredGroceryItems[0].numNeeded > 1) {
				const { groceryList, ...rest } = this.state.user;
				groceryList.forEach(item => {
					if (item._id === id) {
						item.numNeededLoading = true;
					}
				});
				rest.groceryList = groceryList;
				this.setState({ user: rest });

				const updatedItem = { ...filteredGroceryItems[0] };
				updatedItem.numNeeded--;

				const data = {
					target: filteredGroceryItems[0],
					update: updatedItem
				};

				console.log(data);

				API.updateGroceryItem(data)
					.then(() => {
						this.toGroceryListScreen();
						this.setState({ numNeededLoading: false });
					})
					.catch(err => console.log(err));
			} else {
				this.setState({ numNeededLoading: false });
			}
		}
	};

	addGroceryItemToInventory = id => {
		const filteredGroceryItems = this.state.user.groceryList.filter(
			item => item._id === id
		);

		const addDays = function(date, days) {
			const result = new Date(date);
			result.setDate(result.getDate() + days);
			return result;
		};

		const newProduct = {
			name: filteredGroceryItems[0].productname,
			location: filteredGroceryItems[0].location,
			category: filteredGroceryItems[0].category,
			quantity: filteredGroceryItems[0].numNeeded,
			expDate: addDays(new Date(), 7),
			userId: this.state.user._id
		};

		if (filteredGroceryItems[0].pic) {
			newProduct.pic = filteredGroceryItems[0].pic;
		}

		const data = {
			target: filteredGroceryItems[0]
		};

		Alert.alert(
			'Add to Inventory',
			`The item will be added to your inventory with the following details:\n\nLocation: ${
				filteredGroceryItems[0].location
			}\nCatetogory: ${filteredGroceryItems[0].category}\nQuantity: ${
				filteredGroceryItems[0].numNeeded
			}\nExpiration date: ${newProduct.expDate
				.toString()
				.substr(4, 12)}\n\nDo you want to continue?`,
			[
				{
					text: 'Yes',
					onPress: () => {
						// The newProduct object is sent up to the database
						API.addFood(newProduct)
							.then(() => {
								// A new call to get the user is made, to get their updated list of products for display
								API.removeGroceryItem(data)
									.then(() => {
										this.updateUser();
										return alert(
											'Product added! Click OK to return to the grocery list.'
										);
									})
									.catch(err => console.log(err));
							})
							.catch(err => console.log(err));
					}
				},
				{
					text: 'No',
					onPress: () => {
						return;
					}
				}
			],
			{ cancelable: false }
		);
	};

	deleteGroceryItem = id => {
		const filteredGroceryItems = this.state.user.groceryList.filter(
			item => item._id === id
		);
		const data = {
			target: filteredGroceryItems[0]
		};
		Alert.alert(
			'Delete Grocery Item',
			'Are you sure you want to do this?',
			[
				{
					text: 'Yes',
					onPress: () => {
						API.removeGroceryItem(data)
							.then(() => {
								this.toGroceryListScreen();
							})
							.catch(err => console.log(err));
					}
				},
				{
					text: 'No',
					onPress: () => {
						return;
					}
				}
			],
			{ cancelable: false }
		);
	};

	// Render function

	render() {
		return (
			<View style={styles.container}>
				<Head
					toFridge={this.toFridgeScreen}
					toFreezer={this.toFreezerScreen}
					toPantry={this.toPantryScreen}
				/>
				{(() => {
					// Switch statement that displays the appropriate page view, depending on what's set as "view" in the state object
					switch (this.state.view) {
						case 'fridge':
							return (
								<OpenFridge
									user={this.state.user}
									viewMeats={() =>
										this.setState({
											view: 'viewProducts',
											productView: 'fridgeMeats'
										})
									}
									countMeats={this.countByCategoryAndLocation(
										'Meats',
										'Fridge'
									)}
									viewDairy={() =>
										this.setState({
											view: 'viewProducts',
											productView: 'fridgeDairy'
										})
									}
									countDairy={this.countByCategoryAndLocation(
										'Dairy',
										'Fridge'
									)}
									viewProduce={() =>
										this.setState({
											view: 'viewProducts',
											productView: 'fridgeProduce'
										})
									}
									countProduce={this.countByCategoryAndLocation(
										'Produce',
										'Fridge'
									)}
									viewGrains={() =>
										this.setState({
											view: 'viewProducts',
											productView: 'fridgeGrains'
										})
									}
									countGrains={this.countByCategoryAndLocation(
										'Grains',
										'Fridge'
									)}
									viewDrinks={() =>
										this.setState({
											view: 'viewProducts',
											productView: 'fridgeDrinks'
										})
									}
									countDrinks={this.countByCategoryAndLocation(
										'Drinks',
										'Fridge'
									)}
									viewMisc={() =>
										this.setState({
											view: 'viewProducts',
											productView: 'fridgeMisc'
										})
									}
									countMisc={this.countByCategoryAndLocation('Misc', 'Fridge')}
								/>
							);
							break;
						case 'pantry':
							return (
								<Pantry
									user={this.state.user}
									viewGrains={() =>
										this.setState({
											view: 'viewProducts',
											productView: 'pantryGrains'
										})
									}
									countGrains={this.countByCategoryAndLocation(
										'Grains',
										'Pantry'
									)}
									viewCans={() =>
										this.setState({
											view: 'viewProducts',
											productView: 'pantryCans'
										})
									}
									countCans={this.countByCategoryAndLocation(
										'Canned Goods',
										'Pantry'
									)}
									viewProduce={() =>
										this.setState({
											view: 'viewProducts',
											productView: 'pantryProduce'
										})
									}
									countProduce={this.countByCategoryAndLocation(
										'Produce',
										'Pantry'
									)}
									viewSpices={() =>
										this.setState({
											view: 'viewProducts',
											productView: 'pantrySpices'
										})
									}
									countSpices={this.countByCategoryAndLocation(
										'Spice Rack',
										'Pantry'
									)}
									viewMisc={() =>
										this.setState({
											view: 'viewProducts',
											productView: 'pantryMisc'
										})
									}
									countMisc={this.countByCategoryAndLocation('Misc', 'Pantry')}
								/>
							);
							break;
						case 'freezer':
							return (
								<Freezer
									user={this.state.user}
									viewMeats={() =>
										this.setState({
											view: 'viewProducts',
											productView: 'freezerMeats'
										})
									}
									countMeats={this.countByCategoryAndLocation(
										'Meats',
										'Freezer'
									)}
									viewProduce={() =>
										this.setState({
											view: 'viewProducts',
											productView: 'freezerProduce'
										})
									}
									countProduce={this.countByCategoryAndLocation(
										'Produce',
										'Freezer'
									)}
									viewMisc={() =>
										this.setState({
											view: 'viewProducts',
											productView: 'freezerMisc'
										})
									}
									countMisc={this.countByCategoryAndLocation('Misc', 'Freezer')}
								/>
							);
							break;
						case 'addProduct':
							return (
								<AddProduct
									user={this.state.user}
									onNameChange={this.onNameChange.bind(this)}
									productName={this.state.productName}
									onLocationChange={this.onLocationChange.bind(this)}
									location={this.state.selectedLocation}
									onCategoryChange={this.onCategoryChange.bind(this)}
									category={this.state.selectedCategory}
									onQuantityChange={this.onQuantityChange.bind(this)}
									quantity={this.state.selectedQuantity}
									setDate={this.setDate}
									date={this.state.expDate}
									toScanner={this.toScanner}
									addProduct={this.addProduct}
								/>
							);
							break;
						case 'viewProducts':
							return (
								<ViewProducts
									sortByExpDate={this.sortByExpDate}
									sortAlphabetically={this.sortAlphabetically}
									sortByLocation={this.sortByLocation}
									editProduct={this.editProduct}
									deleteProduct={this.deleteProduct}
									toProductDetailScreen={this.toProductDetailScreen}
									extraData={this.state.user}
									products={(() => {
										switch (this.state.productView) {
											case 'all':
												return this.state.user.inventoryProducts;
												break;
											case 'fridgeProduce':
												return this.sortByCategoryAndLocation(
													'Produce',
													'Fridge'
												);
												break;
											case 'fridgeGrains':
												return this.sortByCategoryAndLocation(
													'Grains',
													'Fridge'
												);
												break;
											case 'fridgeDairy':
												return this.sortByCategoryAndLocation(
													'Dairy',
													'Fridge'
												);
												break;
											case 'fridgeDrinks':
												return this.sortByCategoryAndLocation(
													'Drinks',
													'Fridge'
												);
												break;
											case 'fridgeMisc':
												return this.sortByCategoryAndLocation('Misc', 'Fridge');
												break;
											case 'fridgeMeats':
												return this.sortByCategoryAndLocation(
													'Meats',
													'Fridge'
												);
												break;
											case 'freezerMeats':
												return this.sortByCategoryAndLocation(
													'Meats',
													'Freezer'
												);
												break;
											case 'freezerProduce':
												return this.sortByCategoryAndLocation(
													'Produce',
													'Freezer'
												);
												break;
											case 'freezerMisc':
												return this.sortByCategoryAndLocation(
													'Misc',
													'Freezer'
												);
												break;
											case 'pantryProduce':
												return this.sortByCategoryAndLocation(
													'Produce',
													'Pantry'
												);
												break;
											case 'pantryCans':
												return this.sortByCategoryAndLocation(
													'Canned Goods',
													'Pantry'
												);
												break;
											case 'pantrySpices':
												return this.sortByCategoryAndLocation(
													'Spice Rack',
													'Pantry'
												);
												break;
											case 'pantryGrains':
												return this.sortByCategoryAndLocation(
													'Grains',
													'Pantry'
												);
												break;
											case 'pantryMisc':
												return this.sortByCategoryAndLocation('Misc', 'Pantry');
												break;
										}
									})()}
								/>
							);
							break;
						case 'productDetail':
							return (
								<ProductDetail
									editProduct={this.editProduct}
									deleteProduct={this.deleteProduct}
									addGroceryItem={this.addGroceryItem}
									product={this.state.productToDetail}
								/>
							);
							break;
						case 'groceryList':
							return (
								<GroceryList
									groceryItems={this.state.user.groceryList}
									extraData={this.state.user}
									groceryItemLoading={this.state.groceryItemLoading}
									checkAcquired={this.checkAcquired}
									addToNumNeeded={this.addToNumNeeded}
									subtractFromNumNeeded={this.subtractFromNumNeeded}
									addToInventory={this.addGroceryItemToInventory}
									deleteGroceryItem={this.deleteGroceryItem}
								/>
							);
							break;
						case 'updateProduct':
							return (
								<UpdateProduct
									user={this.state.user}
									onNameChange={this.onNameChange.bind(this)}
									productName={this.state.productName}
									onLocationChange={this.onLocationChange.bind(this)}
									location={this.state.selectedLocation}
									onCategoryChange={this.onCategoryChange.bind(this)}
									category={this.state.selectedCategory}
									onQuantityChange={this.onQuantityChange.bind(this)}
									quantity={this.state.selectedQuantity}
									setDate={this.setDate}
									date={this.state.expDate}
									productID={this.state.productIDForUpdate}
									updateProduct={this.updateProduct}
								/>
							);
							break;
						case 'scanner':
							return (
								<Scanner
									user={this.state.user}
									addProductNameAndPicURL={this.addProductNameAndPicURL}
									toAddProductScreen={this.toAddProductScreen}
								/>
							);
							break;
						case 'spinner':
							return (
								<Spinner
									color="#193652"
									style={{ flex: 1, backgroundColor: '#EBF5FF' }}
								/>
							);
							break;
					}
				})()}
				<Foot
					toAddProductScreenClear={this.toAddProductScreenClear}
					toGroceryListScreen={this.toGroceryListScreen}
					viewAllProducts={() =>
						this.setState({
							view: 'viewProducts',
							productView: 'all'
						})
					}
				/>
			</View>
		);
	}
}

export default Home;
