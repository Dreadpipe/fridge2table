import React from "react";
import { StyleSheet, View, Platform, Alert, Text, Button } from "react-native";
import { Toast, Spinner, Root } from "native-base";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import Head from "../components/head";
import OpenFridge from "../components/openFridge";
import Freezer from "../components/freezer";
import Pantry from "../components/pantry";
import AddProduct from "../components/addProduct";
import ViewProducts from "../components/viewProducts";
import UpdateProduct from "../components/updateProduct";
import Scanner from "../components/scanner";
import Foot from "../components/foot";
// import API from "../utils/API-dev"; // REMOVE FOR FINAL DEPLOYMENT
import API from "../utils/API";
import { Notifications, Permissions } from "expo";
import axios from "axios";

const styles = StyleSheet.create({
	container: {
		height: Platform.OS === "ios" ? vh(100) : vh(100) - getStatusBarHeight(),
		width: "100%"
	}
});

// Platform.OS === 'ios' ? vh(100) : vh(100) - getStatusBarHeight()

let expoToken = "";
const PUSH_ENDPOINT = `https://immense-ravine-93808.herokuapp.com/users/push-token`;

async function registerForPushNotifications() {
	const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
	const token = await Notifications.getExpoPushTokenAsync();
	if (status !== "granted") {
		alert("You did not grant notifications permissions");
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
			view: "spinner",
			productView: "all",
			productName: "",
			picURL: "",
			selectedLocation: "Fridge",
			selectedCategory: "Dairy",
			selectedQuantity: 1,
			expDate: new Date(),
			productIDForUpdate: "",
			notification: {}
		};
		this.setDate = this.setDate.bind(this);
	}

	// Mounting function

	componentDidMount() {
		API.getCurrentUser(this.props.user.id).then(response => {
			this.setState({ user: response.data[0], view: "fridge" }, () => {
				registerForPushNotifications().then(() => {
					this.addPushToken();
        }).catch(err => console.error(err));
			});
			if (response.data[0].inventoryProducts.length === 0) {
				Toast.show({
					text: `Welcome to Fridge2Table! Looks like you don't have any products. Click "Add Product" down here!`,
					buttonText: "Okay",
					position: "bottom",
					type: "warning",
					duration: 30000,
					style: { marginBottom: vh(9) }
				});
			}
    }).catch(err => console.error(err));
		this._notificationSubscription = Notifications.addListener(this._handleNotification);
	}

	//Notification functions

	_handleNotification = notification => {
		this.setState({ notification: notification });
		Toast.show({
			text: `Check the expiration for ${notification.data.expFood}!`,
			buttonText: "Okay!",
			position: "bottom",
			duration: 10000,
			style: { marginBottom: vh(9) }
		});
	};

  // // POST the token to your backend server from where you can retrieve it to send push notifications.
	// sendNotification = () => {
	// 	axios
	// 		.post(PUSH_ENDPOINT, {
	// 			pushToken: expoToken,
	// 			message: "Food is expiring",
	// 			productname: "Eggs!"
	// 		})
	// 		.then(res => console.log(res)).catch(err => console.error(err));
	// };

	addPushToken = () => {
		query = {
			target: {
				id: this.props.user.id
			},
			update: {
				pushToken: expoToken
			}
		};
		axios.put(
			`https://immense-ravine-93808.herokuapp.com/updateUser`,
			query,
			{}
		);
	};

	// Input-form functions:

	setDate(newDate) {
		this.setState({ expDate: newDate });
	}

	onNameChange = e => {
		const productName = e.nativeEvent.text;
		this.setState({ productName });
	};

	onLocationChange(value: string) {
		if (value === "Fridge") {
			this.setState({
				selectedLocation: value,
				selectedCategory: "Dairy",
				selectedQuantity: 1
			});
		} else if (value === "Freezer") {
			this.setState({
				selectedLocation: value,
				selectedCategory: "Meats",
				selectedQuantity: 1
			});
		} else {
			this.setState({
				selectedLocation: value,
				selectedCategory: "Canned Goods",
				selectedQuantity: 1
			});
		}
	}

	onCategoryChange(value: string) {
		this.setState({
			selectedCategory: value
		});
	}

	onQuantityChange(value: string) {
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
			this.setState({ view: "spinner" });
			const newProduct = {
				name: this.state.productName,
				location: this.state.selectedLocation,
				category: this.state.selectedCategory,
				quantity: this.state.selectedQuantity,
				expDate: this.state.expDate,
				userId: this.state.user._id
			};
			if (this.state.picURL) {
				newProduct.pic = this.state.picURL;
			}
			API.addFood(newProduct).then(() => {
				this.setState({
					view: "addProduct",
					productName: "",
					picURL: "",
					selectedCategory: "Dairy",
					selectedLocation: "Fridge",
					selectedQuantity: 1,
					expDate: new Date()
				});
				this.updateUser();
				return alert("Product added! Click OK to add more.");
      }).catch(err => console.error(err));
		} else {
			return alert("Please make sure to fill out the entire product form");
		}
	};

	updateUser = () => {
		API.getCurrentUser(this.state.user.thirdPartyId).then(response => {
			this.setState({ user: response.data[0] });
    }).catch(err => console.error(err));
	};

	// Navigation functions

	toFridgeScreen = () => {
		this.setState({ view: "fridge" });
	};

	toFreezerScreen = () => {
		this.setState({ view: "freezer" });
	};

	toPantryScreen = () => {
		this.setState({ view: "pantry" });
	};

	toAddProductScreen = () => {
		this.setState({ view: "addProduct" });
	};

	toAddProductScreenClear = () => {
		this.setState({
			view: "addProduct",
			productName: "",
			picURL: "",
			selectedLocation: "Fridge",
			selectedCategory: "Dairy",
			selectedQuantity: 1,
			expDate: new Date()
		});
	};

	toScanner = () => {
		this.setState({ view: "scanner" });
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
			view: "updateProduct",
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
			"Delete Product",
			"Are you sure you want to do this?",
			[
				{
					text: "Yes",
					onPress: () => {
						API.removeFood(data).then(() => {
							this.updateUser();
            }).catch(err => console.error(err));
					}
				},
				{
					text: "No",
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

		const { inventoryProducts, ...rest } = this.state.user;
		rest.inventoryProducts = sortedArray;
		this.setState({ view: "viewProducts", user: rest });
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

		const { inventoryProducts, ...rest } = this.state.user;
		rest.inventoryProducts = sortedArray;
		this.setState({ view: "viewProducts", user: rest });
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

		const { inventoryProducts, ...rest } = this.state.user;
		rest.inventoryProducts = sortedArray;
		this.setState({ view: "viewProducts", user: rest });
	};

	// Update-Product Screen Functions

	updateProduct = id => {
		this.setState({ view: "spinner" });
		const filteredProducts = this.state.user.inventoryProducts.filter(
			product => product._id === id
		);
		const updatedProduct = { ...filteredProducts[0] };
		updatedProduct.category = this.state.selectedCategory;
		updatedProduct.expDate = this.state.expDate;
		updatedProduct.location = this.state.selectedLocation;
		updatedProduct.productname = this.state.productName;
		updatedProduct.quantity = this.state.selectedQuantity;

		const data = {
			target: filteredProducts[0],
			update: updatedProduct
		};
		API.updateFood(data).then(() => {
			this.updateUser();
			this.setState({ view: "viewProducts", productView: "all" });
			return alert("Product updated! Click OK to view updated products");
    }).catch(err => console.error(err));
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
					switch (this.state.view) {
						case "fridge":
							return (
								<OpenFridge
									user={this.state.user}
									viewMeats={() =>
										this.setState({
											view: "viewProducts",
											productView: "fridgeMeats"
										})
									}
									countMeats={this.countByCategoryAndLocation(
										"Meats",
										"Fridge"
									)}
									viewDairy={() =>
										this.setState({
											view: "viewProducts",
											productView: "fridgeDairy"
										})
									}
									countDairy={this.countByCategoryAndLocation(
										"Dairy",
										"Fridge"
									)}
									viewProduce={() =>
										this.setState({
											view: "viewProducts",
											productView: "fridgeProduce"
										})
									}
									countProduce={this.countByCategoryAndLocation(
										"Produce",
										"Fridge"
									)}
									viewGrains={() =>
										this.setState({
											view: "viewProducts",
											productView: "fridgeGrains"
										})
									}
									countGrains={this.countByCategoryAndLocation(
										"Grains",
										"Fridge"
									)}
									viewDrinks={() =>
										this.setState({
											view: "viewProducts",
											productView: "fridgeDrinks"
										})
									}
									countDrinks={this.countByCategoryAndLocation(
										"Drinks",
										"Fridge"
									)}
									viewMisc={() =>
										this.setState({
											view: "viewProducts",
											productView: "fridgeMisc"
										})
									}
									countMisc={this.countByCategoryAndLocation(
										"Misc",
										"Fridge"
									)}
								/>
							);
							break;
						case "pantry":
							return (
								<Pantry
									user={this.state.user}
									viewGrains={() =>
										this.setState({
											view: "viewProducts",
											productView: "pantryGrains"
										})
									}
									countMeats={this.countByCategoryAndLocation(
										"Grains",
										"Pantry"
									)}
									viewCans={() =>
										this.setState({
											view: "viewProducts",
											productView: "pantryCans"
										})
									}
									countCans={this.countByCategoryAndLocation(
										"Canned Goods",
										"Pantry"
									)}
									viewProduce={() =>
										this.setState({
											view: "viewProducts",
											productView: "pantryProduce"
										})
									}
									countProduce={this.countByCategoryAndLocation(
										"Produce",
										"Pantry"
									)}
									viewSpices={() =>
										this.setState({
											view: "viewProducts",
											productView: "pantrySpices"
										})
									}
									countSpices={this.countByCategoryAndLocation(
										"Spice Rack",
										"Pantry"
									)}
									viewMisc={() =>
										this.setState({
											view: "viewProducts",
											productView: "pantryMisc"
										})
									}
									countMisc={this.countByCategoryAndLocation(
										"Misc",
										"Pantry"
									)}
								/>
							);
							break;
						case "freezer":
							return (
								<Freezer
									user={this.state.user}
									viewMeats={() =>
										this.setState({
											view: "viewProducts",
											productView: "freezerMeats"
										})
									}
									countMeats={this.countByCategoryAndLocation(
										"Meats",
										"Freezer"
									)}
									viewProduce={() =>
										this.setState({
											view: "viewProducts",
											productView: "freezerProduce"
										})
									}
									countProduce={this.countByCategoryAndLocation(
										"Produce",
										"Freezer"
									)}
									viewMisc={() =>
										this.setState({
											view: "viewProducts",
											productView: "freezerMisc"
										})
									}
									countMisc={this.countByCategoryAndLocation(
										"Misc",
										"Freezer"
									)}
								/>
							);
							break;
						case "addProduct":
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
						case "viewProducts":
							return (
								<ViewProducts
									sortByExpDate={this.sortByExpDate}
									sortAlphabetically={this.sortAlphabetically}
									sortByLocation={this.sortByLocation}
									editProduct={this.editProduct}
									deleteProduct={this.deleteProduct}
									extraData={this.state.user}
									products={(() => {
										switch (this.state.productView) {
											case "all":
												return this.state.user.inventoryProducts;
												break;
											case "fridgeProduce":
												return this.sortByCategoryAndLocation(
													"Produce",
													"Fridge"
												);
												break;
											case "fridgeGrains":
												return this.sortByCategoryAndLocation(
													"Grains",
													"Fridge"
												);
												break;
											case "fridgeDairy":
												return this.sortByCategoryAndLocation(
													"Dairy",
													"Fridge"
												);
												break;
											case "fridgeDrinks":
												return this.sortByCategoryAndLocation(
													"Drinks",
													"Fridge"
												);
												break;
											case "fridgeMisc":
												return this.sortByCategoryAndLocation("Misc", "Fridge");
												break;
											case "fridgeMeats":
												return this.sortByCategoryAndLocation(
													"Meats",
													"Fridge"
												);
												break;
											case "freezerMeats":
												return this.sortByCategoryAndLocation(
													"Meats",
													"Freezer"
												);
												break;
											case "freezerProduce":
												return this.sortByCategoryAndLocation(
													"Produce",
													"Freezer"
												);
												break;
											case "freezerMisc":
												return this.sortByCategoryAndLocation(
													"Misc",
													"Freezer"
												);
												break;
											case "pantryProduce":
												return this.sortByCategoryAndLocation(
													"Produce",
													"Pantry"
												);
												break;
											case "pantryCans":
												return this.sortByCategoryAndLocation(
													"Canned Goods",
													"Pantry"
												);
												break;
											case "pantrySpices":
												return this.sortByCategoryAndLocation(
													"Spice Rack",
													"Pantry"
												);
												break;
											case "pantryGrains":
												return this.sortByCategoryAndLocation(
													"Grains",
													"Pantry"
												);
												break;
											case "pantryMisc":
												return this.sortByCategoryAndLocation("Misc", "Pantry");
												break;
										}
									})()}
								/>
							);
							break;
						case "updateProduct":
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
						case "scanner":
							return (
								<Scanner
									user={this.state.user}
									addProductNameAndPicURL={this.addProductNameAndPicURL}
									toAddProductScreen={this.toAddProductScreen}
								/>
							);
							break;
						case "spinner":
							return (
								<Spinner
									color="#193652"
									style={{ flex: 1, backgroundColor: "#EBF5FF" }}
								/>
							);
							break;
					}
				})()}
				<Foot
					toAddProductScreenClear={this.toAddProductScreenClear}
					viewAllProducts={() =>
						this.setState({
							view: "viewProducts",
							productView: "all"
						})
					}
				/>
			</View>
		);
	}
}

export default Home;
