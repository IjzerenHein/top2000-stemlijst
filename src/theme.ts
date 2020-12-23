import { DefaultTheme, configureFonts } from "react-native-paper";

/* export const Colors = {
  background: "#000",
  panel: "#333",
  text: "#fff",
};*/

export const Colors = {
  background: "#fff",
  panel: "#eee",
  text: "#000",
  yellow: "#C78B01",
  red: "#d2151b",
  green: "#1DB954",
  top2000Red: "#e91700",
  spotifyGreen: "#1DB954",
  appleMusicRed: "#fa233b",
  deezerBlack: "#000000",
  black: "#191414",
};

/*
const fontFamily = `Baloo, "Helvetica Neue", Helvetica, Arial, sans-serif`;
const fontWeight = "600";
const font = {
  fontFamily,
  fontWeight,
};
const fontConfig = {
  web: {
    regular: font,
    medium: font,
    //light: font,
    //thin: font,
  },
}; */

export const PaperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.green,
    // accent: 'yellow',
  },
  // fonts: configureFonts(fontConfig as any),
};
