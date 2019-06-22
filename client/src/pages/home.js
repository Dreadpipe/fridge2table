import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import Head from "../components/head";
import OpenFridge from "../components/openFridge";
import Freezer from "../components/freezer";
import Pantry from "../components/pantry";
import AddProduct from "../components/addProduct";
import Scanner from "../components/scanner";
import API from "../utils/API";
import { Notifications, Permissions } from "expo";
import axios from "axios";
import env from "../../env";

const styles = StyleSheet.create({
	container: {
		height: vh(100) - getStatusBarHeight() - 56,
		width: "100%"
	}
});

let expoToken = "";
const PUSH_ENDPOINT = `https://${env.IP_ADDRESS}/users/push-token`;
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
			this.setState({ user: response.data[0] });
		});
		registerForPushNotifications();
		this._notificationSubscription = Notifications.addListener(
			this._handleNotification
		);
	}

	//Notification functions

	_handleNotification = notification => {
		this.setState({ notification: notification });
	};

	sendNotification = () => {
		axios.post(`https://exp.host/--/api/v2/push/send`, {
			to: expoToken,
			title: "Title Notification",
			sound: "default",
			badge: 1,
			body: "Hello World!",
			data: {
				message: "Hey, nerd!"
			}
		});
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

	toScanner = () => {
		this.setState({ view: "scanner" });
	};

	toAddProductScreen = () => {
		this.setState({ view: "addProduct" });
	};

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
			return alert("Product added! Click OK to add more.");
		} else {
			return alert("Please make sure to fill out the entire product form");
		}
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
					toFridge={() => this.setState({ view: "fridge" })}
					toFreezer={() => this.setState({ view: "freezer" })}
					toPantry={() => this.setState({ view: "pantry" })}
				/>
				{(() => {
					switch (this.state.view) {
						case "fridge":
							return (
								<OpenFridge
									user={this.state.user}
									toAddProductScreen={this.toAddProductScreen}
								/>
							);
							break;
						case "pantry":
							return (
								<Pantry
									user={this.state.user}
									toAddProductScreen={this.toAddProductScreen}
								/>
							);
							break;
						case "freezer":
							return (
								<Freezer
									user={this.state.user}
									toAddProductScreen={this.toAddProductScreen}
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
				{this.state.notification.origin ? (
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
				)}
			</View>
		);
	}
}

export default Home;
