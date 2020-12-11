import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar } from "react-native-paper";

import { ErrorText } from "./Text";

export default (props: { isSelected: boolean; spotifyUri?: string }) => {
  const { isSelected, spotifyUri } = props;
  return spotifyUri ? (
    isSelected ? (
      <Avatar.Icon size={32} icon={"check"} />
    ) : (
      <Avatar.Text style={styles.unchecked} size={32} label="" />
    )
  ) : (
    <View style={styles.errorContainer}>
      <ErrorText visible label="Niet gevonden" />
    </View>
  );
};

const styles = StyleSheet.create({
  unchecked: {
    opacity: 0.25,
  },
  errorContainer: {
    justifyContent: "center",
  },
});
