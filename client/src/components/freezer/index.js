import React from "react";
import { StyleSheet, TouchableHighlight, View, Image } from "react-native";
import { Icon, Content, Toast } from "native-base";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";

const styles = StyleSheet.create({
	pageDiv: {
		display: "flex",
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		alignContent: "space-around",
		alignItems: "flex-start",
		backgroundColor: "#EBF5FF"
	},
	banner: {
		width: "60%"
	},
	bannerImg: {
		height: 110,
		width: "100%"
	},
	disabledBannerImg: {
		height: 110,
		width: "100%",
		opacity: 0.3
	}
});

const noItemsToast = () => {
	Toast.show({
		text: `You haven't added any items in this category. Click "New Product" below!`,
		buttonText: "Okay",
		position: "bottom",
		type: "warning",
		duration: 30000,
		style: { marginBottom: vh(9) }
	});
};

function Freezer(props) {
	return (
		<Content contentContainerStyle={styles.pageDiv}>
			<TouchableHighlight
				style={styles.banner}
				underlayColor="#EBF5FF"
				activeOpacity={0.5}
				onPress={props.countProduce === 0 ? noItemsToast : props.viewProduce}
			>
				<Image
					resizeMode="contain"
					source={require("../../../assets/freezer_images/frozen_produce_banner.png")}
					style={
						props.countProduce === 0
							? styles.disabledBannerImg
							: styles.bannerImg
					}
				/>
			</TouchableHighlight>
			<TouchableHighlight
				style={styles.banner}
				underlayColor="#EBF5FF"
				activeOpacity={0.5}
				onPress={props.countMeats === 0 ? noItemsToast : props.viewMeats}
			>
				<Image
					resizeMode="contain"
					source={require("../../../assets/freezer_images/frozen_meats_banner.png")}
					style={
						props.countMeats === 0 ? styles.disabledBannerImg : styles.bannerImg
					}
				/>
			</TouchableHighlight>
			<TouchableHighlight
				style={styles.banner}
				underlayColor="#EBF5FF"
				activeOpacity={0.5}
				onPress={props.countMisc === 0 ? noItemsToast : props.viewMisc}
			>
				<Image
					resizeMode="contain"
					source={require("../../../assets/freezer_images/frozen_misc_banner.png")}
					style={
						props.countMisc === 0 ? styles.disabledBannerImg : styles.bannerImg
					}
				/>
			</TouchableHighlight>
		</Content>
	);
}

export default Freezer;
