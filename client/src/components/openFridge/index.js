import React from "react";
import { StyleSheet, ImageBackground, View } from "react-native";
import { Button, Text } from "native-base";

const styles = StyleSheet.create({
	backgroundImage: {
		height: "96.9%",
		width: "100%"
	},
	grainsDrinksDiv: {
		display: 'flex',
		flexDirection: 'row',
		top: '58.5%',
		left: '15.5%',
	},
	dairyMeatsDiv: {
		display: 'flex',
		flexDirection: 'row',
		top: '76.5%',
		left: '21.5%',
	},
	miscProduceDiv: {
		display: 'flex',
		flexDirection: 'row',
		top: '108%',
		left: '17.8%',
	},
	grainsBtn: {
		
	},
	drinksBtn: {
		
		marginLeft: 3,
	},
	dairyBtn: {
		
	},
	meatsBtn: {
		
		marginLeft: 23,
	},
	miscBtn: {
		
	},
	produceBtn: {
		
		marginLeft: 35,
	}
});

function Fridge(props) {
	return (
		<ImageBackground
			style={styles.backgroundImage}
			resizeMode="contain"
			source={require("../../../assets/OpenFridge.png")}
		>
			<View style={styles.grainsDrinksDiv}>
				<Button small hasText transparent style={styles.grainsBtn}><Text>Grains</Text></Button>
				<Button small hasText transparent style={styles.drinksBtn}><Text>Drinks</Text></Button>
			</View>
			<View style={styles.dairyMeatsDiv}>
				<Button small hasText transparent style={styles.dairyBtn}><Text>Dairy</Text></Button>
				<Button small hasText transparent style={styles.meatsBtn}><Text>Meats</Text></Button>
			</View>
			<View style={styles.miscProduceDiv}>
				<Button small hasText transparent style={styles.miscBtn}><Text>Misc</Text></Button>
				<Button small hasText transparent style={styles.produceBtn}><Text>Produce</Text></Button>
			</View>
		</ImageBackground>
	);
}

export default Fridge;
