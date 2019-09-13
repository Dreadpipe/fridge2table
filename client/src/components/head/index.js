import React, { Component } from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import {
  Header, Left, Right, Button, Text,
} from 'native-base';

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#193652',
  },
  logo: {
    height: '100%',
    width: Platform.OS === 'ios' ? '70%' : '100%',
  },
});

export default class Head extends Component {
  render() {
    return (
			<Header style={styles.header} iosBarStyle="light-content">
				<Left>
					<Image
						resizeMode="contain"
						style={styles.logo}
						source={require('../../../assets/fridge2table_logo.png')}
					/>
				</Left>
				<Right>
					<Button hasText transparent onPress={this.props.toFridge}>
						<Text style={{ color: '#EBF5FF' }}>Fridge</Text>
					</Button>
					<Button hasText transparent onPress={this.props.toFreezer}>
						<Text style={{ color: '#EBF5FF' }}>Freezer</Text>
					</Button>
					<Button hasText transparent onPress={this.props.toPantry}>
						<Text style={{ color: '#EBF5FF' }}>Pantry</Text>
					</Button>
				</Right>
			</Header>
    );
  }
}
