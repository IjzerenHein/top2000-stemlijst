import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.sourceImage}
        source={{
          uri:
            "https://images4.persgroep.net/rcs/-9DviUQUw27j0AkMm_CUQjRXtu8/diocontent/162917285/_fitwidth/128/?appId=21791a8992982cd8da851550a453bd7f&quality=0.9",
        }}
      />
      <Image
        style={styles.arrowImage}
        source={require("../../assets/arrow-right.png")}
      />
      <Image
        style={styles.spotifyImage}
        source={require("../../assets/spotify-green.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  sourceImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  arrowImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginHorizontal: 20,
  },
  text: {
    fontSize: 30,
    marginHorizontal: 40,
  },
  spotifyImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});
