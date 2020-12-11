import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.sourceImage}
        source={require("../../assets/logo.png")}
      />
      <Image
        style={styles.arrowImage}
        source={require("../../assets/arrow-right.png")}
      />
      <Image
        style={styles.spotifyImage}
        source={require("../../assets/spotify-green.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  sourceImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  arrowImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginHorizontal: 20,
  },
  text: {
    fontSize: 30,
    marginHorizontal: 40,
  },
  spotifyImage: {
    width: 96,
    height: 96,
    resizeMode: "contain",
  },
});
