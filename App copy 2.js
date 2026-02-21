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
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  // SafeAreaView,
  TextInput
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { vh, vw } from "react-native-expo-viewport-units";
import { Feather, Ionicons, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import HomeScreen from "./screens/HomeScreen";
import VoyageDetailScreen from "./screens/VoyageDetailScreen";
import VehicleDetailScreen from "./screens/VehicleDetailScreen";
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
  setUnreadMessages
} from "./slices/UserSlice";
import { parrotBananaLeafGreen, parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotBlueTransparent, parrotDarkBlue, parrotGreen, parrotLightBlue, parrotRed, parrotTextDarkBlue, parrotYellow } from "./assets/color";
import { API_URL } from "@env";

import {
  initHubConnection,
  stopHubConnection,
  register_ReceiveMessageRefetch,
  unregister_ReceiveMessageRefetch,
  invokeHub
} from "./signalr/signalRHub";

// Force font scaling to stay at 100% across the whole app
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;

if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const bottomTabColor = "#ede2d5ff";
const selectedTabColor = parrotBlue;
const unselectedTabColor = "black" || "#3c9dde" || parrotBlue;
const selectedTabBackGroundColor = "rgba(240,240,240,0.0009)"//parrotBlueSemiTransparent;
const unselectedTabBackGroundColor = "rgba(0, 119, 234, 0.01)";

const styles = StyleSheet.create({
  tabIconStyle: {
    alignItems: "center",
    justifyContent: "center",
    width: vw(14),
    height: vw(13),
    borderRadius: vw(4),
    bottom: vh(-3)
  },
});

const screenOptions1 = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    height: vh(8),
    right: 0,
    left: 0,
    elevation: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // backgroundColor: "#fff6ec",
    backgroundColor: bottomTabColor,
  },
};

