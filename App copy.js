import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createSwitchNavigator } from "@react-navigation/compat"; // Import switch navigator
import { Text, Platform, View } from "react-native";

import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import MainScreen from "./screens/MainScreen";
import MessagesScreen from "./screens/MessagesScreen";
import ProfileScreen from "./screens/ProfileScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import CreateVoyageScreen from "./screens/CreateVoyageScreen";
import AuthScreen from "./screens/AuthScreen"; // Add an authentication screen

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 60,
    background: "#fff",
  },
};

const MainStack = () => (
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
    {/* Add other main screens here */}
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Auth"
      component={AuthScreen}
      options={{
        headerShown: false,
      }}
    />
    {/* Add other authentication screens here */}
  </Stack.Navigator>
);

function App() {
  return (
    <NavigationContainer>
      <Switch.Navigator>
        <Switch.Screen name="Auth" component={AuthStack} />
        <Switch.Screen name="Main" component={MainStack} />
      </Switch.Navigator>
    </NavigationContainer>
  );
}

export default App;
