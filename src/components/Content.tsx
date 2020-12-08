import React from "react";
import { StyleSheet, View } from "react-native";
import { store } from "../store";
import { Colors } from "../theme";
import { observer } from "mobx-react";
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
      <View style={styles.urlBar}>
        <AddFromUrlBar />
      </View>
      {store.sources.map((source, index) => (
        <SongList key={index} source={source} />
      ))}
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
  urlBar: {
    marginHorizontal: "10%",
  },
});
