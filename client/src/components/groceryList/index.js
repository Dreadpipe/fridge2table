import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
	Content,
	List,
	ListItem,
	Text,
	Icon,
	Left,
	Body,
	Right,
	CheckBox,
	Button,
	Thumbnail
} from "native-base";

const styles = StyleSheet.create({
	content: {
		flex: 1,
		backgroundColor: "#EBF5FF"
	}
});

function GroceryList(props) {
	return (
		<Content contentContainerStyle={styles.content}>
			<FlatList
				data={props.groceryItems}
				extraData={props.extraData}
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
							<Body style={{ borderColor: "#8F8F8F", borderBottomWidth: 1 }}>
								<Text numberOfLines={1}>{item.productname}</Text>
								<Text note numberOfLines={1} style={{ color: "#8F8F8F" }}>
									Needed: {item.numNeeded}
								</Text>
							</Body>
							<Left>
								<Button
									success
									style={{ paddingLeft: 2, marginLeft: 10 }}
									onPress={() => props.editGroceryItem(item._id)}
								>
									<Icon name="edit" type="FontAwesome" />
								</Button>
								<Button
									danger
									style={{ marginLeft: 5 }}
									onPress={() => props.deleteGroceryItem(item._id)}
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

export default GroceryList;
