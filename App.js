// android 938579686654-kepneq1uk9lk4ac58t715qi282jf8c5f.apps.googleusercontent.com

/* eslint-disable react/display-name */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { useState } from "react";
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from "@expo-google-fonts/nunito";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
SplashScreen.preventAutoHideAsync();
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  // SafeAreaView,
  TextInput,
  Platform,
  AppState,
} from "react-native";

if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { vh, vw } from "react-native-expo-viewport-units";
import { Feather, Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
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
import GroupConversationDetail from "./components/GroupConversationDetail";
import { ConversationDetailScreen as GroupNew } from "./screens/GroupConversationScreen";
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
  setUnreadMessages,
  setHubConnected
} from "./slices/UserSlice";
import { parrotBananaLeafGreen, parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotBlueTransparent, parrotCream, parrotDarkBlue, parrotDarkCream, parrotGreen, parrotLightBlue, parrotRed, parrotTextDarkBlue, parrotYellow } from "./assets/color";
import { API_URL } from "@env";

import {
  initHubConnection,
  stopHubConnection,
  register_ReceiveMessageRefetch,
  unregister_ReceiveMessageRefetch,
  register_ReceiveUnreadNotification,
  unregister_ReceiveUnreadNotification,
  register_OnReconnecting,
  unregister_OnReconnecting,
  register_OnReconnected,
  unregister_OnReconnected,
  invokeHub
} from "./signalr/signalRHub";

import { registerPushTokenAsync } from "./utils/registerPushToken";
import { ParrotsStdText } from "./components/ParrotsStdText";

// Force font scaling to stay at 100% across the whole app
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;

if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const bottomTabColor = parrotCream;
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
    backgroundColor: bottomTabColor,
  },
};

