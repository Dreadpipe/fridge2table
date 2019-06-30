import React from "react";
import { StyleSheet, TouchableHighlight, View, Image } from "react-native";
import { Content, Toast, Icon } from "native-base";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";

const styles = StyleSheet.create({
	pageDiv: {
		display: "flex",
		flex: 1,
		flexDirection: "column",
		justifyContent: "flex-start",
		alignContent: "center",
		alignItems: "center",
		backgroundColor: "#EBF5FF"
	},
	bannerDiv: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-around",
		alignContent: "space-around",
		alignItems: "flex-start",
		height: "100%"
	},
	banner: {
		height: "auto",
		width: "45%"
	},
	bannerImg: {
		height: 125,
		width: "100%"
	},
	disabledBannerImg: {
		height: 125,
		width: "100%",
		opacity: 0.3
	},
	grainsImg: {
		height: 132,
		width: "100%"
	},
	disabledGrainsImg: {
		height: 132,
		width: "100%",
		opacity: 0.3
	},
	meatImg: {
		height: 110,
		width: "100%"
	},
	disabledMeatImg: {
		height: 110,
		width: "100%",
		opacity: 0.3
	},
	produceImg: {
		height: 105,
		width: "100%"
	},
	disabledProduceImg: {
		height: 105,
		width: "100%",
		opacity: 0.3
	}
});

const noItemsToast = () => {
	Toast.show({
		text: `You haven't added any items in this category. Click "Add New Product" below!`,
		buttonText: "Okay",
		position: "bottom",
		type: "warning",
		duration: 30000,
		style: { marginBottom: vh(9) }
	});
};

function Fridge(props) {
	return (
		<Content contentContainerStyle={styles.pageDiv}>
			<View style={styles.bannerDiv}>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.countGrains === 0 ? noItemsToast : props.viewGrains}
				>
					<Image
						resizeMode="contain"
						source={require("../../../assets/fridge_images/grains_banner.png")}
						style={
							props.countGrains === 0
								? styles.disabledGrainsImg
								: styles.grainsImg
						}
					/>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.countDairy === 0 ? noItemsToast : props.viewDairy}
				>
					<Image
						resizeMode="contain"
						source={require("../../../assets/fridge_images/dairy_banner.png")}
						style={
							props.countDairy === 0
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
						source={require("../../../assets/fridge_images/meats_banner.png")}
						style={
							props.countMeats === 0 ? styles.disabledMeatImg : styles.meatImg
						}
					/>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.countProduce === 0 ? noItemsToast : props.viewProduce}
				>
					<Image
						resizeMode="contain"
						source={require("../../../assets/fridge_images/produce_banner.png")}
						style={
							props.countProduce === 0
								? styles.disabledProduceImg
								: styles.produceImg
						}
					/>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.countDrinks === 0 ? noItemsToast : props.viewDrinks}
				>
					<Image
						resizeMode="contain"
						source={require("../../../assets/fridge_images/drinks_banner.png")}
						style={
							props.countDrinks === 0
								? styles.disabledBannerImg
								: styles.bannerImg
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
						source={require("../../../assets/fridge_images/misc_banner.png")}
						style={
							props.countMisc === 0
								? styles.disabledBannerImg
								: styles.bannerImg
						}
					/>
				</TouchableHighlight>
			</View>
		</Content>
	);
}

export default Fridge;
