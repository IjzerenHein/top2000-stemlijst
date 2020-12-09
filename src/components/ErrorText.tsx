import React from "react";
import { HelperText } from "react-native-paper";

export function ErrorText(props: { visible: boolean; label?: string }) {
  return (
    <HelperText type="error" visible={props.visible}>
      {props.label ?? ""}
    </HelperText>
  );
}
