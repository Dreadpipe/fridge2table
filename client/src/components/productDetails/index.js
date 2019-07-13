import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
	Content,
	List,
	ListItem,
	Text,
	H1,
	Icon,
	Left,
	Body,
	Right,
	Switch,
	Button,
	Thumbnail
} from "native-base";

const styles = StyleSheet.create({
	content: {
		flex: 1,
		padding: 20,
		backgroundColor: "#EBF5FF"
	}
});

function ProductDetail(props) {
	console.log(props.product);
	return (
		<Content contentContainerStyle={styles.content}>
			<View>
				<H1>{props.product.productname}</H1>
				<Thumbnail
					square
					small
					source={
						props.product.pic
							? { uri: props.product.pic }
							: require("../../../assets/general-food.png")
					}
				/>
			</View>
		</Content>
	);
}

export default ProductDetail;
