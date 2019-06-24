import React from "react";
import { FlatList, StyleSheet } from "react-native";
import {
	Content,
	List,
	ListItem,
	Text,
	Icon,
	Left,
	Body,
	Right,
	Switch,
	Button,
	Thumbnail
} from "native-base";

function ViewProducts(props) {
	return (
		<Content>
			<FlatList
				data={props.products}
				keyExtractor={item => item._id}
				renderItem={({ item }) => {
					return (
						<ListItem icon>
							<Left>
								<Thumbnail
									square
									small
									source={
										item.pic
											? { uri: item.pic }
											: require("../../../assets/general-food.png")
									}
								/>
							</Left>
							<Body>
								<Text numberOfLines={1}>{item.productname}</Text>
								<Text note numberOfLines={1}>
									{item.location}
								</Text>
							</Body>
							<Right style={{ marginRight: 10 }}>
								<Text>
									{(() => {
										// Function to calculate difference between dates taken in part from this resource: https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
										const _MS_PER_DAY = 1000 * 60 * 60 * 24;

										function dateDiffInDays(a, b) {
											// Discarding time and time-zone info
											const utc1 = Date.UTC(
												a.getFullYear(),
												a.getMonth(),
												a.getDate()
											);
											const utc2 = Date.UTC(
												b.getFullYear(),
												b.getMonth(),
												b.getDate()
											);

											return Math.floor((utc1 - utc2) / _MS_PER_DAY);
										}

										// test it
										const a = new Date(item.expDate);
										const b = new Date();
										difference = dateDiffInDays(a, b);
										return difference;
									})()}
									d
								</Text>
								<Icon name="hourglass-half" type="FontAwesome" />
							</Right>
							<Left>
								<Button
									style={{ backgroundColor: "#228B22", paddingLeft: 2 }}
									onPress={() => props.editProduct(item._id)}
								>
									<Icon name="edit" type="FontAwesome" />
								</Button>
								<Button
									style={{ backgroundColor: "#FF0000", marginLeft: 5 }}
									onPress={() => props.deleteProduct(item._id)}
								>
									<Icon name="trash" type="FontAwesome" />
								</Button>
							</Left>
						</ListItem>
					);
				}}
			/>
		</Content>
	);
}

export default ViewProducts;
