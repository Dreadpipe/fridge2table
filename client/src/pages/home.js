import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Scanner from "../components/scanner";
import OpenFridge from "../components/openFridge";
import Freezer from "../components/freezer";
import Pantry from "../components/pantry";
import API from "../utils/API";

const styles = StyleSheet.create({
	container: {
		display: "flex",
		justifyContent: "center",
		width: "100%"
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
							return <Scanner user={this.state.user} />;
							break;
					}
				})()}
				<Button
					title="Scan"
					onPress={() => this.setState({ view: "scanner" })}
				/>
			</View>
		);
	}
}

export default Home;
