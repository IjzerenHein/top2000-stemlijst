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
        <View style={styles.content1}>
          <View style={styles.content2}>
            <Content />
          </View>
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
  content1: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  content2: {
    flex: 1,
    maxWidth: 1200,
    marginHorizontal: 20,
  },
  footer: {
    height: 100,
    backgroundColor: Colors.panel,
  },
});
