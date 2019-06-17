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
        <Text>This is the fridge page</Text>
      </View>
    </ImageBackground>
  );
}

export default Fridge;
