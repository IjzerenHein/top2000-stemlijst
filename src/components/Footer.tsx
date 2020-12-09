import React from "react";
import { StyleSheet, View } from "react-native";
import { store } from "../store";
import { Colors } from "../theme";
import { observer } from "mobx-react";
import { Button } from "react-native-paper";
import { ErrorText } from "./ErrorText";

export default observer(() => {
  const { songs, importStatus } = store;
  const { error, isLoading } = importStatus;
  return (
    <View style={styles.container}>
      <Button
        disabled={!songs.length}
        mode="contained"
        loading={isLoading}
        onPress={() => store.import()}
      >{`Importeer ${songs.length} Songs naar Spotify`}</Button>
      <ErrorText visible={!!error} label={error?.message} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
