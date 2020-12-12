import React from "react";
import { StyleSheet, View } from "react-native";
import { observer } from "mobx-react";

import { store } from "../store";
import { ErrorText } from "./Text";
import { Button } from "./Button";
import { t } from "../i18n";
import { useMusicProvider } from "../providers";

export default observer(() => {
  const { songs, importStatus } = store;
  const { error, isLoading } = importStatus;
  const provider = useMusicProvider();
  return (
    <View style={styles.container}>
      <Button
        disabled={!songs.length}
        loading={isLoading}
        onPress={() => store.saveAndAuthorizeForImport(provider)}
      >
        {t(`Importeer $1 songs naar $2`, songs.length + "", provider.name)}
      </Button>
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
