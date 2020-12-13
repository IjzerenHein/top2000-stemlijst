import React from "react";
import { Provider as PaperProvider } from "react-native-paper";

import { PaperTheme } from "./src/theme";
import Router from "./src/Router";

export default () => {
  return (
    <PaperProvider theme={PaperTheme}>
      <Router />
    </PaperProvider>
  );
};
