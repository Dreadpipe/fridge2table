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
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#EBF5FF"
	},
	nameDiv: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%"
	},
	detailsDiv: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		width: "100%",
		marginTop: vh(3),
		marginBottom: vh(3)
	},
	detailLine: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		height: 40,
		borderTopWidth: 1,
		borderTopColor: "#8F8F8F",
		padding: 8,
		width: "100%"
	},
	expRow: {
		display: "flex",
		flexDirection: "row",
		alignItems: 'center',
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderTopColor: "#8F8F8F",
		borderBottomColor: "#8F8F8F",
		padding: 8,
		height: 40,
		width: "100%"
	},
	btnDiv: {
		display: "flex",
		flexDirection: "column",
		width: 200
	},
	btn: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		height: vh(9),
		width: 200,
		marginBottom: 8
	}
});

function ProductDetail(props) {
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
				<View style={styles.detailLine}>
					<H3>Location: {props.product.location}</H3>
				</View>
				<View style={styles.detailLine}>
					<H3>Category: {props.product.category}</H3>
				</View>
				<View style={styles.detailLine}>
					<H3>Quantity: {props.product.quantity}</H3>
				</View>
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
					return (
						<View style={styles.detailLine}>
							<H3>Added: {difference}d ago</H3>
						</View>
					);
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
				<Button
					success
					style={styles.btn}
					onPress={() => props.editProduct(props.product._id)}
				>
					<Icon name="edit" type="FontAwesome" />
					<Text>Edit</Text>
				</Button>
				<Button
					warning
					style={styles.btn}
					onPress={() => props.addGroceryItem(props.product._id)}
				>
					<Icon name="list" type="FontAwesome" />
					<Text>Add to Grocery List</Text>
				</Button>
				<Button
					danger
					style={styles.btn}
					onPress={() => props.deleteProduct(props.product._id)}
				>
					<Icon name="trash" type="FontAwesome" />
					<Text>Delete</Text>
				</Button>
			</View>
		</Content>
	);
}

export default ProductDetail;
