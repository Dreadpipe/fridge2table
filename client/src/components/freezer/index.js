import React from "react";
import { StyleSheet, TouchableHighlight, View, Image } from "react-native";
import { Button, Text, Icon } from "native-base";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";

const styles = StyleSheet.create({
	pageDiv: {
		display: "flex",
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		alignContent: "space-around",
		alignItems: "center",
		height: "100%",
		width: "100%",
		paddingTop: 110
	},
	iconDiv: {
		position: "absolute",
		top: 7,
		left: 10,
		zIndex: 1
	},
	icon: {
		fontSize: 50,
		color: "#0092D6"
	},
	solidIconDiv: {
		position: "absolute",
		top: 7,
		left: 10
	},
	solidIcon: {
		fontSize: 45,
		color: "#FFFFFF"
	},
	banner: {
		height: 175,
		width: "60%"
	},
	bannerImg: {
		height: 110,
		width: "100%"
	}
});

function Freezer(props) {
	return (
		<View style={styles.pageDiv}>
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
			<TouchableHighlight style={styles.banner}>
				<Image
					resizeMode="contain"
					source={require("../../../assets/freezer_images/frozen_produce_banner.png")}
					style={styles.bannerImg}
				/>
			</TouchableHighlight>
			<TouchableHighlight style={styles.banner}>
				<Image
					resizeMode="contain"
					source={require("../../../assets/freezer_images/frozen_meats_banner.png")}
					style={styles.bannerImg}
				/>
			</TouchableHighlight>
			<TouchableHighlight style={styles.banner}>
				<Image
					resizeMode="contain"
					source={require("../../../assets/freezer_images/frozen_misc_banner.png")}
					style={styles.bannerImg}
				/>
			</TouchableHighlight>
		</View>
	);
}

export default Freezer;
