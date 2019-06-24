import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import Head from "../components/head";
import OpenFridge from "../components/openFridge";
import Freezer from "../components/freezer";
import Pantry from "../components/pantry";
import AddProduct from "../components/addProduct";
import ViewProducts from "../components/viewProducts";
import Scanner from "../components/scanner";
import Foot from "../components/foot";
import API from "../utils/API";
import { Notifications, Permissions } from "expo";
import axios from "axios";
import env from "../../env";

const styles = StyleSheet.create({
	container: {
		height: Platform.OS === "ios" ? vh(100) : vh(100) - getStatusBarHeight(),
		width: "100%"
	}
});

// Platform.OS === 'ios' ? vh(100) : vh(100) - getStatusBarHeight()

let expoToken = "";
const PUSH_ENDPOINT = `http://${env.IP_ADDRESS}:3001/users/push-token`;

async function registerForPushNotifications() {
	const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
	const token = await Notifications.getExpoPushTokenAsync();
	if (status !== "granted") {
		alert("You did not grant notifications permissions");
		return;
	}
	console.log(status, token);
	expoToken = token;
}
class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {},
			view: "fridge",
			productView: "all",
			productName: "",
			picURL: "",
			selectedLocation: "Fridge",
			selectedCategory: "Dairy",
			selectedQuantity: 1,
			expDate: new Date(),
			notification: {}
		};
		this.setDate = this.setDate.bind(this);
	}

	// Mounting function

	componentDidMount() {
		API.getCurrentUser(this.props.user.id).then(response => {
			this.setState({ user: response.data[0] }, () => {
				registerForPushNotifications().then(() => {
					this.addPushToken();
				});
			});
		});
		this._notificationSubscription = Notifications.addListener(
			this._handleNotification
		);
	}

	//Notification functions

	_handleNotification = notification => {
		this.setState({ notification: notification });
	};

	sendNotification = () => {
		// POST the token to your backend server from where you can retrieve it to send push notifications.
		axios
			.post(PUSH_ENDPOINT, {
				pushToken: expoToken,
				message: "Food is expiring",
				productname: "Eggs!"
			})
			.then(res => console.log(res))
			.catch(err => console.error(err));
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
		axios.put(`http://${env.IP_ADDRESS}:3001/updateUser`, query, {});
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
					productName: "",
					picURL: "",
					selectedCategory: "Dairy",
					selectedLocation: "Fridge",
					selectedQuantity: 1,
					expDate: new Date()
				});
				this.updateUser();
				return alert("Product added! Click OK to add more.");
			});
		} else {
			return alert("Please make sure to fill out the entire product form");
		}
	};

	updateUser = () => {
		API.getCurrentUser(this.state.user.thirdPartyId).then(response => {
			this.setState({ user: response.data[0] });
		});
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

	editProduct = (id) => {
		const filteredProducts = this.state.user.inventoryProducts.filter(product => product._id === id);
		console.log(filteredProducts[0])
	}

	deleteProduct = (id) => {
		const filteredProducts = this.state.user.inventoryProducts.filter(product => product._id === id);
		console.log(filteredProducts[0]);
		const data = {
			target: filteredProducts[0]
		}
		API.removeFood(data).then(() => {
			this.updateUser();
		});
	}

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
									viewDairy={() =>
										this.setState({
											view: "viewProducts",
											productView: "fridgeDairy"
										})
									}
									viewProduce={() =>
										this.setState({
											view: "viewProducts",
											productView: "fridgeProduce"
										})
									}
									viewGrains={() =>
										this.setState({
											view: "viewProducts",
											productView: "fridgeGrains"
										})
									}
									viewDrinks={() =>
										this.setState({
											view: "viewProducts",
											productView: "fridgeDrinks"
										})
									}
									viewMisc={() =>
										this.setState({
											view: "viewProducts",
											productView: "fridgeMisc"
										})
									}
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
									viewCans={() =>
										this.setState({
											view: "viewProducts",
											productView: "pantryCans"
										})
									}
									viewProduce={() =>
										this.setState({
											view: "viewProducts",
											productView: "pantryProduce"
										})
									}
									viewSpices={() =>
										this.setState({
											view: "viewProducts",
											productView: "pantrySpices"
										})
									}
									viewMisc={() =>
										this.setState({
											view: "viewProducts",
											productView: "pantryMisc"
										})
									}
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
									viewProduce={() =>
										this.setState({
											view: "viewProducts",
											productView: "freezerProduce"
										})
									}
									viewMisc={() =>
										this.setState({
											view: "viewProducts",
											productView: "freezerMisc"
										})
									}
								/>
							);
							break;
						case "addProduct":
							return (
								<AddProduct
									consoleState={this.consoleState}
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
									editProduct={this.editProduct}
									deleteProduct={this.deleteProduct}
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
						case "scanner":
							return (
								<Scanner
									user={this.state.user}
									addProductNameAndPicURL={this.addProductNameAndPicURL}
									toAddProductScreen={this.toAddProductScreen}
								/>
							);
							break;
					}
				})()}
				<Foot
					toAddProductScreen={this.toAddProductScreen}
					viewAllProducts={() =>
						this.setState({
							view: "viewProducts",
							productView: "all"
						})
					}
				/>
				{/* {this.state.notification.origin ? (
					<View>
						<Text>Origin: {this.state.notification.origin}</Text>
						{this.state.notification.data ? (
							<Text>Data: {JSON.stringify(this.state.notification.data)}</Text>
						) : (
							<Text>No Data</Text>
						)}
					</View>
				) : (
					<View>
						<Text>Expo Notifications Test!</Text>
						<Button title="Test Notification" onPress={this.sendNotification} />
					</View>
				)} */}
			</View>
		);
	}
}

export default Home;
