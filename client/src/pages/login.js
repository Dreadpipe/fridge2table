import React from "react";
import { StyleSheet, Button, View } from "react-native";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center"
	}
});

class Login extends React.Component {
	state = {};

	handlePress = () => {
		this.props.navigation.navigate("Home");
	};

	render() {
		return (
			<View style={styles.container}>
				<Button title="Login" onPress={this.handlePress} />
			</View>
		);
	}
}

export default Login;
