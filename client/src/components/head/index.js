import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {
	Header,
	Body,
	Right,
	Button,
	Title,
	Text
} from "native-base";

const styles = StyleSheet.create({
	header: {
		backgroundColor: '#009122'
	}
})

export default class Head extends Component {
	render() {
		return (
			<Header style={styles.header}>
				<Body>
					<Title>Fridge2Table</Title>
				</Body>
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