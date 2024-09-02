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
  Modal,
  RefreshControl,
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
import { SocialRenderComponentModal } from "../components/SocialRenderComponentModal";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL } from "@env";

export default function ProfileScreen({ navigation }) {
  const userId = useSelector((state) => state.users.userId);
  const dispatch = useDispatch();
  const [socialItemCount, setSocialItemCount] = useState(0);
  const [socialModalVisible, setSocialModalVisible] = useState(false);
  const [retryCountUser, setRetryCountUser] = useState(0);
  const [retryCountVoyages, setRetryCountVoyages] = useState(0);
  const [retryCountVehicles, setRetryCountVehicles] = useState(0);
  const [shouldFetchUser, setShouldFetchUser] = useState(false);
  const [shouldFetchVoyages, setShouldFetchVoyages] = useState(false);
  const [shouldFetchVehicles, setShouldFetchVehicles] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error,
    isSuccess: isSuccessUser,
    refetch: refetchUserData,
  } = useGetUserByIdQuery(userId);

  const {
    data: VoyagesData,
    isSuccess: isSuccessVoyages,
    isError: isErrorVoyages,
    isLoading: isLoadingVoyages,
    refetch: refetchVoyageData,
  } = useGetVoyagesByUserByIdQuery(userId);
  const {
    data: VehiclesData,
    isSuccess: isSuccessVehicles,
    isError: isErrorVehicles,
    isLoading: isLoadingVehicles,
    refetch: refetchVehicleData,
  } = useGetVehiclesByUserByIdQuery(userId);

  const handleLogout = async () => {
    dispatch(updateAsLoggedOut());
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
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
      console.log("1", isSuccessUser);
      console.log("2", isSuccessVehicles);
      console.log("3", isSuccessVoyages);
      console.log("4", isErrorUser);
      console.log("5", isErrorVehicles);
      console.log("6", isErrorVoyages);
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

  useEffect(() => {
    if (isErrorUser || isErrorVehicles || isErrorVoyages) {
      setHasError(true);
    }
  }, [isErrorUser, isErrorVehicles, isErrorVoyages]);

  const onRefresh = () => {
    setRefreshing(true);
    setHasError(false);
    console.log("refreshing 1");
    try {
      const refreshData = async () => {
        setIsLoading(true);
        console.log("refreshing 2");
        await refetchUserData();
        await refetchVehicleData();
        await refetchVoyageData();
        setIsLoading(false);
      };
      refreshData();
      console.log("refreshing 3");
    } catch (error) {
      console.log(error);
      setHasError(true);
    }
    setRefreshing(false);
  };

  const handleInstagramPress = async () => {
    if (userData.instagram) {
      const instagramProfile = `https://www.instagram.com/${userData.instagram}`;
      Linking.openURL(instagramProfile);
    }
  };

  const handleFacebookPress = async () => {
    const facebookPageID = `${userData.facebook}`;
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

  const handleTwitterPress = async () => {
    const twitterUsername = `${userData.twitter}`;
    const fallbackUrl = `https://twitter.com/${twitterUsername}`;
    Linking.openURL(fallbackUrl);
  };

  const handleTiktokPress = async () => {
    const tiktokUsername = `${userData.tiktok}`;
    const fallbackUrl = `https://www.tiktok.com/@${tiktokUsername}`;
    Linking.openURL(fallbackUrl);
  };

  const handleLinkedinPress = async () => {
    const linkedinProfileID = `${userData.linkedin}`;
    const fallbackUrl = `https://www.linkedin.com/in/${linkedinProfileID}`;
    Linking.openURL(fallbackUrl);
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

  if (isLoadingUser || isLoadingVehicles || isLoadingVoyages || isLoading) {
    console.log("isloading something");
    return <ActivityIndicator size="large" style={{ top: vh(30) }} />;
  }

  if (hasError) {
    return (
      <ScrollView
        style={styles.mainBidsContainer2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#9Bd35A", "#689F38"]} // Android
            tintColor="#689F38" // iOS
          />
        }
      >
        <View style={styles.currentBidsAndSeeAll2}>
          <Image
            source={require("../assets/ParrotsWhiteBg.png")}
            style={styles.logoImage}
          />
          <Text style={styles.currentBidsTitle2}>Connection Error</Text>
          <Text style={styles.currentBidsTitle2}>Swipe down to retry</Text>
        </View>
      </ScrollView>
    );
  }

  if (isSuccessUser && isSuccessVehicles && isSuccessVoyages) {
    console.log("is success user", isSuccessUser);
    // setHasError(false);
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
                    navigation.navigate("ProfileStack", {
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
                    handleTwitterPress={handleTwitterPress}
                    handleTiktokPress={handleTiktokPress}
                    handleLinkedinPress={handleLinkedinPress}
                    setSocialItemCount={setSocialItemCount}
                  />
                </View>
              </View>

              {/* ------- BIO ------ */}
              <View style={styles.bioBox}>
                {(socialItemCount > 5 && userData.emailVisible == true) ||
                (socialItemCount > 6 && userData.emailVisible == false) ? (
                  <TouchableOpacity
                    onPress={() => {
                      setSocialModalVisible(true);
                    }}
                    style={styles.extendedAreaContainer}
                  >
                    <View style={styles.extendedArea}>
                      <Text style={styles.moreButton}>see more</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}

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

          <View>
            <Modal
              animationType="fade"
              transparent={true}
              visible={socialModalVisible}
              onRequestClose={() => setSocialModalVisible(false)}
            >
              <TouchableOpacity
                onPress={() => setSocialModalVisible(false)}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(1,1,1,0.3)",
                }}
              >
                <View style={styles.socialRenderComponentModal}>
                  <SocialRenderComponentModal
                    userData={userData}
                    handleEmailPress={handleEmailPress}
                    handleInstagramPress={handleInstagramPress}
                    handleYoutubePress={handleYoutubePress}
                    handleFacebookPress={handleFacebookPress}
                    handlePhonePress={handlePhonePress}
                    handleTwitterPress={handleTwitterPress}
                    handleTiktokPress={handleTiktokPress}
                    handleLinkedinPress={handleLinkedinPress}
                    setSocialItemCount={setSocialItemCount}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  logoImage: {
    marginTop: vh(25),
    height: vh(25),
    width: vh(25),
    borderRadius: vh(15),
  },
  mainBidsContainer2: { backgroundColor: "white", flex: 1 },
  currentBidsAndSeeAll2: {
    alignItems: "center",
    alignSelf: "center",
  },
  currentBidsTitle2: {
    fontSize: 17,
    fontWeight: "700",
    color: "#3c9dde",
    textAlign: "center",
  },

  closeButtonAndText2: {
    flexDirection: "row",
    position: "absolute",
    height: vh(3.5),
    width: vh(11.45),
    borderRadius: vh(2.5),
    bottom: vh(-6),
    alignSelf: "center",
  },
  socialRenderComponentModal: {
    top: vh(20),
    backgroundColor: "white",
    alignSelf: "center",
    justifyContent: "center",
    width: vw(65),
    borderRadius: vh(2),
    borderColor: "rgba(10, 119, 234,0.9)",
    paddingVertical: vh(2),
  },
  closeButtonAndText: {
    flexDirection: "row",
    borderRadius: vh(2.5),
    borderColor: "#3aa4ff",
    top: vh(14),
    alignSelf: "center",
  },
  closeButtonInModal2: {
    alignSelf: "center",
    backgroundColor: "rgba(217, 241, 241,.99)",
    borderRadius: vh(10),
    padding: vh(1.5),
    borderColor: "#93c9ed",
  },
  extendedAreaContainer: {
    alignSelf: "flex-end",
    position: "absolute",
    top: vh(-2),
    right: vw(0),
    borderRadius: vh(4),
    // backgroundColor: "pink",
    zIndex: 100,
  },
  extendedArea: {
    paddingHorizontal: vw(1),
    paddingVertical: vh(1),
    // backgroundColor: "red",
  },
  moreButton: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(0, 119, 234,.51)",
    alignSelf: "flex-end",
    backgroundColor: "rgba(0, 119, 234,0.051)",
    borderRadius: vh(2),
    paddingHorizontal: vw(2),
    paddingHorizontal: vw(2),
  },
  notCreated: {
    paddingVertical: vh(2),
    paddingHorizontal: vh(3),
    backgroundColor: "#f2f2f2",
    marginHorizontal: vh(3),
    borderRadius: vh(2),
    marginTop: vh(1),
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
  voyageListContainer: {
    width: vw(98),
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: vh(3),
  },
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
  icon: {
    padding: 3,
    margin: 2,
    marginLeft: 8,
    borderRadius: 20,
    color: "rgba(0, 119, 234,0.9)",
    fontSize: 18,
  },
  profileImageAndSocial: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: vh(5),
    borderBottomLeftRadius: vh(0),
    borderBottomRightRadius: vh(0),
    width: "100%",
    alignSelf: "center",
    paddingBottom: vh(0.95),
    backgroundColor: "#fff6f0",
  },
  social: {
    flexDirection: "column",
    width: vw(50),
    zIndex: 100,
    paddingRight: 20,
    paddingTop: 0,
    top: vh(1),
  },
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
