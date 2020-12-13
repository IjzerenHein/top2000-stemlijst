import React from "react";
import * as Linking from "expo-linking";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";

import { PaperTheme } from "./src/theme";
import HomeScreen from "./src/screens/HomeScreen";
import SelectScreen from "./src/screens/SelectScreen";
import ImportScreen from "./src/screens/ImportScreen";

const { path, queryParams } = Linking.parse(
  window.location.href.replace(
    "/authorize-createplaylist#",
    "/authorize-createplaylist?"
  )
);

console.log("PATH: ", path);

const Stack = createStackNavigator();

const ImportScreen2 = (props: any) => (
  <ImportScreen {...props} queryParams={queryParams ?? {}} />
);

const linking = {
  enabled: true,
  prefixes: [],
  config: {
    screens: {
      home: "",
    },
  },
};

export default () => {
  return (
    <PaperProvider theme={PaperTheme}>
      <NavigationContainer linking={linking}>
        {path === "spotify/authorize-createplaylist" ? (
          <Stack.Navigator initialRouteName={path || ""} headerMode="none">
            <Stack.Screen name="home" component={ImportScreen2} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator initialRouteName={path || ""} headerMode="none">
            <Stack.Screen name="home" component={HomeScreen} />
            <Stack.Screen name="spotify" component={SelectScreen} />
            <Stack.Screen name="applemusic" component={SelectScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </PaperProvider>
  );
};
