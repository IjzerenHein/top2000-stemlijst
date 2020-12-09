import React from "react";
import { StyleSheet, View } from "react-native";
import { store } from "../store";
import { observer } from "mobx-react";
import { ErrorText } from "./ErrorText";
import { Button } from "./Button";

export default observer(() => {
  const { songs, importStatus } = store;
  const { error, isLoading } = importStatus;
  return (
    <View style={styles.container}>
      <Button
        disabled={!songs.length}
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
