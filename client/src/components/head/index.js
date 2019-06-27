import React, { Component } from "react";
import { StyleSheet, Image, Platform } from "react-native";
import { Header, Left, Right, Button, Title, Text } from "native-base";

const styles = StyleSheet.create({
	logo: {
		height: '100%',
		width: Platform.OS === "ios" ? "70%" : "100%",
	}
});

export default class Head extends Component {
	render() {
		return (
			<Header style={styles.header}>
				<Left>
					<Image
						resizeMode="contain"
						style={styles.logo}
						source={require("../../../assets/fridge2table_logo.png")}
					/>
				</Left>
				<Right>
					<Button hasText transparent onPress={this.props.toFridge}>
						<Text>Fridge</Text>
					</Button>
					<Button hasText transparent onPress={this.props.toFreezer}>
						<Text>Freezer</Text>
					</Button>
					<Button hasText transparent onPress={this.props.toPantry}>
						<Text>Pantry</Text>
					</Button>
				</Right>
			</Header>
		);
	}
}