const baseTextStyle = {
  fontFamily: "Nunito_700Bold",
  fontSize: 12,
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
        name="GroupConversationDetailScreen"
        component={GroupNew}
        options={{ unmountOnBlur: true }}
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
  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.OS === "ios"
    ? (vh(100) - insets.top - insets.bottom) * 0.08
    : vh(8);
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const isHubConnected = useSelector((state) => state.users.isHubConnected);
  const isLoggedIn = useSelector((state) => state.users.isLoggedIn);
  const [showConnectionPill, setShowConnectionPill] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || isHubConnected) {
      setShowConnectionPill(false);
      return;
    }
    const timer = setTimeout(() => setShowConnectionPill(true), 20000);
    return () => clearTimeout(timer);
  }, [isLoggedIn, isHubConnected]);

  return (
    <>
      <Tab.Navigator screenOptions={{ ...screenOptions1, tabBarStyle: { ...screenOptions1.tabBarStyle, height: tabBarHeight }, tabBarItemStyle: Platform.OS === "ios" ? { marginBottom: insets.bottom * 0.5 } : undefined }}  >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          listeners={({ navigation }) => ({
            blur: () => navigation.navigate("Home", { screen: "HomeScreen" }),
          })}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{ ...styles.tabIconStyle, backgroundColor: focused && !modalVisible ? selectedTabBackGroundColor : unselectedTabBackGroundColor }}>
                  <MaterialCommunityIcons
                    name={"home-outline"}
                    size={24}
                    color={focused && !modalVisible ? selectedTabColor : unselectedTabColor}
                  />
                  <ParrotsStdText style={{ ...baseTextStyle, color: focused && !modalVisible ? selectedTabColor : unselectedTabColor }}>
                    Home
                  </ParrotsStdText>
                </View>
              );
              // const active = focused && !modalVisible;
              // return (
              //   <View style={{ bottom: vh(-3) }}>
              //     <View style={{
              //       width: vw(12), height: vw(12), borderRadius: vw(6),
              //       backgroundColor: active ? "#d4bfa0" : "#c8b5a0",
              //       alignItems: "center", justifyContent: "center",
              //       shadowColor: "#b89e82", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 0, elevation: 5,
              //     }}>
              //       <View style={{
              //         width: vw(12), height: vw(12), borderRadius: vw(6),
              //         backgroundColor: active ? "#fff8f0" : "#f5ede3",
              //         alignItems: "center", justifyContent: "center", marginBottom: 7,
              //       }}>
              //         <MaterialCommunityIcons name={"home-outline"} size={24} color={active ? selectedTabColor : unselectedTabColor} />
              //       </View>
              //     </View>
              //     <ParrotsStdText style={{ ...baseTextStyle, display: "none", color: active ? selectedTabColor : unselectedTabColor, textAlign: "center", marginTop: -4 }}>Home</ParrotsStdText>
              //   </View>
              // );
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
                  <MaterialCommunityIcons name={"account-outline"} size={24} color={focused && !modalVisible ? selectedTabColor : unselectedTabColor} />
                  <ParrotsStdText style={{ ...baseTextStyle, color: focused && !modalVisible ? selectedTabColor : unselectedTabColor }}>Profile</ParrotsStdText>
                </View>
              );
              // const active = focused && !modalVisible;
              // return (
              //   <View style={{ bottom: vh(-3) }}>
              //     <View style={{ width: vw(12), height: vw(12), borderRadius: vw(6), backgroundColor: active ? "#d4bfa0" : "#c8b5a0", alignItems: "center", justifyContent: "center", shadowColor: "#b89e82", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 0, elevation: 5 }}>
              //       <View style={{ width: vw(12), height: vw(12), borderRadius: vw(6), backgroundColor: active ? "#fff8f0" : "#f5ede3", alignItems: "center", justifyContent: "center", marginBottom: 7 }}>
              //         <MaterialCommunityIcons name={"account-outline"} size={24} color={active ? selectedTabColor : unselectedTabColor} />
              //       </View>
              //     </View>
              //     <ParrotsStdText style={{ ...baseTextStyle, display: "none", color: active ? selectedTabColor : unselectedTabColor, textAlign: "center", marginTop: -4 }}>Profile</ParrotsStdText>
              //   </View>
              // );
            },
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("ProfileStack", {
                screen: "ProfileScreen",
              });
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
                <TouchableOpacity onPress={toggleModal} style={{ alignItems: "center" }}>
                  <View style={{
                    width: vw(15),
                    height: vw(15),
                    borderRadius: vw(7.5),
                    backgroundColor: "#ede2d5ff",
                    // backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    bottom: vh(-2.5),
                  }}>
                    <Image
                      // source={require("./assets/twoparrots.png")}
                      source={require("./assets/parrotwhiteoutlinebg.png")}
                      style={{
                        width: vw(13), height: vw(13), overflow: "hidden", borderRadius: vh(5)
                        // width: vw(18), height: vw(15), overflow: "hidden", borderRadius: vh(5), marginLeft: vw(1)
                      }}
                      resizeMode="contain"
                    />
                  </View>
                  {/* <ParrotsStdText style={{ ...baseTextStyle, color: isActive ? selectedTabColor : unselectedTabColor, bottom: vh(-2.3) }}>Voyage</ParrotsStdText> */}
                </TouchableOpacity>);
              // return (
              //   <TouchableOpacity onPress={toggleModal}>
              //     <View style={{ bottom: vh(-3) }}>
              //       <View style={{ width: vw(12), height: vw(12), borderRadius: vw(6), backgroundColor: isActive ? "#d4bfa0" : "#c8b5a0", alignItems: "center", justifyContent: "center", shadowColor: "#b89e82", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 0, elevation: 5 }}>
              //         <View style={{ width: vw(12), height: vw(12), borderRadius: vw(6), backgroundColor: isActive ? "#fff8f0" : "#f5ede3", alignItems: "center", justifyContent: "center", marginBottom: 7 }}>
              //           <MaterialCommunityIcons name={"rocket-launch-outline"} size={24} color={isActive ? selectedTabColor : unselectedTabColor} />
              //         </View>
              //       </View>
              //       <ParrotsStdText style={{ ...baseTextStyle, display: "none", color: isActive ? selectedTabColor : unselectedTabColor, textAlign: "center", marginTop: -4 }}>Voyage</ParrotsStdText>
              //     </View>
              //   </TouchableOpacity>)
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
                  <MaterialCommunityIcons name={"heart-outline"} size={24} color={focused && !modalVisible ? selectedTabColor : unselectedTabColor} />
                  <ParrotsStdText style={{ ...baseTextStyle, color: focused && !modalVisible ? selectedTabColor : unselectedTabColor }}>Favorites</ParrotsStdText>
                </View>
              );
              // const active = focused && !modalVisible;
              // return (
              //   <View style={{ bottom: vh(-3) }}>
              //     <View style={{ width: vw(12), height: vw(12), borderRadius: vw(6), backgroundColor: active ? "#d4bfa0" : "#c8b5a0", alignItems: "center", justifyContent: "center", shadowColor: "#b89e82", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 0, elevation: 5 }}>
              //       <View style={{ width: vw(12), height: vw(12), borderRadius: vw(6), backgroundColor: active ? "#fff8f0" : "#f5ede3", alignItems: "center", justifyContent: "center", marginBottom: 7 }}>
              //         <MaterialCommunityIcons name={"heart-outline"} size={24} color={active ? selectedTabColor : unselectedTabColor} />
              //       </View>
              //     </View>
              //     <ParrotsStdText style={{ ...baseTextStyle, display: "none", color: active ? selectedTabColor : unselectedTabColor, textAlign: "center", marginTop: -4 }}>Favorites</ParrotsStdText>
              //   </View>
              // );
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
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              const state = navigation.getState();
              const messagesStackKey = state.routes.find((r) => r.name === "Messages")?.key;
              if (messagesStackKey) {
                navigation.navigate("Messages", { screen: "MessagesScreen" });
              }
            },
          })}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{ ...styles.tabIconStyle, backgroundColor: focused && !modalVisible ? selectedTabBackGroundColor : unselectedTabBackGroundColor }}>
                  <MaterialCommunityIcons name={"share-variant-outline"} size={24} color={focused && !modalVisible ? selectedTabColor : unselectedTabColor} />
                  <ParrotsStdText style={{ ...baseTextStyle, color: focused && !modalVisible ? selectedTabColor : unselectedTabColor }}>Connect</ParrotsStdText>
                </View>
              );
              // const active = focused && !modalVisible;
              // return (
              //   <View style={{ bottom: vh(-3) }}>
              //     <View style={{ width: vw(12), height: vw(12), borderRadius: vw(6), backgroundColor: active ? "#d4bfa0" : "#c8b5a0", alignItems: "center", justifyContent: "center", shadowColor: "#b89e82", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 0, elevation: 5 }}>
              //       <View style={{ width: vw(12), height: vw(12), borderRadius: vw(6), backgroundColor: active ? "#fff8f0" : "#f5ede3", alignItems: "center", justifyContent: "center", marginBottom: 7 }}>
              //         <MaterialCommunityIcons name={"share-variant-outline"} size={24} color={active ? selectedTabColor : unselectedTabColor} />
              //       </View>
              //     </View>
              //     <ParrotsStdText style={{ ...baseTextStyle, display: "none", color: active ? selectedTabColor : unselectedTabColor, textAlign: "center", marginTop: -4 }}>Connect</ParrotsStdText>
              //   </View>
              // );
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

      {showConnectionPill && (
        <View style={{ position: "absolute", bottom: 80, alignSelf: "center", backgroundColor: "rgba(30, 111, 217, 0.9)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, zIndex: 999 }}>
          <ParrotsStdText style={{ color: "white", fontSize: 13, fontWeight: "600" }}>No connection — retrying...</ParrotsStdText>
        </View>
      )}
    </>
  );
};

