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

const { path, queryParams } = Linking.parse(
  window.location.href.replace(
    "/authorize-createplaylist#",
    "/authorize-createplaylist?"
  )
);

console.log("PATH: ", path);

const Stack = createStackNavigator();

const linking = {
  enabled: true,
  prefixes: [],
  config: {
    screens: {
      home: "",
    },
  },
};

let App: any;
if (path === "spotify/authorize-createplaylist") {
  const provider = getProvider("spotify")!;
  App = () => {
    React.useEffect(() => {
      history.replaceState("", document.title, `/${provider.id}`);
      store.importFromAuthorizationCallback(queryParams, provider);
    }, []);
    return (
      <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName={path || ""} headerMode="none">
          <Stack.Screen
            name="home"
            component={ImportScreen}
            options={{
              title: t("Importeer Top 2000 stemlijst naar $1", provider.name),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };
} else {
  App = () => (
    <NavigationContainer linking={linking}>
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
        {providers.map((provider) => (
          <Stack.Screen
            key={provider.id + "-import"}
            name={provider.id + "-import"}
            component={ImportScreen}
            options={{
              title: t("Importeer Top 2000 stemlijst naar $1", provider.name),
            }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
