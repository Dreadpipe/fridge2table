import React from "react";
import { StyleSheet, View, ImageBackground, Image } from "react-native";
import { Button, Text, Icon } from "native-base";
("react-native-status-bar-height");
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import { TouchableHighlight } from "react-native-gesture-handler";

const styles = StyleSheet.create({
	loginDiv: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#EBF5FF"
	},
	backgroundImage: {
		top: 20,
		height: "96%",
		width: "100%"
	},
	freezer: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center"
	},
	logo: {
		height: vh(6)
	},
	magnetDiv: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		width: "100%"
	},
	magnet: {
		position: "relative",
		height: 30,
		width: 30
	},
	iconDiv: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 15
	},
	googleDiv: {
		transform: [{ rotate: "-12deg" }],
		marginRight: 25
	},
	facebookDiv: {
		transform: [{ rotate: "15deg" }]
	},
	googleIcon: {
		color: "#ea4335",
		fontSize: 43,
		textShadowColor: "rgba(0, 0, 0, 0.75)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2
	},
	facebookIcon: {
		color: "#4267b2",
		fontSize: 43,
		textShadowColor: "rgba(0, 0, 0, 0.75)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2
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
		backgroundColor: "#193652"
	}
});
// require("./fullFridge_smaller.jpg")
function FullFridge(props) {
	return (
		<View style={styles.loginDiv}>
			<ImageBackground
				style={styles.backgroundImage}
				resizeMode="contain"
				source={require("../../../assets/login_fridge_white.png")}
			>
				<View style={styles.freezer}>
					<Image
						style={styles.logo}
						resizeMode="contain"
						source={require("../../../assets/fridge2table_logo.png")}
					/>
				</View>
				<View style={styles.magnetDiv}>
					<Text style={{ flexDirection: "column" }}>Friendly with ... </Text>
					<View style={styles.iconDiv}>
						<View style={styles.googleDiv}>
							<Icon
								style={styles.googleIcon}
								name="google"
								type="FontAwesome"
							/>
						</View>
						<View style={styles.facebookDiv}>
							<Icon
								style={styles.facebookIcon}
								name="facebook-f"
								type="FontAwesome"
							/>
						</View>
					</View>
				</View>
				<View style={styles.btnDiv}>
					<Button large hasText style={styles.loginBtn} onPress={props.login}>
						<Text>Login</Text>
					</Button>
				</View>
				<View style={styles.freezer}>
					<Text style={{fontSize: 10}}>Fridge2Table &copy; 2019</Text>
				</View>
			</ImageBackground>
		</View>
	);
}

export default FullFridge;