function App() {
  const [fontsLoaded] = useFonts({ Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold });

  React.useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  function RenderNavigator() {

    const dispatch = useDispatch();
    const [isAuthChecking, setIsAuthChecking] = useState(true);

    useEffect(() => {
      let unreadHandlerTrue;
      const checkTokenAndInitHub = async () => {
        try {
          const storedToken = await AsyncStorage.getItem("storedToken");
          const storedUserId = await AsyncStorage.getItem("storedUserId");
          const storedUserName = await AsyncStorage.getItem("storedUserName");
          const storedProfileImageUrl = await AsyncStorage.getItem("storedProfileImageUrl");
          const storedProfileImageThumbnailUrl = await AsyncStorage.getItem("storedProfileImageThumbnailUrl");
          const storedHasAcknowledgedPublicProfile = await AsyncStorage.getItem("storedHasAcknowledgedPublicProfile");
          console.log("storedHasAcknowledgedPublicProfile:", storedHasAcknowledgedPublicProfile);
          const storedBookmarkedUserIds = await AsyncStorage.getItem("storedBookmarkedUserIds");

          if (storedToken) {
            registerPushTokenAsync(storedToken);

            // Restore Redux state immediately — navigate to home screen right away
            dispatch(
              updateStateFromLocalStorage({
                token: storedToken,
                userId: storedUserId,
                userName: storedUserName,
                profileImageUrl: storedProfileImageUrl,
                profileImageThumbnailUrl: storedProfileImageThumbnailUrl || "",
                hasAcknowledgedPublicProfile: storedHasAcknowledgedPublicProfile === "true",
                bookmarkedUserIds: storedBookmarkedUserIds ? JSON.parse(storedBookmarkedUserIds) : [],
              })
            );

            // Hub init + unread check in background — don't block navigation
            initHubConnection(storedUserId, API_URL).then(async () => {
              try {
                const hasUnread = await invokeHub("CheckUnreadMessages", storedUserId);
                if (hasUnread) dispatch(setUnreadMessages(true));
              } catch { }

              dispatch(setHubConnected(true));
              reconnectingHandler = () => dispatch(setHubConnected(false));
              reconnectedHandler = async () => {
                dispatch(setHubConnected(true));
                try {
                  const hasUnread = await invokeHub("CheckUnreadMessages", storedUserId);
                  if (hasUnread) dispatch(setUnreadMessages(true));
                } catch { }
              };
              register_OnReconnecting(reconnectingHandler);
              register_OnReconnected(reconnectedHandler);

              unreadHandlerTrue = () => dispatch(setUnreadMessages(true));
              register_ReceiveUnreadNotification(unreadHandlerTrue);
            }).catch(() => { });
          }
        } catch (error) { }
        finally {
          setIsAuthChecking(false);
        }
      };

      let reconnectingHandler;
      let reconnectedHandler;
      checkTokenAndInitHub();

      return () => {
        unregister_ReceiveUnreadNotification(unreadHandlerTrue);
        unregister_OnReconnecting(reconnectingHandler);
        unregister_OnReconnected(reconnectedHandler);
        // stopHubConnection();
      };

    }, []);

    const isLoggedIn = useSelector((state) => state.users.isLoggedIn);
    const userId = useSelector((state) => state.users.userId);
    const hasUnreadMessages = useSelector((state) => state.users.unreadMessages);
    const isHubConnectedLocal = useSelector((state) => state.users.isHubConnected);

    useEffect(() => {
      if (!isLoggedIn || !userId || isHubConnectedLocal) return;
      initHubConnection(userId, API_URL).then(async () => {
        try {
          const hasUnread = await invokeHub("CheckUnreadMessages", userId);
          if (hasUnread) dispatch(setUnreadMessages(true));
        } catch { }
        dispatch(setHubConnected(true));
      }).catch(() => { });
    }, [isLoggedIn, userId]);

    useEffect(() => {
      const subscription = AppState.addEventListener("change", async (nextState) => {
        const isForeground = nextState === "active";
        invokeHub("UpdatePresence", isForeground).catch(() => {});
        if (isForeground) {
          Notifications.setBadgeCountAsync(0).catch(() => {});
          try {
            const hasUnread = await invokeHub("CheckUnreadMessages", userId);
            if (hasUnread) dispatch(setUnreadMessages(true));
          } catch { }
        }
      });
      return () => subscription.remove();
    }, []);


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


    if (isAuthChecking) return null;

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



