import React from "react";
import { StyleSheet, View } from "react-native";
import { observer } from "mobx-react";

import { Colors } from "../theme";
import { store } from "../store";
import Header from "../components/Header";
import { Heading } from "../components/Text";
import { Button } from "../components/Button";
import { License } from "../components/License";
import HomeButton from "../components/HomeButton";
import { t } from "../i18n";
import { useMusicProvider } from "../providers";

export default observer(function ImportScreen() {
  const { songs, importStatus } = store;
  const { isLoading, error, playlistUrl } = importStatus;
  const provider = useMusicProvider();

  let text = "";
  if (error) {
    text = error.message;
  } else if (!songs.length) {
    text = t("Bezig met laden ...");
  } else if (isLoading) {
    text = t("Bezig met importeren van $1 song(s) ...", songs.length + "");
  } else {
    text = t("Jouw afspeellijst is aangemaakt!");
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Header />
        <Heading style={styles.text}>{text}</Heading>
        {playlistUrl ? (
          <Button
            style={styles.button}
            color={provider.color}
            onPress={() => store.openPlaylist(provider)}
          >
            {t("Open afspeellijst in $1", provider.name)}
          </Button>
        ) : undefined}
      </View>
      {!isLoading ? <HomeButton /> : undefined}
      <License />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    marginHorizontal: 20,
    alignItems: "center",
  },
  button: {
    marginTop: 20,
  },
  text: {
    textAlign: "center",
  },
});
