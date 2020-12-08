import React from "react";
import { StyleSheet, View } from "react-native";
import { store } from "../store";
import { observer } from "mobx-react";
import Header from "./Header";
import AddFromUrlBar from "./AddFromUrlBar";
import SongList from "./SongList";

export default observer(() => {
  return (
    <View
      style={[
        styles.container,
        store.sources.length ? styles.containerWithSources : undefined,
      ]}
    >
      <Header />
      {store.sources.map((source, index) => (
        <SongList key={index} source={source} />
      ))}
      <AddFromUrlBar />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  containerWithSources: {
    overflowY: "scroll",
    justifyContent: "flex-start",
  },
});
