import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "./theme";
import { observer } from "mobx-react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Content from "./components/Content";
import Footer from "./components/Footer";
import { store } from "./store";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.green,
    // accent: 'yellow',
  },
};

const FOOTER_HEIGHT = 100;

export default observer(function App() {
  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <View style={styles.content1}>
          <View
            style={[
              styles.content2,
              store.sources.length ? styles.contentFooterVisible : undefined,
            ]}
          >
            <Content />
          </View>
        </View>
        <View
          style={[
            styles.footer,
            store.sources.length ? styles.footerVisible : undefined,
          ]}
        >
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
    maxWidth: 800,
    marginHorizontal: 20,
  },
  contentFooterVisible: {
    marginBottom: FOOTER_HEIGHT,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -FOOTER_HEIGHT,
    height: FOOTER_HEIGHT,
    backgroundColor: Colors.panel,
    transitionDuration: "0.4s",
    transform: [{ translateY: 0 }],
  },
  footerVisible: {
    transform: [{ translateY: -FOOTER_HEIGHT }],
  },
});
