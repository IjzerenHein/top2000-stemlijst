import React from "react";
import { Headline } from "react-native-paper";

export function Heading(props: { children?: string }) {
  return <Headline>{props.children}</Headline>;
}
