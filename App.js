/* eslint-disable react/display-name */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Text,
  Platform,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { vh } from "react-native-expo-viewport-units";
import { Feather, Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import VoyageDetailScreen from "./screens/VoyageDetailScreen";
import VehicleDetailScreen from "./screens/VehicleDetailScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ProfileScreenPublic from "./screens/ProfileScreenPublic";
import EditProfileScreen from "./screens/EditProfileScreen";
import EditVehicleScreen from "./screens/EditVehicleScreen";
import MyVoyagesScreen from "./screens/MyVoyagesScreen";
import CreateVoyageScreen from "./screens/CreateVoyageScreen";
import CreateVehicleScreen from "./screens/CreateVehicleScreen";
import MyVehiclesScreen from "./screens/MyVehiclesScreen";
import MyBidsScreen from "./screens/MyBidsScreen";
import MessagesScreen from "./screens/MessagesScreen";
import { ConversationDetailScreen } from "./screens/ConversationDetailScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import { CreateChoiceModal } from "./components/CreateChoiceModal";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  updateAsLoggedIn,
  updateStateFromLocalStorage,
  updateUserData,
  updateUserFavorites,
} from "./slices/UserSlice";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Provider } from "react-redux"; // Import the Provider
import { store } from "./store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  useGetUserByIdQuery,
  useGetFavoriteVoyageIdsByUserIdQuery,
  useGetFavoriteVehicleIdsByUserIdQuery,
} from "./slices/UserSlice";

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
      {/* <Stack.Screen name="HomeScreen" component={HomeScreen} /> */}

      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="CreateVoyageScreen" component={CreateVoyageScreen} />
      <Stack.Screen
        name="CreateVehicleScreen"
        component={CreateVehicleScreen}
      />

      <Stack.Screen
        name="ProfileScreenPublic"
        component={ProfileScreenPublic}
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="MyVoyages" component={MyVoyagesScreen} />
      <Stack.Screen name="MyVehicles" component={MyVehiclesScreen} />
      <Stack.Screen name="MyBids" component={MyBidsScreen} />
      <Stack.Screen name="VoyageDetail" component={VoyageDetailScreen} />
      <Stack.Screen name="EditVehicleScreen" component={EditVehicleScreen} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
      <Stack.Screen
        name="ConversationDetailScreen"
        component={ConversationDetailScreen}
      />
    </Stack.Navigator>
  );
};
const MessageStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
      <Stack.Screen
        name="ConversationDetailScreen"
        component={ConversationDetailScreen}
      />
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
      <Stack.Screen name="CreateVoyageScreen" component={CreateVoyageScreen} />

      <Stack.Screen
        name="CreateVehicleScreen"
        component={CreateVehicleScreen}
      />
    </Stack.Navigator>
  );
};
const AuthStack = () => {
  console.log("loading authstack");

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};
const TabNavigator = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
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

        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
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
            tabBarIcon: ({ focused }) => (
              <TouchableOpacity onPress={toggleModal}>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    top: Platform.OS === "ios" ? -20 : -30,
                  }}
                >
                  <View style={styles.plusContainer}>
                    <Image
                      style={styles.plusSign}
                      source={require("./assets/plus-thin.png")}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ),
          }}
        />

        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
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
          component={MessageStack}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
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

      <CreateChoiceModal
        modalVisible={modalVisible}
        toggleModal={toggleModal}
        setModalVisible={setModalVisible}
      />
    </>
  );
};

function App() {
  function RenderNavigator() {
    const isLoggedIn = useSelector((state) => state.users.isLoggedIn);
    const userId = useSelector((state) => state.users.userId);
    const userName = useSelector((state) => state.users.userName);

    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const dispatch = useDispatch();

    const {
      data: userData,
      isLoading: isLoadingUser,
      isSuccess: isSuccessUser,
    } = useGetUserByIdQuery(userId);
    const {
      data: favoriteVoyageData,
      isLoading: isLoadingFavoriteVoyages,
      isSuccess: isSuccessFavoriteVoyages,
    } = useGetFavoriteVoyageIdsByUserIdQuery(userId);

    const {
      data: favoriteVehicleData,
      isLoading: isLoadingFavoriteVehicles,
      isSuccess: isSuccessFavoriteVehicles,
    } = useGetFavoriteVehicleIdsByUserIdQuery(userId);

    useEffect(() => {
      const checkToken = async () => {
        try {
          const storedToken = await AsyncStorage.getItem("storedToken");
          const storedUserId = await AsyncStorage.getItem("storedUserId");
          const storedUserName = await AsyncStorage.getItem("storedUserName");
          const storedProfileImageUrl = await AsyncStorage.getItem(
            "storedProfileImageUrl"
          );

          if (storedToken) {
            dispatch(
              updateStateFromLocalStorage({
                token: storedToken,
                userId: storedUserId,
                userName: storedUserName,
                profileImageUrl: storedProfileImageUrl,
              })
            );
          } else {
            console.log("No token found.");
          }
        } catch (error) {
          console.log("Error retrieving token: ", error);
        } finally {
          setIsInitialLoading(false);
        }
      };

      checkToken();
    }, [dispatch]);

    useEffect(() => {
      // if (isSuccessUser) {
      //   console.log();
      //   dispatch(
      //     updateUserData({
      //       image: userData.profileImageUrl,
      //     })
      //   );
      // }

      if (isSuccessFavoriteVehicles && isSuccessFavoriteVoyages) {
        if (favoriteVehicleData === null || favoriteVoyageData === null) {
          dispatch(
            updateUserFavorites({
              favoriteVehicles: [],
              favoriteVoyages: [],
            })
          );
        } else {
          dispatch(
            updateUserFavorites({
              favoriteVehicles: favoriteVehicleData,
              favoriteVoyages: favoriteVoyageData,
            })
          );
        }
      }
    }, [isSuccessUser, isSuccessFavoriteVehicles, isSuccessFavoriteVoyages]);

    if (isInitialLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return isLoggedIn ? (
      <TabNavigator isLoading={isLoadingUser} />
    ) : (
      <AuthStack />
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <RenderNavigator />
        <Toast config={toastConfig} />
      </NavigationContainer>
    </Provider>
  );
}

export default App;

const styles = StyleSheet.create({
  plusSign: {
    height: vh(9),
    width: vh(9),
    borderRadius: vh(8),
    borderWidth: 3,
    borderColor: "#2184c6",
  },
  plusContainer: {
    backgroundColor: "#76bae8",
    padding: vh(0.35),
    borderRadius: vh(10),
  },
});

// #15537d
// #2184c6
// #76bae8
