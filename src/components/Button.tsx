import React from "react";
import { Button as PaperButton } from "react-native-paper";

export function Button(props: React.ComponentProps<typeof PaperButton>) {
  return <PaperButton mode={"contained"} {...props} />;
}
