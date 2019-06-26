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
	render() {
		return (
			<Content contentContainerStyle={styles.content}>
				<Form style={styles.form}>
					<Item floatingLabel style={styles.productName}>
						<Label>Product Name (Type or Scan Barcode)</Label>
						<Input
							value={this.props.productName}
							onChange={this.props.onNameChange}
						/>
					</Item>
					<Item picker>
						<Label>Location</Label>
						<Picker
							mode="dropdown"
							iosIcon={<Icon name="arrow-down" />}
							style={styles.categoryPicker}
							placeholderStyle={{ color: "#bfc6ea" }}
							placeholderIconColor="#007aff"
							selectedValue={this.props.location}
							onValueChange={this.props.onLocationChange}
						>
							<Picker.Item label="Fridge" value="Fridge" />
							<Picker.Item label="Freezer" value="Freezer" />
							<Picker.Item label="Pantry" value="Pantry" />
						</Picker>
					</Item>
					<Item picker>
						<Label>Category</Label>
						{(() => {
							switch (this.props.location) {
								case "Fridge":
									return (
										<FridgeCategoryPicker
											styles={styles.categoryPicker}
											onCategoryChange={this.props.onCategoryChange}
											selectedCategory={this.props.category}
										/>
									);
									break;
								case "Freezer":
									return (
										<FreezerCategoryPicker
											styles={styles.categoryPicker}
											onCategoryChange={this.props.onCategoryChange}
											selectedCategory={this.props.category}
										/>
									);
									break;
								case "Pantry":
									return (
										<PantryCategoryPicker
											styles={styles.categoryPicker}
											onCategoryChange={this.props.onCategoryChange}
											selectedCategory={this.props.category}
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
							selectedValue={this.props.quantity.toString()}
							onValueChange={this.props.onQuantityChange}
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
						defaultDate={new Date()}
						locale={"en"}
						timeZoneOffsetInMinutes={undefined}
						modalTransparent={false}
						animationType={"fade"}
						androidMode={"default"}
						placeHolderText="Select expiration date"
						textStyle={{ color: "green" }}
						placeHolderTextStyle={{ color: "#d3d3d3" }}
						onDateChange={this.props.setDate}
						disabled={false}
					/>
					<Text>Date: {this.props.date.toString().substr(4, 12)}</Text>
				</Form>
				<View style={styles.iconDiv}>
					<Icon
						name="barcode-scan"
						type="MaterialCommunityIcons"
						style={styles.barcodeIcon}
						onPress={this.props.toScanner}
					/>
					<Text style={{ textAlign: "center" }}>Scan Barcode</Text>
				</View>
				<View style={styles.iconDiv}>
					<Icon
						name="check"
						type="FontAwesome"
						style={styles.plusIcon}
						onPress={this.props.addProduct}
					/>
					<Text>Add Product</Text>
				</View>
			</Content>
		);
	}
}

export default AddProduct;
