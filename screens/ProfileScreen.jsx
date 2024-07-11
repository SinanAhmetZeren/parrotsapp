/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState } from "react";
import { useEffect, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { vw, vh } from "react-native-expo-viewport-units";
import { Ionicons, Feather, MaterialIcons, Fontisto } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import VoyageListVertical from "../components/VoyageListVertical";
import VehicleList from "../components/VehicleList";
import Toast from "react-native-toast-message";
import { useGetUserByIdQuery } from "../slices/UserSlice";
import { useGetVoyagesByUserByIdQuery } from "../slices/VoyageSlice";
import { useGetVehiclesByUserByIdQuery } from "../slices/VehicleSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateAsLoggedOut } from "../slices/UserSlice";
import { SocialRenderComponent } from "../components/SocialRenderComponent";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL } from "@env";

export default function ProfileScreen({ navigation }) {
  const userId = useSelector((state) => state.users.userId);
  const dispatch = useDispatch();

  const {
    data: userData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch: refetchUserData,
  } = useGetUserByIdQuery(userId);

  const {
    data: VoyagesData,
    isSuccess: isSuccessVoyages,
    isLoading: isLoadingVoyages,
    refetch: refetchVoyageData,
  } = useGetVoyagesByUserByIdQuery(userId);
  const {
    data: VehiclesData,
    isSuccess: isSuccessVehicles,
    isLoading: isLoadingVehicles,
    refetch: refetchVehicleData,
  } = useGetVehiclesByUserByIdQuery(userId);
  const [selected, setSelected] = useState("voyages");

  const handleLogout = async () => {
    dispatch(updateAsLoggedOut());
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        console.log("profile screen useFocusEffect");
        try {
          if (userData) {
            await refetchUserData();
          }
          if (VoyagesData) {
            await refetchVoyageData();
          }
          if (VehiclesData) {
            await refetchVehicleData();
          }
        } catch (error) {
          console.error("Error fetching or refetching data:", error);
        }
      };
      fetchData();
      // }, [refetchVehicleData, refetchVoyageData, refetchUserData, navigation])
    }, [
      refetchVehicleData,
      refetchVoyageData,
      refetchUserData,
      navigation,
      VoyagesData,
      VehiclesData,
      userData,
    ])
  );

  const handleInstagramPress = async () => {
    if (userData.instagram) {
      const instagramProfile = `https://www.instagram.com/${userData.instagram}`;
      Linking.openURL(instagramProfile);
    }
  };

  const handleFacebookPress = async () => {
    const facebookPageID = `${userData.facebook}`;
    //const facebookPageID = `marcos.cezar.948`;
    const fallbackUrl = `https://www.facebook.com/${facebookPageID}`;
    Linking.openURL(fallbackUrl);
  };

  const handleEmailPress = async () => {
    if (userData.email) {
      let emailStr = userData.email;
      try {
        await Clipboard.setStringAsync(emailStr);
        Toast.show({
          type: "success",
          text1: "Email copied to clipboard",
          text2: emailStr,
          visibilityTime: 5000,
          topOffset: 150,
        });
      } catch (error) {
        console.error("Error copying to clipboard", error);
        Toast.show({
          type: "error",
          text1: "Failed to copy email to clipboard",
        });
      }
    }
  };

  const handlePhonePress = async () => {
    if (userData.phoneNumber) {
      const phoneUrl = `tel:${userData.phoneNumber}`;

      Linking.openURL(phoneUrl).catch((err) =>
        console.error("Error opening phone app:", err)
      );
    }
  };

  const handleYoutubePress = async () => {
    if (userData.youtube) {
      const youtubeUrl = `https://www.youtube.com/@${userData.youtube}`;
      Linking.openURL(youtubeUrl);
    }
  };

  const handleChangeSelection = (s) => {
    setSelected(s);
  };

  const BlueHashTagText = ({ originalText }) => {
    if (!originalText) {
      return null;
    }
    const words = originalText.split(" ");
    return (
      <Text style={styles.container}>
        {words.map((word, index) => {
          if (word.startsWith("#")) {
            return (
              <Text key={index} style={styles.blueText}>
                {word + " "}
              </Text>
            );
          } else {
            return (
              <Text style={styles.bioText} key={index}>
                {word + " "}
              </Text>
            );
          }
        })}
      </Text>
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ top: vh(30) }} />;
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 50 }}>error...</Text>
      </View>
    );
  }

  if (isSuccess && isSuccessVehicles && isSuccessVoyages) {
    const profileImageUrl = `${API_URL}/Uploads/UserImages/${userData.profileImageUrl}`;
    const backgroundImageUrl = `${API_URL}/Uploads/UserImages/${userData.backgroundImageUrl}`;

    return (
      <>
        <View style={styles.mainContainer}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.innerContainer}>
              <View style={styles.rectangularBox}>
                {!userData.backgroundImageUrl ? (
                  <Image
                    style={styles.imageContainer}
                    resizeMode="cover"
                    source={require("../assets/amazonForest.jpg")}
                  />
                ) : (
                  <Image
                    style={styles.imageContainer}
                    resizeMode="cover"
                    source={{ uri: backgroundImageUrl }}
                  />
                )}
              </View>

              <View style={styles.buttonsContainer}>
                {/* ///// PUBLIC PROFILE BUTTON /////// */}
                <TouchableOpacity
                  style={styles.publicProfileBox}
                  onPress={() => {
                    navigation.navigate("Create", {
                      screen: "ProfileScreenPublic",
                      params: { userId: userId },
                    });
                  }}
                  activeOpacity={0.8}
                >
                  <View>
                    <View style={styles.innerProfileContainer}>
                      <MaterialIcons
                        name="public"
                        size={18}
                        color="rgba(0, 119, 234,0.9)"
                      />
                      <Text
                        style={{
                          lineHeight: 22,
                          marginLeft: vw(2),
                          fontSize: 11,
                        }}
                      >
                        Public Profile
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {/* ///// PUBLIC PROFILE BUTTON /////// */}

                {/* ///// LOGOUT BUTTON /////// */}
                <TouchableOpacity
                  style={styles.logoutBox}
                  onPress={() => {
                    handleLogout();
                  }}
                  activeOpacity={0.8}
                >
                  <View>
                    <View style={styles.innerProfileContainer}>
                      <MaterialCommunityIcons
                        name="logout"
                        size={18}
                        color="rgba(0, 119, 234,0.9)"
                      />
                      <Text
                        style={{
                          lineHeight: 22,
                          marginLeft: vw(2),
                          fontSize: 11,
                        }}
                      >
                        Logout
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {/* ///// LOGOUT BUTTON /////// */}

                {/* ///// EDIT PROFILE BUTTON /////// */}
                <TouchableOpacity
                  style={styles.editProfileBox}
                  onPress={() => {
                    navigation.navigate("EditProfile");
                  }}
                  activeOpacity={0.8}
                >
                  <View>
                    <View style={styles.innerProfileContainer}>
                      <MaterialCommunityIcons
                        name="account-edit-outline"
                        size={18}
                        color="rgba(0, 119, 234,0.9)"
                      />
                      <Text
                        style={{
                          lineHeight: 22,
                          marginLeft: vw(2),
                          fontSize: 11,
                        }}
                      >
                        Edit Profile
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {/* ///// EDIT PROFILE BUTTON /////// */}
              </View>

              <View style={styles.profileImageAndSocial}>
                <View style={styles.profileImageAndName}>
                  <View style={styles.solidCircleProfile}>
                    <Image
                      style={styles.profileImage}
                      resizeMode="cover"
                      //resizeMode="contain"
                      source={{ uri: profileImageUrl }}
                    />
                  </View>
                </View>

                <View>
                  <SocialRenderComponent
                    userData={userData}
                    handleEmailPress={handleEmailPress}
                    handleInstagramPress={handleInstagramPress}
                    handleYoutubePress={handleYoutubePress}
                    handleFacebookPress={handleFacebookPress}
                    handlePhonePress={handlePhonePress}
                  />
                </View>
              </View>

              {/* ------- BIO ------ */}
              <View style={styles.bioBox}>
                <View style={styles.nameContainer}>
                  <Text style={styles.UserNameProfile}>
                    {userData.userName.length <= 30 ? (
                      userData.userName
                    ) : (
                      <>
                        <Text>{userData.userName.slice(0, 30)}</Text>
                        {userData.userName?.length > 30 ? (
                          <Text style={styles.clickableText}>...</Text>
                        ) : null}
                      </>
                    )}
                  </Text>
                </View>
                <View>
                  <Text style={styles.TitleProfile}>
                    {userData.title?.length <= 35 ? (
                      userData.title
                    ) : (
                      <>
                        <Text>{userData.title?.slice(0, 3)}</Text>
                        {userData.title?.length > 30 ? (
                          <Text style={styles.clickableText}>...</Text>
                        ) : null}
                      </>
                    )}
                  </Text>
                </View>
                <View>
                  <BlueHashTagText originalText={userData.bio} />
                </View>
              </View>
              {/* ------- BIO ------ */}

              {isLoadingVoyages ? (
                <ActivityIndicator size="large" />
              ) : isSuccessVoyages ? (
                <>
                  {VehiclesData[0] !== undefined ? (
                    <>
                      <View style={styles.mainBidsContainer}>
                        <View style={styles.currentBidsAndSeeAll}>
                          <Text style={styles.currentBidsTitle}>Vehicles</Text>
                        </View>
                      </View>
                      <View style={styles.voyageListContainer}>
                        <VehicleList
                          style={styles.voyageList}
                          data={VehiclesData}
                        />
                      </View>
                    </>
                  ) : null}

                  {VoyagesData !== null ? (
                    <>
                      <View style={styles.mainBidsContainer}>
                        <View style={styles.currentBidsAndSeeAll}>
                          <Text style={styles.currentBidsTitle}>Voyages</Text>
                        </View>
                      </View>
                      <View style={styles.voyageListContainer}>
                        <VoyageListVertical
                          style={styles.voyageList}
                          data={VoyagesData}
                        />
                      </View>
                    </>
                  ) : null}
                </>
              ) : null}
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  notCreated: {
    paddingVertical: vh(2),
    paddingHorizontal: vh(3),
    backgroundColor: "#f2f2f2",
    marginHorizontal: vh(3),
    borderRadius: vh(2),
    marginTop: vh(1),
  },
  notCreatedText: {
    fontSize: 16,
    color: "#9a9a9a",
  },
  currentBidsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3c9dde",
    paddingLeft: vw(5),
  },
  UserNameProfile: {
    fontSize: 22,
    fontWeight: "800",
    color: "#3c9dde",
  },
  TitleProfile: {
    fontSize: 16,
    fontWeight: "700",
    color: "#68b3e5",
  },
  currentBidsAndSeeAll: {
    marginTop: vh(2),
    flexDirection: "row",
    paddingRight: vw(10),
  },
  mainBidsContainer: {
    borderRadius: vw(5),
    borderColor: "#93c9ed",
  },
  rectangularBox: {
    height: vh(35),
  },
  imageContainer: {
    // top: vh(5),
    height: vh(40),
    width: vw(100),
  },
  scrollView: {
    height: vh(95),
    borderRadius: vh(4),
    // backgroundColor: "white",
    backgroundColor: "#fff6f0",
  },
  bioBox: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginTop: vh(0),
    paddingVertical: 10,
    width: "93%",
    borderRadius: 20,
    borderColor: "rgba(190, 119, 234,0.5)",
  },
  choiceItem: {
    marginHorizontal: 15,
  },
  choiceItemText: {
    fontSize: 18,
    fontWeight: "700",
    color: "grey",
  },
  viewChoice: {
    marginTop: vh(1),
    marginVertical: vh(0.1),
    width: vw(100),
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  selectedChoice: {
    paddingHorizontal: vh(6),
    paddingVertical: vh(0.3),
    borderRadius: vh(1.5),
    borderColor: "rgba(10, 119, 234,0.4)",
  },
  nonSelectedChoice: {
    paddingHorizontal: vh(6),
    paddingVertical: vh(0.3),
    borderRadius: vh(1.5),
    borderColor: "rgba(10, 119, 234,0.08)",
  },
  selectedText: {
    color: "rgba(91,91,255,1)",
    fontSize: 18,
    fontWeight: "700",
  },
  nonSelectedText: {
    fontSize: 18,
    fontWeight: "700",
    color: "rgba(91,91,255,.5)",
  },
  voyageListContainer: {
    width: vw(98),
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: vh(3),
  },
  vehicleList: {},
  blueText: {
    fontWeight: "600",
    color: "#000077",
  },
  bioText: {
    fontWeight: "600",
    color: "#878787",
    fontSize: 12,
  },
  nameContainer: {
    marginLeft: 0,
    paddingLeft: 0,
  },
  name: {
    fontSize: 19,
    fontWeight: "600",
    flexWrap: "wrap",
    flexShrink: 1,
    color: "#5b5bff",
  },
  clickableText: {
    color: "blue",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9f9fff",
  },
  bio: {
    paddingTop: 5,
  },
  socialBox: {
    flexDirection: "row",
    backgroundColor: "rgba(190, 119, 234,0.1)",
    left: vw(-4),
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  socialBox1: {
    flexDirection: "row",
    backgroundColor: "rgba(190, 119, 234,0.1)",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    left: vw(-10.5),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  socialBox2: {
    flexDirection: "row",
    backgroundColor: "rgba(190, 119, 234,0.1)",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    left: vw(-6),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  icon: {
    padding: 3,
    margin: 2,
    marginLeft: 8,
    borderRadius: 20,
    color: "rgba(0, 119, 234,0.9)",
    fontSize: 18,
  },

  iconText: {
    lineHeight: 22,
    marginVertical: 1,
    fontSize: 11,
  },
  //container of image and social
  profileImageAndSocial: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: vh(5),
    borderBottomLeftRadius: vh(0),
    borderBottomRightRadius: vh(0),
    width: "100%",
    alignSelf: "center",
    paddingBottom: vh(0.95),
    // backgroundColor: "white",
    backgroundColor: "#fff6f0",

    // top: vh(-9),
  },
  //container of social
  social: {
    flexDirection: "column",
    width: vw(50),
    zIndex: 100,
    paddingRight: 20,
    paddingTop: 0,
    top: vh(1),
    backgroundColor: "pink",
  },
  //container of image and name
  profileImageAndName: {
    left: vw(6),
    top: vh(3),
  },
  profileImage: {
    position: "absolute",
    top: vh(1),
    left: vh(1),
    height: vh(18),
    width: vh(18),
    borderRadius: vh(9),
    zIndex: 100,
  },
  solidCircleProfile: {
    height: vh(20),
    width: vh(20),
    borderRadius: vh(15),
    backgroundColor: "rgba(11, 111, 234,0.22)",
  },
  editProfileBox: {
    marginTop: vh(0.5),
    backgroundColor: "white",
    width: vw(30),
    flexDirection: "row",
    borderRadius: vh(2),
    padding: vw(1),
  },
  logoutBox: {
    marginTop: vh(0.5),
    backgroundColor: "white",
    width: vw(30),
    flexDirection: "row",
    borderRadius: vh(2),
    padding: vw(1),
    zIndex: 100,
  },
  publicProfileBox: {
    backgroundColor: "white",
    width: vw(30),
    flexDirection: "row",
    borderRadius: vh(2),
    padding: vw(1),
    zIndex: 100,
  },
  buttonsContainer: {
    position: "absolute",
    top: vh(22),
    right: vw(2),
    flexDirection: "column",
  },
  innerProfileContainer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: vh(2),
    paddingHorizontal: vw(2),
  },
});
