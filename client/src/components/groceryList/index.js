import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import {
  Content,
  ListItem,
  Text,
  Icon,
  Left,
  Body,
  CheckBox,
  Button,
  Spinner,
} from 'native-base';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#EBF5FF',
  },
  checkbox: {
    marginRight: 10,
    marginLeft: -10,
  },
});

function GroceryList(props) {
  return (
		<Content contentContainerStyle={styles.content}>
			<FlatList
				data={props.groceryItems}
				extraData={props.extraData}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => (
					<ListItem icon>
						<Left>
							{item.checkLoading ? (
								<Spinner size="small" color="blue" />
							) : (
								<CheckBox
									checked={!!item.acquiredCheck}
									style={styles.checkbox}
									onPress={() => props.checkAcquired(item._id)}
								/>
							)}
						</Left>
						<Body style={{ borderColor: '#8F8F8F', borderBottomWidth: 1 }}>
							<Text numberOfLines={1}>{item.productname}</Text>
							<Text note numberOfLines={1} style={{ color: '#8F8F8F' }}>
								Needed:{' '}{item.numNeededLoading ? '...' : item.numNeeded}
							</Text>
						</Body>
						<Left>
							<Button
								success
								style={{ marginLeft: 10 }}
								onPress={() => props.addToNumNeeded(item._id)}
							>
								<Icon name="arrow-up" type="FontAwesome" />
							</Button>
							<Button
								success
								style={{ marginLeft: 5 }}
								onPress={() => props.subtractFromNumNeeded(item._id)}
							>
								<Icon name="arrow-down" type="FontAwesome" />
							</Button>
							<Button
								warning
								style={{ paddingLeft: 2, marginLeft: 5 }}
								onPress={() => props.addToInventory(item._id)}
							>
								<Icon name="plus" type="FontAwesome" />
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
				)}
			/>
		</Content>
  );
}

export default GroceryList;
