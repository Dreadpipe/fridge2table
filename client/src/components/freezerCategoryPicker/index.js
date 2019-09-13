import React from 'react';
import { Picker, Icon } from 'native-base';

function FreezerCategoryPicker(props) {
	return (
		<Picker
			mode='dropdown'
			iosIcon={<Icon name='arrow-down' />}
			style={props.styles}
			placeholder='Press to select'
			placeholderStyle={{ color: '#bfc6ea' }}
			placeholderIconColor='#007aff'
			selectedValue={'Fridge'}
			selectedValue={props.selectedCategory}
			onValueChange={props.onCategoryChange.bind(this)}
		>
			<Picker.Item label='Meats' value='Meats' />
			<Picker.Item label='Misc' value='Misc' />
			<Picker.Item label='Produce' value='Produce' />
		</Picker>
	);
}

export default FreezerCategoryPicker;
