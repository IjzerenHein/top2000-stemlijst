import React from "react";
import * as Linking from "expo-linking";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { store } from "./store";
import { t } from "./i18n";
import { providers, getProvider } from "./providers";
import HomeScreen from "./screens/HomeScreen";
import SelectScreen from "./screens/SelectScreen";
import ImportScreen from "./screens/ImportScreen";

const linking = {
  enabled: true,
  prefixes: [],
  config: {
    screens: {
      Home: "",
      Select: {
        path: ":provider",
      },
      Import: {
        path: ":provider/import",
      },
    },
  },
};

let { path, queryParams } = Linking.parse(
  window.location.href.replace(
    "/authorize-createplaylist#",
    "/authorize-createplaylist?"
  )
);

let App: any;
if (path === "spotify/authorize-createplaylist") {
  const provider = getProvider("spotify");
  path = `/${provider.id}/import`;
  history.replaceState("", document.title, path);
  store.importFromAuthorizationCallback(queryParams, provider);
} else if (path?.includes("/import")) {
  path = path.replace("/import", "");
  history.replaceState("", document.title, path);
}

const Stack = createStackNavigator();

export default () => (
  <NavigationContainer linking={linking}>
    <Stack.Navigator initialRouteName={path || ""} headerMode="none">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t(
            "Importeer Top 2000 stemlijst naar $1",
            providers.map(({ name }) => name).join(", ")
          ),
        }}
      />
      <Stack.Screen
        name={"Select"}
        component={SelectScreen}
        options={({ route }) => {
          // @ts-ignore
          const provider = getProvider(route?.params?.provider);
          return {
            title: t("Importeer Top 2000 stemlijst naar $1", provider.name),
          };
        }}
      />
      <Stack.Screen
        name={"Import"}
        component={ImportScreen}
        options={({ route }) => {
          // @ts-ignore
          const provider = getProvider(route?.params?.provider);
          return {
            title: t("Importeer Top 2000 stemlijst naar $1", provider.name),
          };
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
