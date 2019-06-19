import React from "react";
import { StyleSheet, ImageBackground, View } from "react-native";
import {Button, Text} from 'native-base';

const styles = StyleSheet.create({
	backgroundImage: {
		height: "96.9%",
		width: "100%"
	},
	produceMeatsDiv: {
		display: 'flex',
		flexDirection: 'row',
		top: '13.5%',
		left: '19.2%'
	},
	miscBtn: {
		backgroundColor: '#0092D6',
		top: '8.1%',
		left: '33.3%'
	},
	produceBtn: {
		backgroundColor: '#0092D6'
	},
	meatsBtn: {
		backgroundColor: '#0092D6',
		marginLeft: 3
	}
});

function Freezer(props) {
	return (
		<ImageBackground
			style={styles.backgroundImage}
			resizeMode="contain"
			source={require("../../../assets/OpenFreezer.png")}
		>
			<Button small hasText style={styles.miscBtn}><Text>Misc</Text></Button>
			<View style={styles.produceMeatsDiv}>
				<Button small hasText style={styles.produceBtn}><Text>Produce</Text></Button>
				<Button small hasText style={styles.meatsBtn}><Text>Meats</Text></Button>
			</View>
			</ImageBackground>
	);
}

export default Freezer;
