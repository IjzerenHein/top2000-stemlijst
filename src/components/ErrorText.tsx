import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import { Colors } from "../theme";

export function ErrorText(props: { visible: boolean; label?: string }) {
  return props.visible ? (
    <Text style={styles.text}>{props.label ?? ""}</Text>
  ) : null;
}

const styles = StyleSheet.create({
  text: {
    color: Colors.red,
    fontSize: 16,
    fontWeight: "500",
  },
});
