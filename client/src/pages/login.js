import React from "react";
import { StyleSheet, Button, View, ImageBackground, Image, Text } from "react-native";
import Freezer from "../components/freezer";
import Fridge from "../components/fridge";
import FullFridge from "../components/fullFridge";
import { Linking } from "expo";
import env from "../../env";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
  }
});

export default class Login extends React.Component {
	state = {
		authResult: {}
	};

	handlePress = () => {
		this.props.navigation.navigate('Home');
	}

	render() {
		return (
      <View style={styles.container}>
        <FullFridge handlePress={this.handlePress} />
      </View>
		);
	}
}