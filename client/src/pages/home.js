import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import API from '../utils/API';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class Home extends React.Component {

  state = {
    callResults: '',
  }

  componentDidMount() {
    API.get().then(response => {
      this.setState({callResults: response.data})
    })
  }

  render() {return (
    <View style={styles.container}>
      <Text>{this.state.callResults}</Text>
    </View>
  );}
}

export default Home;