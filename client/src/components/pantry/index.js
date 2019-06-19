import React from "react";
import {
	StyleSheet,
	Button,
	View,
	ImageBackground,
	Image,
	Text
} from "react-native";

const styles = StyleSheet.create({
	container: {
		display: "flex",
		justifyContent: "center",
		width: "100%"
	},
	backgroundImage: {
		height: "97.7%",
		width: "100%",
		top: "6%"
	}
});

function Pantry(props) {
	return (
		<View style={styles.container}>
			<ImageBackground
				style={styles.backgroundImage}
				resizeMode="contain"
				source={require("../../../assets/Pantry.png")}
			/>
		</View>
	);
}

export default Pantry;
