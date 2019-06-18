import React from "react";
import {
	StyleSheet,
	View,
	ImageBackground
} from "react-native";

const styles = StyleSheet.create({
	backgroundImage: {
		height: "95.8%",
		width: "100%",
	}
});

function Pantry(props) {
	return (
			<ImageBackground
				style={styles.backgroundImage}
				resizeMode="contain"
				source={require("../../../assets/Pantry.png")}
			/>
	);
}

export default Pantry;
