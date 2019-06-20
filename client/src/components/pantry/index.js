import React from "react";
import { StyleSheet, View, TouchableHighlight, Image } from "react-native";
import { Button, Text, Icon } from "native-base";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";

const styles = StyleSheet.create({
	pageDiv: {
		display: "flex",
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignContent: "center",
		alignItems: "center",
		height: "100%",
		width: "100%"
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
	bannerDiv: {
		display: "flex",
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-around",
		alignContent: "stretch",
		alignItems: "flex-end"
	},
	banner: {
		width: "45%"
	},
	bannerImg: {
		height: 135,
		width: "100%"
	},
	grainsImg: {
		height: 120,
		width: "100%"
	},
	produceImg: {
		height: 140,
		width: "100%"
	},
	spicesImg: {
		height: 120,
		width: "100%"
	}
});

function Pantry(props) {
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
			<View style={styles.bannerDiv}>
				<TouchableHighlight style={styles.banner}>
					<Image
						resizeMode="stretch"
						source={require("../../../assets/pantry_images/pantry_grains_banner.png")}
						style={styles.grainsImg}
					/>
				</TouchableHighlight>
				<TouchableHighlight style={styles.banner}>
					<Image
						resizeMode="stretch"
						source={require("../../../assets/pantry_images/pantry_produce_banner.png")}
						style={styles.bannerImg}
					/>
				</TouchableHighlight>
				<TouchableHighlight style={styles.banner}>
					<Image
						resizeMode="stretch"
						source={require("../../../assets/pantry_images/pantry_cans_banner.png")}
						style={styles.bannerImg}
					/>
				</TouchableHighlight>
				<TouchableHighlight style={styles.banner}>
					<Image
						resizeMode="stretch"
						source={require("../../../assets/pantry_images/pantry_spices_banner.png")}
						style={styles.spicesImg}
					/>
				</TouchableHighlight>
				<TouchableHighlight style={styles.banner}>
					<Image
						resizeMode="stretch"
						source={require("../../../assets/pantry_images/pantry_misc_banner.png")}
						style={styles.bannerImg}
					/>
				</TouchableHighlight>
			</View>
		</View>
	);
}

export default Pantry;
