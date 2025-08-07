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
  SafeAreaView,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";
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
} from "./slices/UserSlice";
import { parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotDarkBlue, parrotTextDarkBlue } from "./assets/color";

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
    height: vh(14),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // backgroundColor: "#fff6ec",
    backgroundColor: "#ede2d5ff",
  },
};

const selectedTabColor = parrotBlue;
const unselectedTabColor = parrotTextDarkBlue;
const selectedTabBackGroundColor = parrotBlueSemiTransparent;
const unselectedTabBackGroundColor = "green";

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
                <View style={{ ...styles.tabIconStyle, backgroundColor: focused && !modalVisible ? selectedTabBackGroundColor : unselectedTabBackGroundColor }}>
                  <Feather
                    name="home"
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
                  <Feather
                    name="user"
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
                    <Ionicons
                      name="rocket-outline"
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

                  <Feather
                    name="heart"
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
        />

        <Tab.Screen
          name="Messages"
          component={MessageStack}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{ ...styles.tabIconStyle, backgroundColor: focused && !modalVisible ? selectedTabBackGroundColor : unselectedTabBackGroundColor }}>

                  <AntDesign
                    name="sharealt"
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
      <TabNavigator isLoading={isLoadingUser} />
    ) : (
      <>
        <AuthStack />
      </>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: vh(5) }}>
      <Provider store={store}>
        <NavigationContainer>
          <RenderNavigator />
          <Toast config={toastConfig} />
        </NavigationContainer>
      </Provider>
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  tabIconStyle: {
    alignItems: "center",
    justifyContent: "center",
    width: vw(16),
    height: vw(16),
    borderRadius: vw(8),
  },
});


