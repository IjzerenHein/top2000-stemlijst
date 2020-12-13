import React from "react";
import * as Linking from "expo-linking";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { t } from "./i18n";
import { providers } from "./providers";
import HomeScreen from "./screens/HomeScreen";
import SelectScreen from "./screens/SelectScreen";
import ImportScreen from "./screens/ImportScreen";

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
    <NavigationContainer linking={linking}>
      {path === "spotify/authorize-createplaylist" ? (
        <Stack.Navigator initialRouteName={path || ""} headerMode="none">
          <Stack.Screen name="home" component={ImportScreen2} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName={path || ""} headerMode="none">
          <Stack.Screen
            name="home"
            component={HomeScreen}
            options={{
              title: t(
                "Importeer Top 2000 stemlijst naar $1",
                providers.map(({ name }) => name).join(", ")
              ),
            }}
          />
          {providers.map((provider) => (
            <Stack.Screen
              key={provider.id}
              name={provider.id}
              component={SelectScreen}
              options={{
                title: t("Importeer Top 2000 stemlijst naar $1", provider.name),
              }}
            />
          ))}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
