import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Scanner from "../components/scanner";
import API from "../utils/API";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center"
	}
});

class Home extends React.Component {
	state = {
		callResults: "",
		scannerOn: false
	};

	toggleScan = () => {
		this.setState({scannerOn: true});
	};


	render() {
		return (
			<View style={styles.container}>
				<Button title="Scan" onPress={this.toggleScan} />
				{this.state.scannerOn ? <Scanner /> : null}
			</View>
		);
	}
}

export default Home;
