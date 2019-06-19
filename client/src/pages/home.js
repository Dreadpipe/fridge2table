import React from "react";
import { StyleSheet, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import Head from "../components/head";
import OpenFridge from "../components/openFridge";
import Freezer from "../components/freezer";
import Pantry from "../components/pantry";
import AddProduct from '../components/addProduct';
import Scanner from "../components/scanner";
import API from "../utils/API";

const styles = StyleSheet.create({
	container: {
		height: vh(100) - getStatusBarHeight() - 56,
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
				<Head
					toFridge={() => this.setState({ view: "fridge" })}
					toFreezer={() => this.setState({ view: "freezer" })}
					toPantry={() => this.setState({ view: "pantry" })}
				/>
				{(() => {
					switch (this.state.view) {
						case "fridge":
							return <OpenFridge user={this.state.user} toAddProductScreen={() => this.setState({ view: "addProduct" })} />;
							break;
						case "pantry":
							return <Pantry user={this.state.user} toAddProductScreen={() => this.setState({ view: "addProduct" })}  />;
							break;
						case "freezer":
							return <Freezer user={this.state.user} toAddProductScreen={() => this.setState({ view: "addProduct" })} />;
							break;
						case 'addProduct':
							return <AddProduct user={this.state.user} />
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
