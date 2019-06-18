import React from "react";
import { StyleSheet, ImageBackground } from "react-native";

const styles = StyleSheet.create({
	backgroundImage: {
		height: "96.9%",
		width: "100%"
	}
});

function Fridge(props) {
	return (
		<ImageBackground
			style={styles.backgroundImage}
			resizeMode="contain"
			source={require("../../../assets/OpenFridge.png")}
		/>
	);
}

export default Fridge;
