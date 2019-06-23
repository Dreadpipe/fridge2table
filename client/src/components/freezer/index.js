import React from "react";
import { StyleSheet, TouchableHighlight, View, Image } from "react-native";
import { Icon, Content } from "native-base";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";

const styles = StyleSheet.create({
	pageDiv: {
		display: "flex",
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		alignContent: "space-around",
		alignItems: "flex-start"
	},
	banner: {
		width: "60%"
	},
	bannerImg: {
		height: 110,
		width: "100%"
	}
});

function Freezer(props) {
	return (
		<Content contentContainerStyle={styles.pageDiv}>
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
		</Content>
	);
}

export default Freezer;
