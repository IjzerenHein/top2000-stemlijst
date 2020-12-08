import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "./theme";
import { observer } from "mobx-react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Content from "./components/Content";
import Footer from "./components/Footer";

const theme = {
  ...DefaultTheme,
  /* colors: {
      ...DefaultTheme.colors,
      primary: 'tomato',
      accent: 'yellow',
    },*/
};

export default observer(function App() {
  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Content />
        </View>
        <View style={styles.footer}>
          <Footer />
        </View>
      </View>
    </PaperProvider>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    flexDirection: "column",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  footer: {
    height: 100,
    backgroundColor: Colors.panel,
  },
});
