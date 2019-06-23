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
											? item.pic
											: require("../../../assets/general-food.png")
									}
								/>
							</Left>
							<Body>
								<Text>{item.productname}</Text>
								<Text note numberOfLines={1}>{item.location}</Text>
							</Body>
							<Right style={{marginRight: 10}}>
									<Text>2d</Text>
									<Icon name="hourglass-half" type="FontAwesome" />
							</Right>
							<Left>
								<Button style={{ backgroundColor: "#FF9501", paddingLeft: 2 }}>
									<Icon name="edit" type="FontAwesome" />
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
