import React from "react";
import { StyleSheet, View, Image, TouchableHighlight } from "react-native";
import { observer } from "mobx-react";
import { useLinkTo } from "@react-navigation/native";

import { Colors } from "../theme";
import { providers } from "../providers";
import { Heading, Caption } from "../components/Text";
import { License } from "../components/License";

export default observer(function HomeScreen() {
  const linkTo = useLinkTo();
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../../assets/logo.png")} />
      <Heading style={styles.title}>
        Waar wilt u de stemlijst importeren?
      </Heading>
      <View style={styles.providers}>
        {providers.map((provider) => (
          <TouchableHighlight
            key={provider.id}
            style={styles.button}
            underlayColor={Colors.panel}
            onPress={() => linkTo("/" + provider.id)}
          >
            <View style={styles.providerContainer}>
              <Image style={styles.providerImage} source={provider.image} />
              <Caption>{provider.name} </Caption>
            </View>
          </TouchableHighlight>
        ))}
      </View>
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
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    marginHorizontal: 20,
    textAlign: "center",
  },
  providers: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
  },
  providerContainer: {
    flexDirection: "column",
    marginVertical: 20,
    marginHorizontal: 10,
    alignItems: "center",
  },
  providerImage: {
    width: 96,
    height: 96,
    resizeMode: "contain",
    marginBottom: 10,
  },
});
