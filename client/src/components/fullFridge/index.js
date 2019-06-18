import React from "react";
import { StyleSheet, View, ImageBackground, Image } from "react-native";
import { Button, Text, Icon } from "native-base";
import { TouchableHighlight } from "react-native-gesture-handler";

const styles = StyleSheet.create({
	freezer: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center"
	},
	magnetDiv: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		top: 73
	},
	backgroundImage: {
		height: "97%",
		width: "100%",
		bottom: -57
	},
	magnet: {
		position: "relative",
		height: 30,
		width: 30
	},
	iconDiv: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between"
	},
	imageWrap: {
		width: 20,
		height: 20,
		alignItems: "center",
		justifyContent: "center",
		margin: 10
	},
	btnDiv: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center"
	},
	loginBtn: {
		backgroundColor: "#0092D6"
	}
});
// require("./fullFridge_smaller.jpg")
function FullFridge(props) {
	return (
		<ImageBackground
			style={styles.backgroundImage}
			resizeMode="contain"
			source={require("../../../assets/ClosedFridge.png")}
		>
			<View style={styles.freezer}>
				<Text style={{ fontWeight: "bold", fontSize: 20 }}>Fridge2Table</Text>
			</View>
			<View style={styles.magnetDiv}>
				<Text style={{ flexDirection: "column" }}>Friendly with... </Text>
				<Text style={styles.iconDiv}>
					<Icon name="logo-google" type="Ionicons" />{" "}
					<Icon name="logo-facebook" type="Ionicons" />
				</Text>
			</View>
			<View style={styles.btnDiv}>
				<Button large hasText style={styles.loginBtn} onPress={props.login}>
					<Text>Login</Text>
				</Button>
			</View>
			<View style={styles.freezer}>
				<Text>Fridge2Table &copy; 2019</Text>
			</View>
		</ImageBackground>
	);
}

export default FullFridge;
