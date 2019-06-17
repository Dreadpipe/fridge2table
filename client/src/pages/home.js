import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Scanner from "../components/scanner";
import OpenFridge from "../components/openFridge";
import Freezer from "../components/freezer";
import Pantry from "../components/pantry";
import API from "../utils/API";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center"
	}
});

class Home extends React.Component {
	state = {
		user: {},
		scannerOn: false,
		view: "fridge"
	};

	toggleScan = () => {
		this.setState({ scannerOn: true });
	};

	componentDidMount() {
		API.getCurrentUser(this.props.user.id).then(response => {
			this.setState({ user: response.data[0] });
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>Hi, {this.state.user.username}!</Text>
				<Button
					title="fridge"
					onPress={() => this.setState({ view: "fridge" })}
				/>
				<Button
					title="freezer"
					onPress={() => this.setState({ view: "freezer" })}
				/>
				<Button
					title="pantry"
					onPress={() => this.setState({ view: "pantry" })}
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
							return <Scanner />;
							break;
					}
				})()}
				<Button title="Scan" onPress={this.toggleScan} />
				{this.state.scannerOn ? <Scanner /> : null}
			</View>
		);
	}
}

export default Home;
