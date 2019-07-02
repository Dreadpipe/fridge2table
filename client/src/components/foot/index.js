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

const styles = StyleSheet.create({
	footer: {
		backgroundColor: "#193652"
	},
	footerTab: {
		backgroundColor: "#193652"
	}
});

function Foot(props) {
	return (
		<Footer style={styles.footer}>
			<FooterTab style={styles.footerTab}>
				<Button vertical onPress={props.toAddProductScreenClear}>
					<Icon name="plus" type="FontAwesome" style={{color: '#EBF5FF'}} />
					<Text style={{color: '#EBF5FF'}}>Add New Product</Text>
				</Button>
				<Button vertical onPress={props.viewAllProducts}>
					<Icon name="search" type="FontAwesome" style={{color: '#EBF5FF'}} />
					<Text style={{color: '#EBF5FF'}}>All Products</Text>
				</Button>
			</FooterTab>
		</Footer>
	);
}

export default Foot;