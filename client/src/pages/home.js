import React from "react";
import { StyleSheet, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import Head from "../components/head";
import OpenFridge from "../components/openFridge";
import Freezer from "../components/freezer";
import Pantry from "../components/pantry";
import AddProduct from "../components/addProduct";
import Scanner from "../components/scanner";
import API from "../utils/API";

const styles = StyleSheet.create({
	container: {
		height: vh(100) - getStatusBarHeight() - 56,
		width: "100%"
	}
});

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {},
			view: "fridge",
			productName: "",
			selectedLocation: "Fridge",
			selectedCategory: undefined,
			selectedQuantity: undefined,
			chosenDate: new Date()
		};
		this.setDate = this.setDate.bind(this);
	}

	// Mounting function

	componentDidMount() {
		API.getCurrentUser(this.props.user.id).then(response => {
			this.setState({ user: response.data[0] });
		});
	}

	// Input-form functions:

	setDate(newDate) {
		this.setState({ chosenDate: newDate });
	}

	onNameChange = e => {
		const productName = e.nativeEvent.text;
		this.setState({ productName });
	};

	onLocationChange(value: string) {
		this.setState({
			selectedLocation: value
		});
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
			this.state.selectedCategory &&
			this.state.selectedLocation &&
			this.state.selectedQuantity
		) {
			const newProduct = {
				name: this.state.productName,
				category: this.state.selectedCategory,
				location: this.state.selectedLocation,
				quantity: this.state.selectedQuantity,
				userId: this.state.user._id
			};
			API.addFood(newProduct);
		} else {
			return alert('Please make sure to fill out the entire product form')
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
									date={this.state.chosenDate}
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
				{/* <Button
					title="Scan"
					onPress={() => this.setState({ view: "scanner" })}
				/> */}
			</View>
		);
	}
}

export default Home;
