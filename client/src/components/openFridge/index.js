import React from "react";
import { StyleSheet, TouchableHighlight, View, Image } from "react-native";
import { Button, Text, Icon } from "native-base";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";

const styles = StyleSheet.create({
	pageDiv: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		height: '100%',
		width: '100%'
	},
	iconDiv: {
		position: 'absolute',
		top: 7,
		left: 10,
		zIndex: 1
	},
	icon: {
		fontSize: 50,
		color: '#0092D6'
	},
	solidIconDiv: {
		position: 'absolute',
		top: 7,
		left: 10,
	},
	solidIcon: {
		fontSize: 45,
		color: '#FFFFFF'
	},
	bannerDiv: {
		display: 'flex',
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		alignContent: 'stretch',
		alignItems: 'flex-end'
	},
	banner: {
		height: 'auto',
		width: '45%'
	},
	bannerImg: {
		height: 125,
		width: '100%',
	},
	grainsImg: {
		height: 120,
		width: '100%',
	},
	meatImg: {
		height: 100,
		width: '100%',
	},
	produceImg: {
		height: 105,
		width: '100%',
	},
});

function Fridge(props) {
	return (
		<View style={styles.pageDiv}>
			<View style={styles.iconDiv}>
				<Icon name="plus-circle" type="FontAwesome" style={styles.icon} onPress={props.toAddProductScreen} />
			</View>
			<View style={styles.solidIconDiv}>
				<Icon name="circle" type="FontAwesome" style={styles.solidIcon} />
			</View>
			<View style={styles.bannerDiv}>
				<TouchableHighlight style={styles.banner}>
					<Image resizeMode='stretch' source={require('../../../assets/fridge_images/grains_banner.png')} style={styles.grainsImg} />
				</TouchableHighlight>
				<TouchableHighlight style={styles.banner}>
					<Image resizeMode='stretch' source={require('../../../assets/fridge_images/dairy_banner.png')} style={styles.bannerImg} />
				</TouchableHighlight>
				<TouchableHighlight style={styles.banner}>
					<Image resizeMode='stretch' source={require('../../../assets/fridge_images/meats_banner.png')} style={styles.meatImg} />
				</TouchableHighlight>
				<TouchableHighlight style={styles.banner}>
					<Image resizeMode='stretch' source={require('../../../assets/fridge_images/produce_banner.png')} style={styles.produceImg} />
				</TouchableHighlight>
				<TouchableHighlight style={styles.banner}>
					<Image resizeMode='stretch' source={require('../../../assets/fridge_images/drinks_banner.png')} style={styles.bannerImg} />
				</TouchableHighlight>
				<TouchableHighlight style={styles.banner}>
					<Image resizeMode='stretch' source={require('../../../assets/fridge_images/misc_banner.png')} style={styles.bannerImg} />
				</TouchableHighlight>
			</View>
		</View>
	);
}

export default Fridge;
