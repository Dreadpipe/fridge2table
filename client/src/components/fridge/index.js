import React from "react";
import { StyleSheet, Button, View, ImageBackground, Image, Text } from "react-native";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
  },
  background: {
    height: "80%",
    width: "80%",
    justifyContent: "center",
  },
  icon: {
    height: "10%",
    width: "10%",
    backgroundColor: "grey"
  }
});

function Fridge(props) {
  return (
    <ImageBackground style={styles.background} source={require("./fridge.jpg")}>      
      <View style={styles.container}>
        <Image style={styles.icon} source={{uri: "https://image.flaticon.com/teams/slug/google.jpg"}} />
        <Button color="red" title="Login with Google" onPress={this.handlePress} />
        <Button title="Login with other..." onPress={this.handlePress} />
      </View>
    </ImageBackground>
  );
}

export default Fridge;
