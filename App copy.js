/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Text, Platform, View, StyleSheet, Image } from "react-native";

import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";

import MainScreen from "./screens/MainScreen";
import MessagesScreen from "./screens/MessagesScreen";
import ProfileScreen from "./screens/ProfileScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import CreateVoyageScreen from "./screens/CreateVoyageScreen";
import ScreensList from "./screens/screensByEndpoints/ScreensList";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";

import { Provider } from "react-redux"; // Import the Provider
import { store } from "./store/store";
import { extendedApiSlice } from "./slices/UserSlice";
import RegisterScreen from "./screens/screensByEndpoints/RegisterScreen";

//store.dispatch(extendedApiSlice.endpoints.getAllUsers.initiate());
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: -20,
    right: 0,
    left: 0,
    elevation: 0,
    height: 120,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#fff6ec",
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
);

const TabNavigator = () => (
  <Tab.Navigator screenOptions={screenOptions}>
    <Tab.Screen
      name="ScreensList"
      component={ScreensList}
      options={{
        tabBarIcon: ({ focused }) => {
          return (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Feather
                name="heart"
                size={24}
                color={focused ? "#3aa4ff" : "#000"}
              />
              <Text
                style={
                  focused
                    ? { fontSize: 12, color: "#3aa4ff" }
                    : { fontSize: 12, color: "#000" }
                }
              >
                DevPages
              </Text>
            </View>
          );
        },
      }}
    />
    <Tab.Screen
      name="Home"
      component={MainScreen}
      options={{
        tabBarIcon: ({ focused }) => {
          return (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Feather
                name="home"
                size={24}
                color={focused ? "#3aa4ff" : "#000"}
              />
              <Text
                style={
                  focused
                    ? { fontSize: 12, color: "#3aa4ff" }
                    : { fontSize: 12, color: "#000" }
                }
              >
                Home
              </Text>
            </View>
          );
        },
      }}
    />

    <Tab.Screen
      name="Create"
      component={CreateVoyageScreen}
      options={{
        tabBarIcon: ({ focused }) => {
          return (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f21f4f",
                width: Platform.OS == "ios" ? 50 : 60,
                height: Platform.OS == "ios" ? 50 : 60,
                top: Platform.OS == "ios" ? -10 : -20,
                borderRadius: Platform.OS == "ios" ? 25 : 30,
              }}
            >
              <Image
                style={styles.plusSign}
                source={require("./assets/plus-icon.png")}
              />
            </View>
          );
        },
      }}
    />
    <Tab.Screen
      name="Messages"
      component={MessagesScreen}
      options={{
        tabBarIcon: ({ focused }) => {
          return (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Feather
                name="message-square"
                size={24}
                color={focused ? "#3aa4ff" : "#000"}
              />
              <Text
                style={
                  focused
                    ? { fontSize: 12, color: "#3aa4ff" }
                    : { fontSize: 12, color: "#000" }
                }
              >
                Messages
              </Text>
            </View>
          );
        },
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ focused }) => {
          return (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Feather
                name="user"
                size={24}
                color={focused ? "#3aa4ff" : "#000"}
              />
              <Text
                style={
                  focused
                    ? { fontSize: 12, color: "#3aa4ff" }
                    : { fontSize: 12, color: "#000" }
                }
              >
                Profile
              </Text>
            </View>
          );
        },
      }}
    />
  </Tab.Navigator>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);

  return (
    <Provider store={store}>
      <NavigationContainer>
        {isLoggedIn ? (
          <TabNavigator />
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForPassword" component={ForPasswordScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </Provider>
  );
}

export default App;

const styles = StyleSheet.create({
  plusSign: {
    height: 60,
    width: 60,
  },
});
