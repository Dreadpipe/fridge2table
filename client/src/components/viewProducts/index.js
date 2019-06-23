import React from "react";
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
	Button
} from "native-base";

function ViewProducts(props) {
	return (
		<Content>
			<List>
				<ListItem icon>
					<Left>
						<Button style={{ backgroundColor: "#FF9501" }}>
							<Icon active name="airplane" />
						</Button>
					</Left>
					<Body>
						<Text>Airplane Mode</Text>
					</Body>
					<Right>
						<Switch value={false} />
					</Right>
				</ListItem>
				<ListItem icon>
					<Left>
						<Button style={{ backgroundColor: "#007AFF" }}>
							<Icon active name="wifi" />
						</Button>
					</Left>
					<Body>
						<Text>Wi-Fi</Text>
					</Body>
					<Right>
						<Text>GeekyAnts</Text>
						<Icon active name="arrow-forward" />
					</Right>
				</ListItem>
				<ListItem icon>
					<Left>
						<Button style={{ backgroundColor: "#007AFF" }}>
							<Icon active name="bluetooth" />
						</Button>
					</Left>
					<Body>
						<Text>Bluetooth</Text>
					</Body>
					<Right>
						<Text>On</Text>
						<Icon active name="arrow-forward" />
					</Right>
				</ListItem>
			</List>
		</Content>
	);
}

export default ViewProducts;
