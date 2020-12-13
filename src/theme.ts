import { DefaultTheme } from "react-native-paper";

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
  black: "#191414",
};

export const PaperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.green,
    // accent: 'yellow',
  },
};
