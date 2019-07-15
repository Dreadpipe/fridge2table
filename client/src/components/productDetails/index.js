import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
	Content,
	List,
	ListItem,
	Text,
	H1,
	H3,
	Icon,
	Left,
	Body,
	Right,
	Switch,
	Button,
	Thumbnail
} from "native-base";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";

const styles = StyleSheet.create({
	content: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-around",
		padding: 20,
		backgroundColor: "#EBF5FF"
	},
	nameDiv: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	detailsDiv: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-between",
		height: vh(25)
	},
	expRow: {
		display: "flex",
		flexDirection: "row"
	},
	btnDiv: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		alignContent: 'center',
		justifyContent: 'center',
		textAlign: 'center'
		
	}
});

function ProductDetail(props) {
	console.log(props.product);
	return (
		<Content contentContainerStyle={styles.content}>
			<View style={styles.nameDiv}>
				<H1>{props.product.productname}</H1>
				<Thumbnail
					square
					large
					source={
						props.product.pic
							? { uri: props.product.pic }
							: require("../../../assets/general-food.png")
					}
				/>
			</View>
			<View style={styles.detailsDiv}>
				<H3>Location: {props.product.location}</H3>
				<H3>Category: {props.product.category}</H3>
				<H3>Quantity: {props.product.quantity}</H3>
				{(() => {
					// Function to calculate difference between dates taken in part from this resource: https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
					const _MS_PER_DAY = 1000 * 60 * 60 * 24;

					function dateDiffInDays(a, b) {
						// Discarding time and time-zone info
						const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
						const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

						return Math.floor((utc1 - utc2) / _MS_PER_DAY);
					}

					// test it
					const a = new Date();
					const b = new Date(props.product.dateAdded);
					const difference = dateDiffInDays(a, b);
					return <H3>Added: {difference}d ago</H3>;
				})()}
				{(() => {
					// Function to calculate difference between dates taken in part from this resource: https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
					const _MS_PER_DAY = 1000 * 60 * 60 * 24;

					function dateDiffInDays(a, b) {
						// Discarding time and time-zone info
						const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
						const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

						return Math.floor((utc1 - utc2) / _MS_PER_DAY);
					}

					// test it
					const a = new Date(props.product.expDate);
					const b = new Date();
					const difference = dateDiffInDays(a, b);

					if (difference <= 0) {
						return (
							<View style={styles.expRow}>
								<H3>Expires in: </H3>
								<Icon
									name="skull"
									type="MaterialCommunityIcons"
									style={{ color: "#000000", fontSize: 20 }}
								/>
								<H3> (already expired)</H3>
							</View>
						);
					} else if (difference > 0 && difference <= 2) {
						return (
							<View style={styles.expRow}>
								<H3>Expires in:</H3>
								<H3 style={{ color: "#FF0000" }}> {difference}d </H3>
								<Icon
									name="hourglass-half"
									type="FontAwesome"
									style={{ color: "#FF0000", fontSize: 18 }}
								/>
							</View>
						);
					} else if (difference > 2 && difference <= 7) {
						return (
							<View style={styles.expRow}>
								<H3>Expires in:</H3>
								<H3 style={{ color: "#ffa200" }}> {difference}d </H3>
								<Icon
									name="hourglass-half"
									type="FontAwesome"
									style={{ color: "#ffa200", fontSize: 18 }}
								/>
							</View>
						);
					} else {
						return (
							<View style={styles.expRow}>
								<H3>Expires in:</H3>
								<H3 style={{ color: "#8F8F8F" }}> {difference}d </H3>
								<Icon
									name="hourglass-half"
									type="FontAwesome"
									style={{ color: "#8F8F8F", fontSize: 18 }}
								/>
							</View>
						);
					}
				})()}
			</View>
			<View style={styles.btnDiv}>
				<Button success onPress={() => props.editProduct(props.product._id)}>
					<Icon name="edit" type="FontAwesome" />
					<Text>Edit</Text>
				</Button>
				<Button danger onPress={() => props.deleteProduct(props.product._id)}>
					<Icon name="trash" type="FontAwesome" />
					<Text>Delete </Text>
				</Button>
			</View>
		</Content>
	);
}

export default ProductDetail;