const baseTextStyle = {
  fontSize: 12,
  fontWeight: "600",
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

  infoLarge: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "blue",
        height: "30rem",
        paddingVertical: 15,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        justifyContent: "center",
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: "500",
      }}
      text2Style={{
        fontSize: 14,
        color: "purple",
        marginTop: 4,
      }}
      text1NumberOfLines={3}
      text2NumberOfLines={3}
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
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};
const TabNavigator = ({ hasUnreadMessages, isLoading }) => {
  const [modalVisible, setModalVisible] = useState(false);
  console.log("--->>", hasUnreadMessages);



  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <>
      <Tab.Navigator screenOptions={screenOptions1}  >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{ ...styles.tabIconStyle, backgroundColor: focused && !modalVisible ? selectedTabBackGroundColor : unselectedTabBackGroundColor }}>
                  <MaterialCommunityIcons
                    name={"home-outline"}
                    size={24}
                    color={focused && !modalVisible ? selectedTabColor : unselectedTabColor}
                  />
                  <Text
                    style={{
                      ...baseTextStyle,
                      color: focused && !modalVisible ? selectedTabColor : unselectedTabColor,
                    }}
                  >
                    Home
                  </Text>
                </View>
              );
            },
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              const state = navigation.getState();

              const homeStackKey = state.routes.find(
                (r) => r.name === "Home"
              )?.key;

              if (homeStackKey) {
                navigation.navigate("Home", {
                  screen: "HomeScreen",
                });
              }
            },
          })}
        />

        <Tab.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{ ...styles.tabIconStyle, backgroundColor: focused && !modalVisible ? selectedTabBackGroundColor : unselectedTabBackGroundColor }}>
                  <MaterialCommunityIcons
                    name={"account-outline"}
                    size={24}
                    color={focused && !modalVisible ? selectedTabColor : unselectedTabColor}
                  />
                  <Text
                    style={{
                      ...baseTextStyle,
                      color: focused && !modalVisible ? selectedTabColor : unselectedTabColor,
                    }}
                  >
                    Profile
                  </Text>
                </View>
              );
            },
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              const state = navigation.getState();

              const homeStackKey = state.routes.find(
                (r) => r.name === "ProfileScreen"
              )?.key;

              if (homeStackKey) {
                navigation.navigate("ProfileStack", {
                  screen: "ProfileScreen",
                });
              }
            },
          })}
        />

        <Tab.Screen
          name="Create"
          component={AddNewStack}
          options={{
            tabBarIcon: ({ focused }) => {
              const isActive = focused || modalVisible;
              return (
                <TouchableOpacity onPress={toggleModal} >
                  <View style={{ ...styles.tabIconStyle, backgroundColor: isActive ? selectedTabBackGroundColor : unselectedTabBackGroundColor }}>
                    <MaterialCommunityIcons
                      name={"rocket-launch-outline"}
                      size={24}
                      color={isActive ? selectedTabColor : unselectedTabColor}
                    />
                    <Text
                      style={{
                        ...baseTextStyle,
                        color: isActive ? selectedTabColor : unselectedTabColor,
                      }}
                    >
                      Voyage
                    </Text>
                  </View>
                </TouchableOpacity>)
            }
          }}
        />

        <Tab.Screen
          name="Favorites"
          component={FavoritesStack}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{ ...styles.tabIconStyle, backgroundColor: focused && !modalVisible ? selectedTabBackGroundColor : unselectedTabBackGroundColor }}>

                  <MaterialCommunityIcons
                    name={"heart-outline"}
                    size={24}
                    color={focused && !modalVisible ? selectedTabColor : unselectedTabColor}
                  />
                  <Text
                    style={{
                      ...baseTextStyle,
                      color: focused && !modalVisible ? selectedTabColor : unselectedTabColor,
                    }}
                  >
                    Favorites
                  </Text>
                </View>
              );
            },
          }}

          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault(); // ⬅️ IMPORTANT

              const state = navigation.getState();

              const favoritesStackKey = state.routes.find(
                (r) => r.name === "Favorites"
              )?.key;

              if (favoritesStackKey) {
                navigation.navigate("Favorites", {
                  screen: "FavoritesScreen",
                });
              }
            },
          })}
        />

        <Tab.Screen
          name="Messages"
          component={MessageStack}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{
                  ...styles.tabIconStyle,
                  backgroundColor: focused && !modalVisible ? selectedTabBackGroundColor : unselectedTabBackGroundColor,
                }}>

                  <MaterialCommunityIcons
                    name={"share-variant-outline"}
                    size={24}
                    color={focused && !modalVisible ? selectedTabColor : unselectedTabColor}
                  />
                  <Text
                    style={{
                      ...baseTextStyle,
                      color: focused && !modalVisible ? selectedTabColor : unselectedTabColor,
                    }}
                  >
                    Connect
                  </Text>
                </View>
              );
            },

            tabBarBadge: hasUnreadMessages ? <MaterialIcons name="mail-outline" size={10} color="white" /> : undefined, //"•" //"🦜" 📨 📪 📫 📬 📤 🗳️"👀"
            tabBarBadgeStyle: {
              backgroundColor: parrotRed,//"transparent", // your custom badge background
              color: "white",
              fontSize: 12,        // adjust to fit
              minWidth: 16,
              height: 20,
              borderRadius: 10,    // half of height for perfect circle
              textAlign: "center", // horizontal center
              textAlignVertical: "center", // vertical center (Android)
              lineHeight: 20,      // same as height for iOS vertical center
              paddingHorizontal: 4,

            },

          }}
        />
      </Tab.Navigator >

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
    const hasUnreadMessages = useSelector((state) => state.users.unreadMessages);
    useEffect(() => {
      const checkTokenAndInitHub = async () => {
        try {
          const storedToken = await AsyncStorage.getItem("storedToken");
          const storedUserId = await AsyncStorage.getItem("storedUserId");
          const storedUserName = await AsyncStorage.getItem("storedUserName");
          const storedProfileImageUrl = await AsyncStorage.getItem("storedProfileImageUrl");

          if (storedToken) {
            dispatch(
              updateStateFromLocalStorage({
                token: storedToken,
                userId: storedUserId,
                userName: storedUserName,
                profileImageUrl: storedProfileImageUrl,
              })
            );

            // 🟢 Initialize SignalR here
            const hub = await initHubConnection(storedUserId, API_URL);

            // 🟢 Check for unread messages right after login
            try {
              const hasUnreadMessages = await invokeHub("CheckUnreadMessages", storedUserId);
              dispatch(setUnreadMessages(hasUnreadMessages)); // update your global state
            } catch (err) {
              console.error("Failed to check unread messages:", err);
            }

            // 🟢 Listen globally for UnreadMessagesStatusTrue
            hub.on("UnreadMessagesStatusTrue", () => {
              console.log("🔔 hello --> UnreadMessagesStatusTrue received");
              // dispatch(setUnreadMessages(true)); // update global state
            });

          } else {
            console.log("No token found.");
          }
        } catch (error) {
          console.log("Error retrieving token: ", error);
        } finally {
          setIsInitialLoading(false);
        }
      };
      checkTokenAndInitHub();
      return () => {
        stopHubConnection(); // cleanup on unmount
      };
    }, [dispatch]);



    const isLoggedIn = useSelector((state) => state.users.isLoggedIn);
    const userId = useSelector((state) => state.users.userId);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const dispatch = useDispatch();


    const {
      data: userData,
      isLoading: isLoadingUser,
      isSuccess: isSuccessUser,
    } = useGetUserByIdQuery(userId, {
      skip: !userId,
    });

    const {
      data: favoriteVoyageData,
      isLoading: isLoadingFavoriteVoyages,
      isSuccess: isSuccessFavoriteVoyages,
    } = useGetFavoriteVoyageIdsByUserIdQuery(userId, {
      skip: !userId,
    });

    const {
      data: favoriteVehicleData,
      isLoading: isLoadingFavoriteVehicles,
      isSuccess: isSuccessFavoriteVehicles,
    } = useGetFavoriteVehicleIdsByUserIdQuery(userId, {
      skip: !userId,
    });

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
      <TabNavigator isLoading={isLoadingUser} hasUnreadMessages={hasUnreadMessages} />
    ) : (
      <>
        <AuthStack />
      </>
    );
  }

  return (
    <SafeAreaProvider  >
      <SafeAreaView style={{ flex: 1 }}>
        <Provider store={store}>
          <NavigationContainer>
            <RenderNavigator />
            <Toast config={toastConfig} />
          </NavigationContainer>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>

  );
}

export default App;



