import React from "react";
import { StyleSheet, View } from "react-native";
import { observer } from "mobx-react";

import { Colors } from "../theme";

export default observer(function HomeScreen() {
  return <View></View>;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    // @ts-ignore
    overflowY: "hidden",
  },
});
