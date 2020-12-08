import React from "react";
import { StyleSheet, View, Image } from "react-native";

export default (props: { imageUrl?: string }) => {
  const { imageUrl } = props;
  return imageUrl ? (
    <Image style={styles.image} source={{ uri: imageUrl }} />
  ) : (
    <View style={styles.imagePlaceholder} />
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: "cover",
    width: 40,
    height: 40,
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: "#ccc",
  },
});
