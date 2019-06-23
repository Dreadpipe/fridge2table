import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {
	Container,
	Header,
	Content,
	Footer,
	FooterTab,
	Button,
	Icon,
	Text
} from "native-base";

function Foot(props) {
	return (
		<Footer>
			<FooterTab>
				<Button vertical onPress={props.toAddProductScreen}>
					<Icon name="plus" type="FontAwesome" />
					<Text>Add Product</Text>
				</Button>
				<Button vertical onPress={props.viewAllProducts}>
					<Icon name="search" type="FontAwesome" />
					<Text>All Products</Text>
				</Button>
			</FooterTab>
		</Footer>
	);
}

export default Foot;