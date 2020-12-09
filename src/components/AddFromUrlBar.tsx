import React from "react";
import { StyleSheet, View } from "react-native";
import { observer } from "mobx-react";
import { Button, TextInput, Headline } from "react-native-paper";

import { Colors } from "../theme";
import { store } from "../store";
import { ErrorText } from "./ErrorText";

export default observer(() => {
  const { isLoading, error } = store.addSourceStatus;
  const [text, setText] = React.useState(
    process.env.NODE_ENV === "development"
      ? "https://stem.nporadio2.nl/top2000-2020/share/cc87893480d6ebf4741784b2b95ee3d411711b53"
      : ""
  );
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
      <ErrorText visible={!!error} label={error?.message} />
      <Button
        style={[styles.button, !text ? styles.invisibleButton : undefined]}
        mode={"contained"}
        loading={isLoading}
        disabled={!text}
        onPress={() =>
          store.addSource(text).then((source) => source && setText(""))
        }
      >
        {isLoading ? "Bezig met ophalen..." : "Haal lijst op"}
      </Button>
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    flex: 1,
    marginBottom: 10,
  },
  button: {
    marginVertical: 10,
  },
  invisibleButton: {
    opacity: 0,
  },
  snackBar: {
    backgroundColor: Colors.red,
  },
});
