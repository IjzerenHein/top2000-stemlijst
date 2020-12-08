import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, HelperText } from "react-native-paper";

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
      <HelperText type="error" visible={true}>
        Niet gevonden op Spotify
      </HelperText>
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
