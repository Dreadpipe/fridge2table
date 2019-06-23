import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import Constants from "expo-constants";
import { Permissions } from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios";
import API from "../../utils/API";

styles = StyleSheet.create({
	scanner: {
		flex: 1,
		justifyContent: "flex-end"
	}
});

export default class BarCodeScannerExample extends React.Component {
	state = {
		hasCameraPermission: null,
		scanned: false
	};

	async componentDidMount() {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({ hasCameraPermission: status === "granted" });
		console.log(this.props);
	}

	render() {
		const { hasCameraPermission, scanned } = this.state;

		if (hasCameraPermission === null) {
			return <Text>Requesting for camera permissions</Text>;
		}
		if (hasCameraPermission === false) {
			return <Text>No access to camera</Text>;
		}

		return (
			<View style={styles.scanner}>
				<BarCodeScanner
					onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
					style={StyleSheet.absoluteFillObject}
				/>
				{scanned && (
					<Button
						title={"Tap to Scan Again"}
						onPress={() => this.setState({ scanned: false })}
					/>
				)}
			</View>
		);
	}

	handleBarCodeScanned = ({ type, data }) => {
		this.setState({ scanned: true });
		// alert(`Bar code with type ${type} and data ${data} has been scanned!`);

		// Version in which a product is scanned and immediately added
		// API.scanFood(data, this.props.user.thirdPartyId);

		// Version in which a product is scanned to update the input form
		axios
			.get(
				`https://api.edamam.com/api/food-database/parser?upc=${data}&app_id=2738ba89&app_key=18838a2aa6866b92497c8ebae315be66`
			)
			.then(response => {
				this.props.addProductNameAndPicURL(response.data.hints[0].food.label, response.data.hints[0].food.image);
				this.props.toAddProductScreen();
			});
	};
}
