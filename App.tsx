import React from "react";
import * as Linking from "expo-linking";

import SelectScreen from "./src/screens/SelectScreen";
import ImportScreen from "./src/screens/ImportScreen";

const { path, queryParams } = Linking.parse(
  window.location.href.replace("/authorize#", "/authorize?")
);

export default () => {
  return path === "authorize" ? (
    <ImportScreen queryParams={queryParams ?? {}} />
  ) : (
    <SelectScreen />
  );
};
