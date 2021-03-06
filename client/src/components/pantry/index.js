import React from 'react';
import {
  StyleSheet, View, TouchableHighlight, Image,
} from 'react-native';
import { Content, Toast } from 'native-base';
import { vh } from 'react-native-expo-viewport-units';

const styles = StyleSheet.create({
  pageDiv: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: '#EBF5FF',
  },
  bannerDiv: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'space-around',
    alignItems: 'flex-start',
    height: '100%',
  },
  banner: {
    width: '45%',
  },
  bannerImg: {
    height: 135,
    width: '100%',
  },
  disabledBannerImg: {
    height: 135,
    width: '100%',
    opacity: 0.3,
  },
  grainsImg: {
    height: 120,
    width: '100%',
  },
  disabledGrainsImg: {
    height: 120,
    width: '100%',
    opacity: 0.3,
  },
  produceImg: {
    height: 140,
    width: '100%',
  },
  disabledProduceImg: {
    height: 140,
    width: '100%',
    opacity: 0.3,
  },
  spicesImg: {
    height: 120,
    width: '100%',
  },
  disabledSpicesImg: {
    height: 120,
    width: '100%',
    opacity: 0.3,
  },
});

const noItemsToast = () => {
  Toast.show({
    text:
			'You haven\'t added any items in this category. Click "New Product" below!',
    buttonText: 'Okay',
    position: 'bottom',
    type: 'warning',
    duration: 30000,
    style: { marginBottom: vh(9) },
  });
};

function Pantry(props) {
  return (
		<Content contentContainerStyle={styles.pageDiv}>
			<View style={styles.bannerDiv}>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.countGrains === 0 ? noItemsToast : props.viewGrains}
				>
					<Image
						resizeMode="contain"
						source={require('../../../assets/pantry_images/pantry_grains_banner.png')}
						style={
							props.countGrains === 0
							  ? styles.disabledGrainsImg
							  : styles.grainsImg
						}
					/>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.countSpices === 0 ? noItemsToast : props.viewSpices}
				>
					<Image
						resizeMode="contain"
						source={require('../../../assets/pantry_images/pantry_spices_banner.png')}
						style={
							props.countSpices === 0
							  ? styles.disabledSpicesImg
							  : styles.spicesImg
						}
					/>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.countProduce === 0 ? noItemsToast : props.viewProduce}
				>
					<Image
						resizeMode="contain"
						source={require('../../../assets/pantry_images/pantry_produce_banner.png')}
						style={
							props.countProduce === 0
							  ? styles.disabledProduceImg
							  : styles.produceImg
						}
					/>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.countCans === 0 ? noItemsToast : props.viewCans}
				>
					<Image
						resizeMode="contain"
						source={require('../../../assets/pantry_images/pantry_cans_banner.png')}
						style={
							props.countCans === 0
							  ? styles.disabledBannerImg
							  : styles.bannerImg
						}
					/>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.banner}
					underlayColor="#EBF5FF"
					activeOpacity={0.5}
					onPress={props.countMisc === 0 ? noItemsToast : props.viewMisc}
				>
					<Image
						resizeMode="contain"
						source={require('../../../assets/pantry_images/pantry_misc_banner.png')}
						style={
							props.countMisc === 0
							  ? styles.disabledBannerImg
							  : styles.bannerImg
						}
					/>
				</TouchableHighlight>
			</View>
		</Content>
  );
}

export default Pantry;
