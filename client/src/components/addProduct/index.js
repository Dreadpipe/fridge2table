import React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import {
	Button,
	Text,
	Icon,
	Content,
	Form,
	Item,
	Input,
	Label,
	Picker,
	DatePicker
} from "native-base";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import FridgeCategoryPicker from "../fridgeCategoryPicker";
import FreezerCategoryPicker from "../freezerCategoryPicker";
import PantryCategoryPicker from "../pantryCategoryPicker";

const styles = StyleSheet.create({
	content: {
		display: "flex",
		justifyContent: "space-around",
		alignItems: "center",
		width: "100%",
		height: "100%"
	},
	form: {
		width: "95%"
	},
	productName: {
		paddingBottom: 5,
		paddingTop: 5,
		marginLeft: 0
	},
	categoryPicker: {
		width: undefined
	},
	iconDiv: {
		textAlign: "center"
	},
	barcodeIcon: {
		fontSize: 90,
		textAlign: "center"
	},
	plusIcon: {
		fontSize: 90,
		textAlign: "center"
	}
});

class AddProduct extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			chosenDate: new Date(),
			selectedLocation: "Fridge",
			selectedCategory: undefined,
			selectedQuantity: undefined
		};
		this.setDate = this.setDate.bind(this);
	}

	setDate(newDate) {
		this.setState({ chosenDate: newDate });
	}

	onLocationChange(value: string) {
		this.setState({
			selectedLocation: value
		});
		console.log(this.state);
	}

	onCategoryChange(value: string) {
		this.setState({
			selectedCategory: value
		});
		console.log(this.state);
	}

	onQuantityChange(value: string) {
		this.setState({
			selectedQuantity: value
		});
		console.log(this.state);
	}

	render() {
		return (
			<Content contentContainerStyle={styles.content}>
				<Form style={styles.form}>
					<Item floatingLabel style={styles.productName}>
						<Label>Product Name</Label>
						<Input />
					</Item>
					<Item picker>
						<Label>Location</Label>
						<Picker
							mode="dropdown"
							iosIcon={<Icon name="arrow-down" />}
							style={styles.categoryPicker}
							placeholderStyle={{ color: "#bfc6ea" }}
							placeholderIconColor="#007aff"
							selectedValue={this.state.selectedLocation}
							onValueChange={this.onLocationChange.bind(this)}
						>
							<Picker.Item label="Fridge" value="Fridge" />
							<Picker.Item label="Freezer" value="Freezer" />
							<Picker.Item label="Pantry" value="Pantry" />
						</Picker>
					</Item>
					<Item picker>
						<Label>Category</Label>
						{(() => {
							switch (this.state.selectedLocation) {
								case "Fridge":
									return (
										<FridgeCategoryPicker
											styles={styles.categoryPicker}
											onCategoryChange={this.onCategoryChange.bind(this)}
											selectedCategory={this.state.selectedCategory}
										/>
									);
									break;
								case "Freezer":
									return (
										<FreezerCategoryPicker
											styles={styles.categoryPicker}
											onCategoryChange={this.onCategoryChange.bind(this)}
											selectedCategory={this.state.selectedCategory}
										/>
									);
									break;
								case "Pantry":
									return (
										<PantryCategoryPicker
											styles={styles.categoryPicker}
											onCategoryChange={this.onCategoryChange.bind(this)}
											selectedCategory={this.state.selectedCategory}
										/>
									);
									break;
							}
						})()}
					</Item>
					<Item picker>
						<Label>Quantity</Label>
						<Picker
							mode="dropdown"
							iosIcon={<Icon name="arrow-down" />}
							style={styles.categoryPicker}
							placeholder="Press to select"
							placeholderStyle={{ color: "#bfc6ea" }}
							placeholderIconColor="#007aff"
							selectedValue={this.state.selectedQuantity}
							onValueChange={this.onQuantityChange.bind(this)}
						>
							<Picker.Item label="1" value="1" />
							<Picker.Item label="2" value="2" />
							<Picker.Item label="3" value="3" />
							<Picker.Item label="4" value="4" />
							<Picker.Item label="5" value="5" />
							<Picker.Item label="6" value="6" />
							<Picker.Item label="7" value="7" />
							<Picker.Item label="8" value="8" />
							<Picker.Item label="9" value="9" />
							<Picker.Item label="10" value="10" />
						</Picker>
					</Item>
					<DatePicker
						defaultDate={new Date(2018, 4, 4)}
						minimumDate={new Date(2018, 1, 1)}
						maximumDate={new Date(2018, 12, 31)}
						locale={"en"}
						timeZoneOffsetInMinutes={undefined}
						modalTransparent={false}
						animationType={"fade"}
						androidMode={"default"}
						placeHolderText="Select expiration date"
						textStyle={{ color: "green" }}
						placeHolderTextStyle={{ color: "#d3d3d3" }}
						onDateChange={this.setDate}
						disabled={false}
					/>
					<Text>Date: {this.state.chosenDate.toString().substr(4, 12)}</Text>
				</Form>
				<View style={styles.iconDiv}>
					<Icon
						name="barcode-scan"
						type="MaterialCommunityIcons"
						style={styles.barcodeIcon}
					/>
					<Text style={{ textAlign: "center" }}>Scan Barcode</Text>
				</View>
				<View style={styles.iconDiv}>
					<Icon name="plus" type="FontAwesome" style={styles.plusIcon} />
					<Text>Add Product</Text>
				</View>
			</Content>
		);
	}
}

export default AddProduct;
