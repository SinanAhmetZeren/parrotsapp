/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, Platform, View, StyleSheet, Image } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";

// Import statements for each screen
import AddNewVehicleScreen from "./screens/AddNewVehicleScreen";
import AddNewVoyageScreen from "./screens/AddNewVoyageScreen";
import HomeScreen from "./screens/HomeScreen";
import VoyageDetailScreen from "./screens/VoyageDetailScreen";
import VehicleDetailScreen from "./screens/VehicleDetailScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import MyVoyagesScreen from "./screens/MyVoyagesScreen";
import MyVehiclesScreen from "./screens/MyVehiclesScreen";
import MyBidsScreen from "./screens/MyBidsScreen";
import MessagesScreen from "./screens/MessagesScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Provider } from "react-redux"; // Import the Provider
import { store } from "./store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
let storedToken;

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
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "pink" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
      }}
      text2Style={{
        fontSize: 15,
        fontWeight: "400",
        color: "purple",
      }}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
};
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="MyVoyages" component={MyVoyagesScreen} />
      <Stack.Screen name="MyVehicles" component={MyVehiclesScreen} />
      <Stack.Screen name="MyBids" component={MyBidsScreen} />
      <Stack.Screen name="VoyageDetail" component={VoyageDetailScreen} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
    </Stack.Navigator>
  );
};
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="VoyageDetail" component={VoyageDetailScreen} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
    </Stack.Navigator>
  );
};
const AddNewStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AddNewVoyage" component={AddNewVoyageScreen} />
      <Stack.Screen name="AddNewVehicle" component={AddNewVehicleScreen} />
    </Stack.Navigator>
  );
};
const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};
const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
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

      {/* <Tab.Screen
        name="VoyageDetail"
        component={VoyageDetailScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <MaterialIcons
                  name="details"
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
                  Voyage Detail
                </Text>
              </View>
            );
          },
        }}
      /> */}

      <Tab.Screen
        name="Home"
        component={HomeStack}
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
        component={AddNewStack}
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
        name="Favorites"
        component={FavoritesScreen}
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
                  Favorites
                </Text>
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
    </Tab.Navigator>
  );
};

function RenderNavigator({ isLoggedIn }) {
  return isLoggedIn ? <TabNavigator /> : <AuthStack />;
}

function App() {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          console.log("Stored token from app.js:", token);
          dispatch(setLoggedIn(true));
        } else {
          console.log("No token found.");
        }
      } catch (error) {
        console.log("Error retrieving token:", error);
      }
    };

    checkToken();
  }, [dispatch]);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <RenderNavigator isLoggedIn={isLoggedIn} />
        <Toast config={toastConfig} />
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
