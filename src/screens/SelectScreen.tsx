import React from "react";
import { StyleSheet, View } from "react-native";
import { observer } from "mobx-react-lite";

import { Colors } from "../theme";
import { store } from "../store";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HomeButton from "../components/HomeButton";
import AddFromUrlBar from "../components/AddFromUrlBar";
import SongList from "../components/SongList";

const FOOTER_HEIGHT = 100;

export default observer(function SelectScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.scrollContainer}>
        <View
          style={[
            styles.content,
            store.sources.length ? styles.contentWithSources : undefined,
          ]}
        >
          <Header />
          {store.sources.map((source, index) => (
            <SongList key={index} source={source} />
          ))}
          <AddFromUrlBar />
        </View>
      </View>
      <View
        style={[
          styles.footer,
          !store.sources.length ? styles.footerHidden : undefined,
        ]}
      >
        <Footer />
      </View>
      {!store.sources.length ? <HomeButton /> : undefined}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    // @ts-ignore
    overflowY: "hidden",
  },
  scrollContainer: {
    flex: 1,
    // @ts-ignore
    overflowY: "auto",
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: "column",
    justifyContent: "center",
    // @ts-ignore
    transform: [{ translateY: "20vh" }],
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
  },
  contentWithSources: {
    transform: [{ translateY: 0 }],
  },
  footer: {
    height: FOOTER_HEIGHT,
    backgroundColor: Colors.panel,
    // @ts-ignore
    transitionDuration: "0.4s",
    transform: [{ translateY: 0 }],
    overflow: "hidden",
  },
  footerHidden: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    transform: [{ translateY: FOOTER_HEIGHT }],
  },
  licenseContainer: {},
});
