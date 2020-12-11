import React from "react";
import { StyleSheet } from "react-native";
import { Headline, Caption as PaperCaption, Text } from "react-native-paper";

import { Colors } from "../theme";

export function Heading(props: React.ComponentProps<typeof Headline>) {
  return <Headline {...props} />;
}

export function Caption(props: React.ComponentProps<typeof PaperCaption>) {
  return <PaperCaption {...props} />;
}

export function ErrorText(props: { visible: boolean; label?: string }) {
  return props.visible ? (
    <Text style={styles.error}>{props.label ?? ""}</Text>
  ) : null;
}

const styles = StyleSheet.create({
  error: {
    color: Colors.red,
    fontSize: 16,
    fontWeight: "500",
  },
});
