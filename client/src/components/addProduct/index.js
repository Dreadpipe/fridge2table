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
	Picker
} from "native-base";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";

const styles = StyleSheet.create({
    content: {
        width: '100%'
    },
    form: {
        width: '95%'
    },
	productName: {
		paddingBottom: 5,
		paddingTop: 5
    },
    categoryPicker: {
        width: undefined
    }
});

function addProduct(props) {
	return (
		<Content style={styles.content}>
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
    					placeholder="Where's the food going?"
    					placeholderStyle={{ color: "#bfc6ea" }}
    					placeholderIconColor="#007aff"
    					selectedValue={'Fridge'}
    					// onValueChange={this.onValueChange2.bind(this)}
    				>
    					<Picker.Item label="Fridge" value="key0" />
    					<Picker.Item label="Freezer" value="key1" />
    					<Picker.Item label="Pantry" value="key2" />
    				</Picker>
				</Item>
				<Item floatingLabel last>
					<Label>Username</Label>
					<Input />
				</Item>
			</Form>
		</Content>
	);
}

export default addProduct;
