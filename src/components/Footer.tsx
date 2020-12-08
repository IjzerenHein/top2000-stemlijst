import React from "react";
import { StyleSheet, View } from "react-native";
import { store } from "../store";
import { Colors } from "../theme";
import { observer } from "mobx-react";
import { Button } from "react-native-paper";

export default observer(() => {
  const { songs } = store;
  return (
    <View style={styles.container}>
      <Button
        disabled={!songs.length}
        mode="contained"
      >{`Importeer ${songs.length} Songs naar Spotify`}</Button>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
