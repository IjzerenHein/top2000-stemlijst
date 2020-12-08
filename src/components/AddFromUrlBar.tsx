import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Colors } from "../theme";
import {
  Button,
  TextInput,
  Snackbar,
  Portal,
  Headline,
} from "react-native-paper";
import { store } from "../store";

export default () => {
  const [text, setText] = React.useState(
    "https://stem.nporadio2.nl/top2000-2020/share/cc87893480d6ebf4741784b2b95ee3d411711b53"
  );
  const [error, setError] = React.useState("");

  return (
    <View>
      <Headline>
        {store.sources.length
          ? "Voeg nog een stem link toe:"
          : "Vul hier jouw Top-2000 stem link in:"}
      </Headline>
      <TextInput
        style={styles.input}
        mode="outlined"
        // label="Vul jouw NPO Radio 2 Top-2000 stem link hier in."
        value={text}
        placeholder="https://stem.nporadio2.nl/top2000-2020/share/{Jouw persoonlijke stem id}"
        onChangeText={setText}
      />
      <Button
        style={[styles.button, !text ? styles.invisibleButton : undefined]}
        mode={"contained"}
        disabled={!text}
        onPress={async () => {
          try {
            const source = await store.addSourceFromURL(text);
            if (source) {
              setText("");
            } else {
              setError("Invalid URL");
            }
          } catch (err) {
            setError(err.message);
          }
        }}
      >
        Haal lijst op
      </Button>
      <Portal>
        <Snackbar
          theme={{
            colors: {
              surface: Colors.red,
            },
          }}
          visible={!!error}
          onDismiss={() => setError("")}
        >
          {error}
        </Snackbar>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    marginBottom: 10,
  },
  button: {
    marginBottom: 10,
    // maxWidth: 400,
    // alignSelf: "center",
  },
  invisibleButton: {
    opacity: 0,
  },
  snackBar: {
    backgroundColor: Colors.red,
  },
});
