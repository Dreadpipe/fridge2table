import React from "react";
import { StyleSheet, ImageBackground, View } from "react-native";
import { Button, Text, Icon } from "native-base";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";

const styles = StyleSheet.create({
	backgroundImage: {
		height: "100%",
		width: "100%"
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
	produceMeatsDiv: {
		display: "flex",
		flexDirection: "row",
		top: vh(-2),
		left: vw(28.5)
	},
	miscBtn: {
		backgroundColor: "#0092D6",
		top: vh(-6),
		left: vw(55)
	},
	produceBtn: {
		backgroundColor: "#0092D6"
	},
	meatsBtn: {
		backgroundColor: "#0092D6",
		marginLeft: 3
	}
});

function Freezer(props) {
	return (
		<ImageBackground
			style={styles.backgroundImage}
			resizeMode="contain"
			source={require("../../../assets/OpenFreezer.png")}
		>
			<View style={styles.iconDiv} >
				<Icon name="plus-circle" type="FontAwesome" style={styles.icon} onPress={props.toAddProductScreen} />
			</View>
			<View style={styles.solidIconDiv}>
				<Icon name="circle" type="FontAwesome" style={styles.solidIcon} />
			</View>
			<Button small hasText style={styles.miscBtn}>
				<Text>Misc</Text>
			</Button>
			<View style={styles.produceMeatsDiv}>
				<Button small hasText style={styles.produceBtn}>
					<Text>Produce</Text>
				</Button>
				<Button small hasText style={styles.meatsBtn}>
					<Text>Meats</Text>
				</Button>
			</View>
		</ImageBackground>
	);
}

export default Freezer;
