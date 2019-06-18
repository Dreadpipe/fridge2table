import React from "react";
import {
	StyleSheet,
	View,
	ImageBackground
} from "react-native";
import {Button, Text} from 'native-base';

const styles = StyleSheet.create({
	backgroundImage: {
		height: "95.8%",
		width: "100%",
	},
	spiceBtn: {
		backgroundColor: '#0092D6',
		top: '12%',
		left: '10.5%'
	},
	produceBtn: {
		backgroundColor: '#0092D6',
		top: '24.5%',
		left: '21.5%'
	},
	miscBtn: {
		backgroundColor: '#0092D6',
		top: '28.5%',
		left: '30%'
	},
	canGoodsBtn: {
		backgroundColor: '#0092D6',
		top: '41%',
		left: '15%'
	},
	grainsBtn: {
		backgroundColor: '#0092D6',
		top: '60%',
		left: '38.5%'
	}
});

function Pantry(props) {
	return (
			<ImageBackground
				style={styles.backgroundImage}
				resizeMode="contain"
				source={require("../../../assets/Pantry.png")}
			>
				<Button small hasText style={styles.spiceBtn}><Text>Spice Rack</Text></Button>
				<Button small hasText style={styles.produceBtn}><Text>Produce</Text></Button>
				<Button small hasText style={styles.miscBtn}><Text>Misc</Text></Button>
				<Button small hasText style={styles.canGoodsBtn}><Text>Canned Goods</Text></Button>
				<Button small hasText style={styles.grainsBtn}><Text>Grains</Text></Button>
				</ImageBackground>
	);
}

export default Pantry;
