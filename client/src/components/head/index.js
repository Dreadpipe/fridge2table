import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {
	Header,
	Left,
	Right,
	Button,
	Title,
	Text
} from "native-base";

const styles = StyleSheet.create({
})

export default class Head extends Component {
	render() {
		return (
			<Header>
				<Left>
					<Title>Fridge2Table</Title>
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
