import React from "react";
import { StyleSheet, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import Head from "../components/head";
import OpenFridge from "../components/openFridge";
import Freezer from "../components/freezer";
import Pantry from "../components/pantry";
import Scanner from "../components/scanner";
import API from "../utils/API";

const screenheight = vh(100) - getStatusBarHeight();

const styles = StyleSheet.create({
	container: {
		height: screenheight,
		width: '100%'
	}
});

class Home extends React.Component {
	state = {
		user: {},
		view: "fridge"
	};

	componentDidMount() {
		API.getCurrentUser(this.props.user.id).then(response => {
			this.setState({ user: response.data[0] });
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Head style={styles.header}
					toFridge={() => this.setState({ view: "fridge" })}
					toFreezer={() => this.setState({ view: "freezer" })}
					toPantry={() => this.setState({ view: "pantry" })}
				/>
				{(() => {
					switch (this.state.view) {
						case "fridge":
							return <OpenFridge />;
							break;
						case "pantry":
							return <Pantry />;
							break;
						case "freezer":
							return <Freezer />;
							break;
						case "scanner":
							return <Scanner user={this.state.user} />;
							break;
					}
				})()}
				{/* <Button
					title="Scan"
					onPress={() => this.setState({ view: "scanner" })}
				/> */}
			</View>
		);
	}
}

export default Home;
