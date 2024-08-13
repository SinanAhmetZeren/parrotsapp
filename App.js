// android 938579686654-kepneq1uk9lk4ac58t715qi282jf8c5f.apps.googleusercontent.com

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
  Button,
  ActivityIndicator,
} from "react-native";
import { vh } from "react-native-expo-viewport-units";
import {
  Feather,
  Ionicons,
  FontAwesome5,
  FontAwesome6,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import VoyageDetailScreen from "./screens/VoyageDetailScreen";
import VoyageDetailScreenHome from "./screens/VoyageDetailScreenHome";
import VoyageDetailScreenFavorites from "./screens/VoyageDetailScreenFavorites";
import VehicleDetailScreen from "./screens/VehicleDetailScreen";
import VehicleDetailScreenHome from "./screens/VehicleDetailScreenHome";
import VehicleDetailScreenFavorites from "./screens/VehicleDetailScreenFavorites";
import ProfileScreen from "./screens/ProfileScreen";
import ProfileScreenPublic from "./screens/ProfileScreenPublic";
import EditProfileScreen from "./screens/EditProfileScreen";
import EditVehicleScreen from "./screens/EditVehicleScreen";
import CreateVoyageScreen from "./screens/CreateVoyageScreen";
import CreateVehicleScreen from "./screens/CreateVehicleScreen";
import MessagesScreen from "./screens/MessagesScreen";
import { ConversationDetailScreen } from "./screens/ConversationDetailScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import LoginScreen from "./screens/LoginScreen";
import { CreateChoiceModal } from "./components/CreateChoiceModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  updateStateFromLocalStorage,
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
    bottom: vh(-1.5),
    right: 0,
    left: 0,
    elevation: 0,
    height: vh(10),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#fff6ec",
    //backgroundColor: "#ffeedb",
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
      <Stack.Screen
        name="VehicleDetail"
        component={VehicleDetailScreen}
        options={{
          unmountOnBlur: true,
        }}
      />
      <Stack.Screen
        name="VoyageDetail"
        component={VoyageDetailScreen}
        options={{
          unmountOnBlur: true,
        }}
      />
      <Stack.Screen
        name="ProfileScreenPublic"
        component={ProfileScreenPublic}
        options={{
          unmountOnBlur: true,
        }}
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
      <Stack.Screen
        name="VehicleDetail"
        component={VehicleDetailScreenHome}
        options={{
          unmountOnBlur: true,
        }}
      />
      <Stack.Screen
        name="VoyageDetail"
        component={VoyageDetailScreenHome}
        options={{
          unmountOnBlur: true,
        }}
      />
    </Stack.Navigator>
  );
};

const FavoritesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      <Stack.Screen
        name="VehicleDetail"
        component={VehicleDetailScreenFavorites}
        options={{
          unmountOnBlur: true,
        }}
      />
      <Stack.Screen
        name="VoyageDetail"
        component={VoyageDetailScreenFavorites}
        options={{
          unmountOnBlur: true,
        }}
      />
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
      <Stack.Screen
        name="CreateVoyageScreen"
        component={CreateVoyageScreen}
        options={{
          unmountOnBlur: true,
        }}
      />
      <Stack.Screen
        name="CreateVehicleScreen"
        component={CreateVehicleScreen}
        options={{
          unmountOnBlur: true,
        }}
      />

      <Stack.Screen
        name="EditVehicleScreen"
        component={EditVehicleScreen}
        options={{
          unmountOnBlur: true,
        }}
      />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
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
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={styles.tabIconStyle}>
                  <Feather
                    name="home"
                    size={24}
                    color={focused && !modalVisible ? "#3aa4ff" : "#000"}
                  />
                  <Text
                    style={
                      focused && !modalVisible
                        ? { fontSize: 12, color: "#3aa4ff", fontWeight: "600" }
                        : { fontSize: 12, color: "#000", fontWeight: "600" }
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
          name="ProfileStack"
          component={ProfileStack}
          options={{
            tabBarIcon: ({ focused }) => {
              // console.log(
              //   `hello there ${new Date().toISOString().slice(-8, -3)}`
              // );
              return (
                <View style={styles.tabIconStyle}>
                  <Feather
                    name="user"
                    size={24}
                    color={focused && !modalVisible ? "#3aa4ff" : "#000"}
                  />
                  <Text
                    style={
                      focused && !modalVisible
                        ? { fontSize: 12, color: "#3aa4ff", fontWeight: "600" }
                        : { fontSize: 12, color: "#000", fontWeight: "600" }
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
          name="Create"
          component={AddNewStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TouchableOpacity onPress={toggleModal}>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="rocket-outline"
                    //name="add-circle-outline"
                    size={24}
                    color={!modalVisible ? "black" : "#3aa4ff"}
                  />

                  <Text
                    style={
                      modalVisible
                        ? { fontSize: 12, color: "#3aa4ff", fontWeight: "600" }
                        : { fontSize: 12, color: "#000", fontWeight: "600" }
                    }
                  >
                    Voyage
                  </Text>
                </View>
              </TouchableOpacity>
            ),
          }}
        />

        <Tab.Screen
          name="Favorites"
          component={FavoritesStack}
          options={{
            tabBarIcon: ({ focused }) => {
              // console.log(
              //   `hello there ${new Date().toISOString().slice(-8, -3)}`
              // );
              return (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Feather
                    name="heart"
                    size={24}
                    color={focused && !modalVisible ? "#3aa4ff" : "#000"}
                  />
                  <Text
                    style={
                      focused && !modalVisible
                        ? { fontSize: 12, color: "#3aa4ff", fontWeight: "600" }
                        : { fontSize: 12, color: "#000", fontWeight: "600" }
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
                  <AntDesign
                    name="sharealt"
                    size={24}
                    color={focused && !modalVisible ? "#3aa4ff" : "#000"}
                  />

                  <Text
                    style={
                      focused && !modalVisible
                        ? { fontSize: 12, color: "#3aa4ff", fontWeight: "600" }
                        : { fontSize: 12, color: "#000", fontWeight: "600" }
                    }
                  >
                    Connect
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

    const isLoggedIn = useSelector((state) => state.users.isLoggedIn);
    const userId = useSelector((state) => state.users.userId);
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
      if (
        isSuccessUser &&
        isSuccessFavoriteVehicles &&
        isSuccessFavoriteVoyages
      ) {
        dispatch(
          updateUserFavorites({
            favoriteVehicles: favoriteVehicleData ? favoriteVehicleData : [0],
            favoriteVoyages: favoriteVoyageData ? favoriteVoyageData : [0],
          })
        );
      }
    }, [
      dispatch,
      isSuccessUser,
      isSuccessFavoriteVehicles,
      isSuccessFavoriteVoyages,
      favoriteVehicleData,
      favoriteVoyageData,
      userData,
    ]);

    if (
      isInitialLoading ||
      isLoadingFavoriteVehicles ||
      isLoadingFavoriteVoyages ||
      isLoadingUser
    ) {
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
      <>
        <AuthStack />
      </>
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
  tabIconStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
  bottomIcon: {
    height: vh(5),
    width: vh(5),
    borderRadius: vh(5),
    alignSelf: "center",
  },
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
