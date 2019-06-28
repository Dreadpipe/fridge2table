import React from "react";
import { StyleSheet, TouchableHighlight, View, Image } from "react-native";
import { Content, Icon } from "native-base";
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
	grainsImg: {
		height: 132,
		width: "100%"
	},
	meatImg: {
		height: 110,
		width: "100%"
	},
	produceImg: {
		height: 105,
		width: "100%"
	}
});

function Fridge(props) {
	return (
		<Content contentContainerStyle={styles.pageDiv}>
			<View style={styles.bannerDiv}>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.viewGrains}
				>
					<Image
						resizeMode="contain"
						source={require("../../../assets/fridge_images/grains_banner.png")}
						style={styles.grainsImg}
					/>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.viewDairy}
				>
					<Image
						resizeMode="contain"
						source={require("../../../assets/fridge_images/dairy_banner.png")}
						style={styles.bannerImg}
					/>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.viewMeats}
				>
					<Image
						resizeMode="contain"
						source={require("../../../assets/fridge_images/meats_banner.png")}
						style={styles.meatImg}
					/>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.viewProduce}
				>
					<Image
						resizeMode="contain"
						source={require("../../../assets/fridge_images/produce_banner.png")}
						style={styles.produceImg}
					/>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.viewDrinks}
				>
					<Image
						resizeMode="contain"
						source={require("../../../assets/fridge_images/drinks_banner.png")}
						style={styles.bannerImg}
					/>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.viewMisc}
				>
					<Image
						resizeMode="contain"
						source={require("../../../assets/fridge_images/misc_banner.png")}
						style={styles.bannerImg}
					/>
				</TouchableHighlight>
			</View>
		</Content>
	);
}

export default Fridge;
