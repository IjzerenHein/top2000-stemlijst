import React from "react";
import { StyleSheet, View } from "react-native";
import { observer } from "mobx-react";
import { TextInput } from "react-native-paper";

import { Colors } from "../theme";
import { store } from "../store";
import { ErrorText, Heading, Caption } from "./Text";
import { Button } from "./Button";
import { t } from "../i18n";
import { useMusicProvider } from "../providers";

export default observer(() => {
  const { sources, addSourceStatus } = store;
  const { isLoading, error } = addSourceStatus;
  const provider = useMusicProvider();
  const [text, setText] = React.useState(
    process.env.NODE_ENV === "development"
      ? "https://stem.nporadio2.nl/top2000-2020/share/cc87893480d6ebf4741784b2b95ee3d411711b53"
      : ""
  );
  return (
    <View>
      <Heading>
        {store.sources.length
          ? t("Voeg nog een Stemlijst toe:")
          : t("Importeer jouw Top 2000 Stemlijst naar $1", provider.name)}
      </Heading>
      {!store.sources.length ? (
        <Caption>
          {t("Vul de stemlink in die je via de email hebt ontvangen")}
        </Caption>
      ) : undefined}
      <TextInput
        style={styles.input}
        mode={"outlined"}
        clearButtonMode={text ? "always" : "never"}
        value={text}
        placeholder={
          `https://stem.nporadio2.nl/top2000-${new Date().getFullYear()}/share/` +
          t("{Jouw persoonlijke stem id}")
        }
        onChangeText={setText}
      />
      <ErrorText visible={!!error} label={error?.message} />
      <Button
        style={[
          styles.button,
          !text && !sources.length ? styles.invisibleButton : undefined,
        ]}
        color={provider.color}
        mode={sources.length ? "outlined" : "contained"}
        loading={isLoading}
        disabled={!text}
        onPress={() =>
          store
            .addSource(text, provider)
            .then((source) => source && setText(""))
        }
      >
        {isLoading ? t("Bezig met ophalen ...") : t("Haal stemlijst op")}
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
