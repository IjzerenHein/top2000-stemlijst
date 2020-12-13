import React from "react";
import { StyleSheet, View, Image } from "react-native";

import { useMusicProvider } from "../providers";

export default () => {
  const provider = useMusicProvider();
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
      <Image style={styles.providerImage} source={provider.image} />
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
  providerImage: {
    width: 96,
    height: 96,
    resizeMode: "contain",
  },
});
