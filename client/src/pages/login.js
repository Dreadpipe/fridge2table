import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Linking } from "expo";
import env from "../../env";
export default class Login extends React.Component {
	state = {
		authResult: {}
	};

	handleAuth = () => {
		const auth = Linking.openURL(`http://www.${env.IP_ADDRESS}.xip.io:3001/auth/google`)

		console.log(auth)
	}

	render() {
		return (
			<View style={styles.container}>
				<Button title="Login" onPress={this.handleAuth} />
			</View>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	}
});