import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export function License() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Gemaakt met <a href="https://www.expo.io">Expo</a> door{" "}
        <a href="https://github.com/IjzerenHein">IjzerenHein</a>. Deze website
        is niet gelieerd aan NPO Radio 2 of Spotify.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
  },
  text: {
    opacity: 0.3,
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
});
