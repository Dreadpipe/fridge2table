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
								<Text>2d</Text>
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
