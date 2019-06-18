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

function Pantry(props) {
  return (    
      <View style={styles.container}>
        <Text>This is the pantry page</Text>
      </View>
  );
}

export default Pantry;
