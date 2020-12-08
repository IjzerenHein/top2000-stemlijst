import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme";
import { Button, TextInput, Snackbar, Portal } from "react-native-paper";
import { store } from "../store";

export default () => {
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        label="Link"
        value={text}
        onChangeText={setText}
      />
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
        Add
      </Button>
      <Portal>
        <Snackbar visible={!!error} onDismiss={() => setError("")}>
          {error}
        </Snackbar>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: "10%",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  button: {},
});
