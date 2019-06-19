import React from "react";
import { StyleSheet, ImageBackground, View } from "react-native";
import { Button, Text } from "native-base";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";

const styles = StyleSheet.create({
	backgroundImage: {
		height: "96.9%",
		width: '100%'
	},
	grainsDrinksDiv: {
		display: "flex",
		flexDirection: "row",
		top: '58.5%',
		left: '15.5%'
	},
	dairyMeatsDiv: {
		display: "flex",
		flexDirection: "row",
		top: "76.5%",
		left: "21.5%"
	},
	miscProduceDiv: {
		display: "flex",
		flexDirection: "row",
		top: "108%",
		left: "17.8%"
	},
	grainsBtn: {
		backgroundColor: "#0092D6"
	},
	drinksBtn: {
		backgroundColor: "#0092D6",
		marginLeft: 3
	},
	dairyBtn: {
		backgroundColor: "#0092D6"
	},
	meatsBtn: {
		backgroundColor: "#0092D6",
		marginLeft: 23
	},
	miscBtn: {
		backgroundColor: "#0092D6"
	},
	produceBtn: {
		backgroundColor: "#0092D6",
		marginLeft: 35
	}
});

function Fridge(props) {
	return (
		<ImageBackground
			style={styles.backgroundImage}
			resizeMode="contain"
			source={require("../../../assets/OpenFridge.png")}
		>
			<View style={styles.grainsDrinksDiv}>
				<Button small hasText style={styles.grainsBtn}>
					<Text>Grains</Text>
				</Button>
				<Button small hasText style={styles.drinksBtn}>
					<Text>Drinks</Text>
				</Button>
			</View>
			<View style={styles.dairyMeatsDiv}>
				<Button small hasText style={styles.dairyBtn}>
					<Text>Dairy</Text>
				</Button>
				<Button small hasText style={styles.meatsBtn}>
					<Text>Meats</Text>
				</Button>
			</View>
			<View style={styles.miscProduceDiv}>
				<Button small hasText style={styles.miscBtn}>
					<Text>Misc</Text>
				</Button>
				<Button small hasText style={styles.produceBtn}>
					<Text>Produce</Text>
				</Button>
			</View>
		</ImageBackground>
	);
}

export default Fridge;
