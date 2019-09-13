import React from 'react';
import { Picker, Icon } from 'native-base';

function FridgeCategoryPicker(props) {
	return (
		<Picker
			mode='dropdown'
			iosIcon={<Icon name='arrow-down' />}
			style={props.styles}
			placeholder='Press to select'
			placeholderStyle={{ color: '#bfc6ea' }}
			placeholderIconColor='#007aff'
			selectedValue={props.selectedCategory}
			onValueChange={props.onCategoryChange}
		>
			<Picker.Item label='Dairy' value='Dairy' />
			<Picker.Item label='Drinks' value='Drinks' />
			<Picker.Item label='Grains' value='Grains' />
			<Picker.Item label='Meats' value='Meats' />
			<Picker.Item label='Misc' value='Misc' />
			<Picker.Item label='Produce' value='Produce' />
		</Picker>
	);
}

export default FridgeCategoryPicker;
