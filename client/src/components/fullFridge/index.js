import React from "react";
import { StyleSheet, Button, View, ImageBackground, Image, Text } from "react-native";

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
    height: "10%",
    width: "10%",
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
        <Image style={styles.icon} source={{uri: "https://image.flaticon.com/teams/slug/google.jpg"}} />
        <Button color="red" title="Login with Google" onPress={props.handlePress} />
        <Button title="Login with other..." onPress={props.handlePress} />
      </View>
      <View style={styles.container}>
        <Text>Table</Text>
      </View>
    </ImageBackground>
  );
}

export default FullFridge;
