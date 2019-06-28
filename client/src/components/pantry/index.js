import React from "react";
import { StyleSheet, View, TouchableHighlight, Image } from "react-native";
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
		height: "100%",
		width: "100%",
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
		<Content contentContainerStyle={styles.pageDiv}>
			<View style={styles.bannerDiv}>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.viewGrains}
				>
					<Image
						resizeMode="stretch"
						source={require("../../../assets/pantry_images/pantry_grains_banner.png")}
						style={styles.grainsImg}
					/>
				</TouchableHighlight>c
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.viewSpices}
				>
					<Image
						resizeMode="stretch"
						source={require("../../../assets/pantry_images/pantry_spices_banner.png")}
						style={styles.spicesImg}
					/>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.viewProduce}
				>
					<Image
						resizeMode="stretch"
						source={require("../../../assets/pantry_images/pantry_produce_banner.png")}
						style={styles.bannerImg}
					/>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.viewCans}
				>
					<Image
						resizeMode="stretch"
						source={require("../../../assets/pantry_images/pantry_cans_banner.png")}
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
						resizeMode="stretch"
						source={require("../../../assets/pantry_images/pantry_misc_banner.png")}
						style={styles.bannerImg}
					/>
				</TouchableHighlight>
			</View>
		</Content>
	);
}

export default Pantry;
