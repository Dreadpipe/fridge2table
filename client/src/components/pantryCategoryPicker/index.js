import React from 'react';
import { Picker, Icon } from 'native-base';

function PantryCategoryPicker(props) {
  return (
		<Picker
			mode="dropdown"
			iosIcon={<Icon name="arrow-down" />}
			style={props.styles}
			placeholder="Press to select"
			placeholderStyle={{ color: '#bfc6ea' }}
			placeholderIconColor="#007aff"
			selectedValue={props.selectedCategory}
			onValueChange={props.onCategoryChange.bind(this)}
		>
			<Picker.Item label="Canned Goods" value="Canned Goods" />
			<Picker.Item label="Grains" value="Grains" />
			<Picker.Item label="Produce" value="Produce" />
			<Picker.Item label="Spice Rack" value="Spice Rack" />
			<Picker.Item label="Misc" value="Misc" />
		</Picker>
  );
}

export default PantryCategoryPicker;
