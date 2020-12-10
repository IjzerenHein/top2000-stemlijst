import React from "react";
import { StyleSheet, View } from "react-native";
import { observer } from "mobx-react";
import { Provider as PaperProvider } from "react-native-paper";
import * as Linking from "expo-linking";

import { Colors, PaperTheme } from "../theme";
import { store } from "../store";
import Header from "../components/Header";
import { Heading } from "../components/Heading";
import { Button } from "../components/Button";
import { License } from "../components/License";

export default observer(function ImportScreen(props: { queryParams: any }) {
  const { songs, importStatus } = store;
  const { isLoading, error, playlistUrl } = importStatus;

  React.useEffect(() => {
    history.replaceState("", document.title, "/");
    store.continueImport(props.queryParams);
  }, []);

  let text = "";
  if (error) {
    text = error.message;
  } else if (!songs.length) {
    text = "Bezig met laden...";
  } else if (isLoading) {
    text = `Bezig met importeren van ${songs.length} Songs...`;
  } else {
    text = "Jouw afspeellijst is aangemaakt!";
  }

  return (
    <PaperProvider theme={PaperTheme}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Header />
          <Heading style={styles.text}>{text}</Heading>
          {playlistUrl ? (
            <Button
              style={styles.button}
              onPress={() => Linking.openURL(playlistUrl)}
            >
              Open afspeellijst in Spotify
            </Button>
          ) : undefined}
        </View>
        <License />
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
