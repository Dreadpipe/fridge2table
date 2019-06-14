import React from "react";
import { StyleSheet, Button, View, ImageBackground, Image, Text } from "react-native";
import Freezer from "../components/freezer";
import Fridge from "../components/fridge";
import FullFridge from "../components/fullFridge";

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
        <FullFridge handlePress={this.handlePress} />
      </View>
		);
	}
}

export default Login;
