import React from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import { useLinkTo } from "@react-navigation/native";

import { Colors } from "../theme";
import { store } from "../store";

export default function HomeButton() {
  const linkTo = useLinkTo();
  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-left"
        iconColor={Colors.top2000Red}
        size={30}
        onPress={() => {
          store.reset();
          linkTo("/");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 10,
    top: 10,
  },
});
