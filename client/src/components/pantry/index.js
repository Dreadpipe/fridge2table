import React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
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
		color: "#0092D6"
	},
	solidIconDiv: {
		top: -43,
		left: 12
	},
	solidIcon: {
		fontSize: 45,
		color: "#FFFFFF"
	},
	spiceBtn: {
		backgroundColor: "#0092D6",
		top: vh(-3),
		left: vw(23)
	},
	produceBtn: {
		backgroundColor: "#0092D6",
		top: vh(5),
		left: vw(36)
	},
	miscBtn: {
		backgroundColor: "#0092D6",
		top: vh(7),
		left: vw(44)
	},
	canGoodsBtn: {
		backgroundColor: "#0092D6",
		top: vh(14),
		left: vw(24)
	},
	grainsBtn: {
		backgroundColor: "#0092D6",
		top: vh(25),
		left: vw(59)
	}
});

function Pantry(props) {
	return (
		<ImageBackground
			style={styles.backgroundImage}
			resizeMode="contain"
			source={require("../../../assets/Pantry.png")}
		>
			<View style={styles.iconDiv}>
				<Icon
					name="plus-circle"
					type="FontAwesome"
					style={styles.icon}
					onPress={props.toAddProductScreen}
				/>
			</View>
			<View style={styles.solidIconDiv}>
				<Icon name="circle" type="FontAwesome" style={styles.solidIcon} />
			</View>
			<Button small hasText style={styles.spiceBtn}>
				<Text>Spice Rack</Text>
			</Button>
			<Button small hasText style={styles.produceBtn}>
				<Text>Produce</Text>
			</Button>
			<Button small hasText style={styles.miscBtn}>
				<Text>Misc</Text>
			</Button>
			<Button small hasText style={styles.canGoodsBtn}>
				<Text>Canned Goods</Text>
			</Button>
			<Button small hasText style={styles.grainsBtn}>
				<Text>Grains</Text>
			</Button>
		</ImageBackground>
	);
}

export default Pantry;
