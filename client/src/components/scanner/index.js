import React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { vw } from 'react-native-expo-viewport-units';
import { Permissions } from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import _ from 'lodash';

styles = StyleSheet.create({
	scanner: {
		flex: 1,
		justifyContent: 'flex-end'
	},
	targeter: {
		position: 'absolute',
		height: vw(80),
		width: vw(80),
		borderColor: 'white',
		borderWidth: 3,
		borderStyle: 'dashed',
		borderRadius: 5,
		left: vw(10),
		top: '22%'
	}
});

export default class BarCodeScannerExample extends React.Component {
	state = {
		hasCameraPermission: null,
		scanned: false
	};

	async componentDidMount() {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({ hasCameraPermission: status === 'granted' });
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
				<View style={styles.targeter} />
				{scanned && (
					<Button
						title={'Tap to Scan Again'}
						onPress={() => this.setState({ scanned: false })}
					/>
				)}
			</View>
		);
	}

	handleBarCodeScanned = ({ data }) => {
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
				function toTitleCase(str) {
					return str.replace(/\w\S*/g, function(txt) {
						return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
					});
				}

				this.props.addProductNameAndPicURL(
					toTitleCase(response.data.hints[0].food.label),
					response.data.hints[0].food.image
				);
				alert('Product name found!');
				this.props.toAddProductScreen();
			})
			.catch(err => {
				if (err) {
					alert('Sorry, product not found. Please enter the name manually.');
					this.props.toAddProductScreen();
				}
			});
	};
}
