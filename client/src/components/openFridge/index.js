import React from "react";
import { StyleSheet, ImageBackground, View } from "react-native";
import { Button, Text, Icon } from "native-base";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";

const styles = StyleSheet.create({
	backgroundImage: {
		height: "100%",
		width: '100%'
	},
	iconDiv: {
		top: 7,
		left: 10,
		zIndex: 1
	},
	icon: {
		fontSize: 50,
		color: '#0092D6'
	},
	solidIconDiv: {
		top: -43,
		left: 12
	},
	solidIcon: {
		fontSize: 45,
		color: '#FFFFFF'
	},
	grainsDrinksDiv: {
		display: "flex",
		flexDirection: "row",
		top: vh(24.1),
		left: vw(24.5)
	},
	dairyMeatsDiv: {
		display: "flex",
		flexDirection: "row",
		top: vh(36),
		left: vw(34)
	},
	miscProduceDiv: {
		display: "flex",
		flexDirection: "row",
		top: vh(54),
		left: vw(25)
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
		marginLeft: 15
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
			<View style={styles.iconDiv}>
				<Icon name="plus-circle" type="FontAwesome" style={styles.icon} onPress={props.toAddProductScreen} />
			</View>
			<View style={styles.solidIconDiv}>
				<Icon name="circle" type="FontAwesome" style={styles.solidIcon} />
			</View>
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
