import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  Content,
  ListItem,
  Text,
  Icon,
  Left,
  Body,
  Right,
  Button,
  Thumbnail,
} from 'native-base';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#EBF5FF',
  },
  sortDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#83b8b6',
    borderStyle: 'solid',
    borderTopColor: '#DBDBDB',
    borderTopWidth: 1,
  },
  sortText: {
    marginBottom: 10,
    fontSize: 20,
  },
  buttonDiv: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#193652',
  },
});

function ViewProducts(props) {
  return (
		<Content contentContainerStyle={styles.content}>
			<FlatList
				data={props.products}
				extraData={props.extraData}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => (
						<ListItem
							icon
							onPress={() => props.toProductDetailScreen(item._id)}
						>
							<Left>
								<Thumbnail
									square
									small
									source={
										item.pic
										  ? { uri: item.pic }
										  : require('../../../assets/general-food.png')
									}
								/>
							</Left>
							<Body style={{ borderColor: '#8F8F8F', borderBottomWidth: 1 }}>
								<Text numberOfLines={1}>{item.productname}</Text>
								<Text note numberOfLines={1} style={{ color: '#8F8F8F' }}>
									{item.location}
								</Text>
							</Body>
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
							  const difference = dateDiffInDays(a, b);

							  if (difference <= 0) {
							    return (
										<Right
											style={{
											  marginRight: 10,
											  borderColor: '#8F8F8F',
											  borderBottomWidth: 1
											}}
										>
											<Icon
												name="skull"
												type="MaterialCommunityIcons"
												style={{ color: '#000000' }}
											/>
										</Right>
							    );
							  } if (difference > 0 && difference <= 2) {
							    return (
										<Right
											style={{
											  marginRight: 10,
											  borderColor: '#8F8F8F',
											  borderBottomWidth: 1
											}}
										>
											<Text style={{ color: '#FF0000' }}>{difference}d</Text>
											<Icon
												name="hourglass-half"
												type="FontAwesome"
												style={{ color: '#FF0000' }}
											/>
										</Right>
							    );
							  } else if (difference > 2 && difference <= 7) {
							    return (
										<Right
											style={{
											  marginRight: 10,
											  borderColor: '#8F8F8F',
											  borderBottomWidth: 1
											}}
										>
											<Text style={{ color: '#ffa200' }}>{difference}d</Text>
											<Icon
												name="hourglass-half"
												type="FontAwesome"
												style={{ color: '#ffa200' }}
											/>
										</Right>
							    );
							  } else {
							    return (
										<Right
											style={{
											  marginRight: 10,
											  borderColor: '#8F8F8F',
											  borderBottomWidth: 1
											}}
										>
											<Text style={{ color: '#8F8F8F' }}>{difference}d</Text>
											<Icon
												name="hourglass-half"
												type="FontAwesome"
												style={{ color: '#8F8F8F' }}
											/>
										</Right>
							    );
							  }
							})()}
							<Left>
								<Button
									success
									style={{ paddingLeft: 2 }}
									onPress={() => props.editProduct(item._id)}
								>
									<Icon name="edit" type="FontAwesome" />
								</Button>
								<Button
									danger
									style={{ marginLeft: 5 }}
									onPress={() => props.deleteProduct(item._id)}
								>
									<Icon name="trash" type="FontAwesome" />
								</Button>
							</Left>
						</ListItem>
				)}
			/>
			<View style={styles.sortDiv}>
				<Text style={styles.sortText}>Sort</Text>
				<View style={styles.buttonDiv}>
					<Button
						small
						rounded
						style={styles.btn}
						onPress={props.sortByExpDate}
					>
						<Icon name="hourglass-half" type="FontAwesome" />
					</Button>
					<Button
						small
						rounded
						style={styles.btn}
						onPress={props.sortAlphabetically}
					>
						<Icon name="sort-alphabetical" type="MaterialCommunityIcons" />
					</Button>
					<Button
						small
						rounded
						style={styles.btn}
						onPress={props.sortByLocation}
					>
						<Text>Location</Text>
					</Button>
				</View>
			</View>
		</Content>
  );
}

export default ViewProducts;
