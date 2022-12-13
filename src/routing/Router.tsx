import React from "react";
import * as Linking from "expo-linking";
import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { store } from "../store";
import { t } from "../i18n";
import { providers, getProvider } from "../providers";
import HomeScreen from "../screens/HomeScreen";
import SelectScreen from "../screens/SelectScreen";
import ImportScreen from "../screens/ImportScreen";
import { StackParamList } from "./types";

const linking: LinkingOptions<StackParamList> = {
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

// console.log("PATH: ", path, queryParams);

let App: any;
if (path === "spotify/authorize-createplaylist") {
  const provider = getProvider("spotify");
  path = `/${provider.id}/import`;
  history.replaceState("", document.title, path);
  store.importFromAuthorizationCallback(
    provider,
    queryParams?.state as string,
    queryParams?.error as string,
    queryParams
  );
} else if (path === "deezer/authorize-createplaylist") {
  const importId = localStorage.getItem("nl.top2000stemlijst.deezer.importId");
  localStorage.removeItem("nl.top2000stemlijst.deezer.importId");
  console.log("IMPORT ID ", importId);
  const provider = getProvider("deezer");
  path = `/${provider.id}/import`;
  history.replaceState("", document.title, path);
  store.importFromAuthorizationCallback(
    provider,
    importId || undefined,
    queryParams?.error_reason as string,
    queryParams
  );
} else if (path?.includes("/import")) {
  path = path.replace("/import", "");
  history.replaceState("", document.title, path);
}

const Stack = createStackNavigator<StackParamList>();

export default () => (
  <NavigationContainer linking={linking}>
    <Stack.Navigator
      initialRouteName={(path || "") as keyof StackParamList}
      screenOptions={{
        headerShown: false,
        cardStyle: { height: "100%" },
      }}
    >
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
          const provider = getProvider(route?.params?.provider);
          return {
            title: t("Importeer Top 2000 stemlijst naar $1", provider.name),
          };
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
