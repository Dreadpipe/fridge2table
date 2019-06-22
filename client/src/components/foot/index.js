import React, { Component } from "react";
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
				<Button vertical>
					<Icon name="plus" type="FontAwesome" />
					<Text>Add Product</Text>
				</Button>
				<Button vertical>
					<Icon name="globe" type="FontAwesome" />
					<Text>All Products</Text>
				</Button>
			</FooterTab>
		</Footer>
	);
}

export default Foot;