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
			productName: "",
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
		// axios.post(`https://exp.host/--/api/v2/push/send`,
		// {
		//   to: expoToken,
		//   title: "Title Notification",
		//   sound: "default",
		//   badge: 1,
		//   body: "Hello World!",
		//   data: {
		//     message: "Hey, nerd!"
		//   }
		// });
		// POST the token to your backend server from where you can retrieve it to send push notifications.
		return fetch(PUSH_ENDPOINT, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				pushToken: expoToken,
				id: this.props.user.id
			})
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
			API.addFood(newProduct);
			this.setState({
				productName: "",
				selectedCategory: "Dairy",
				selectedLocation: "Fridge",
				selectedQuantity: 1,
				expDate: new Date()
			});
			this.updateUser();
			return alert("Product added! Click OK to add more.");
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

	toViewProductsScreen = () => {
		this.setState({ view: "viewProducts" });
	};

	toScanner = () => {
		this.setState({ view: "scanner" });
	};

	// Scanner functions

	addProductName = name => {
		this.setState({ productName: name });
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
							return <OpenFridge user={this.state.user} />;
							break;
						case "pantry":
							return <Pantry user={this.state.user} />;
							break;
						case "freezer":
							return <Freezer user={this.state.user} />;
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
							console.log(this.state.user.inventoryProducts);
							return <ViewProducts />;
							break;
						case "scanner":
							return (
								<Scanner
									user={this.state.user}
									addProductName={this.addProductName}
									toAddProductScreen={this.toAddProductScreen}
								/>
							);
							break;
					}
				})()}
				<Foot
					toAddProductScreen={this.toAddProductScreen}
					toViewProductsScreen={this.toViewProductsScreen}
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
