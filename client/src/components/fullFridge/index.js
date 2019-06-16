import React from "react";
import { StyleSheet, Button, View, ImageBackground, Image, Text } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

const styles = StyleSheet.create({
	container: {
    flex: 1,
    flexDirection: "column",
		alignItems: "center",
		justifyContent: "center"
  },
  background: {
    height: "100%",
    width: "90%",
    justifyContent: "center"
  },
  icon: {
    height: "20%",
    width: "20%",
    backgroundColor: "grey"
  }
});

function FullFridge(props) {
  return (
    <ImageBackground style={styles.background} source={require("./fullFridge_smaller.jpg")}>
      <View style={styles.container}>
        <Text>Fridge</Text>      
      </View>
      <View style={styles.container}>
        <Text>2</Text>
        <TouchableHighlight onPress={props.handlePress}>
          <Image style={styles.icon} source={{uri: "https://image.flaticon.com/teams/slug/google.jpg"}} />
        </TouchableHighlight>
        {/* <Button color="red" title="Login with Google" /> */}
        <Button color="purple" title="Login" onPress={props.login} />
      </View>
      <View style={styles.container}>
        <Text>Table</Text>
      </View>
    </ImageBackground>
  );
}

export default FullFridge;
