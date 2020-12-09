import React from "react";
import { StyleSheet, View } from "react-native";
import { observer } from "mobx-react";
import { Provider as PaperProvider, Headline } from "react-native-paper";

import { Colors, PaperTheme } from "../theme";
import { store } from "../store";
import Header from "../components/Header";
import { Heading } from "../components/Heading";
import { Button } from "../components/Button";

export default observer(function ImportScreen(props: { queryParams: any }) {
  const { songs, importStatus } = store;
  const { isLoading, error, playlistUrl } = importStatus;

  React.useEffect(() => {
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
          <Heading>{text}</Heading>
          {playlistUrl ? (
            <Button
              style={styles.button}
              onPress={() => window.open(playlistUrl)}
            >
              Open Spotify om hem te bekijken
            </Button>
          ) : undefined}
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
    alignItems: "center",
  },
  content: {
    marginHorizontal: 20,
    alignItems: "center",
  },
  button: {
    marginTop: 10,
  },
});
