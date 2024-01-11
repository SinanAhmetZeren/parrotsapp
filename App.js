import * as React from "react";
// import { Button, LogoTitle } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { StyleSheet } from "react-native";
import MainScreen from "./screens/MainScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainScreen}
          initialParams={{ message: "welcome to parrots" }}
          options={{
            title: "Main Page",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#004592",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />

        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={({ route }) => ({
            title: route.params.title,
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#004592",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
          initialParams={{ message: "welcome to profile page" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
