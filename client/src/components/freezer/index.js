import React from "react";
import { StyleSheet, Button, View, ImageBackground, Image, Text } from "react-native";

const styles = StyleSheet.create({
  background: {
    height: "60%",
    width: "80%",
    justifyContent: "center",
  }
});

function Freezer(proos) {
  return (
    <ImageBackground style={styles.background} source={require("./freezer.jpg")}>
      <Text>Fridge! (but actually the freezer)</Text>
    </ImageBackground>
  );
}

export default Freezer;
