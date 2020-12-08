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
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState("");

  return (
    <View>
      <Headline>Vul hier jouw NPO Radio 2 Top-2000 stem link in</Headline>
      <View style={styles.bar}>
        <TextInput
          style={styles.input}
          mode="outlined"
          // label="Vul jouw NPO Radio 2 Top-2000 stem link hier in."
          value={text}
          placeholder="https://stem.nporadio2.nl/top2000-2020/share/{Jouw persoonlijke stem id}"
          onChangeText={setText}
        />
        {text && (
          <Button
            icon="plus"
            mode="contained"
            disabled={!text}
            onPress={() => {
              try {
                const source = store.addSourceFromURL(text);
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
        )}
        <Portal>
          <Snackbar
            theme={{
              colors: {
                surface: Colors.error,
              },
            }}
            visible={!!error}
            onDismiss={() => setError("")}
          >
            {error}
          </Snackbar>
        </Portal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  button: {},
  snackBar: {
    backgroundColor: Colors.error,
  },
});
