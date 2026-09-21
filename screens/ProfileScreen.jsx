import { ParrotsStdText } from "../components/ParrotsStdText";
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
  Pressable,
  Linking,
  ActivityIndicator,
  Modal,
  RefreshControl,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { vw, vh } from "react-native-expo-viewport-units";
import { Ionicons, Feather, MaterialIcons, Fontisto, AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import VoyageListVertical from "../components/VoyageListVertical";
import VehicleList from "../components/VehicleList";
import { useGetUserByIdQuery, useLazyGetParrotCrackerBalanceQuery, useClearPushTokenMutation } from "../slices/UserSlice";
import { useGetVoyagesByUserByIdQuery } from "../slices/VoyageSlice";
import { useGetVehiclesByUserByIdQuery } from "../slices/VehicleSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateAsLoggedOut } from "../slices/UserSlice";
import { SocialRenderComponent } from "../components/SocialRenderComponent";
import { SocialRenderComponentModal } from "../components/SocialRenderComponentModal";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import he from "he";
import { parrotBananaLeafGreen, parrotBlue, parrotBlueSemiTransparent, parrotCaravanOrangeRed, parrotCream, parrotDarkBlue, parrotLightBlue, parrotPistachioGreen, parrotRed, parrotTextDarkBlue } from "../assets/color";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
import TermsOfUseComponent from "../components/TermsOfUseComponent";
import LoadingLogo from "../components/LoadingLogo";

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const userId = useSelector((state) => state.users.userId);
  const isHubConnected = useSelector((state) => state.users.isHubConnected);
  const dispatch = useDispatch();
  const [clearPushToken] = useClearPushTokenMutation();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const [showFullBio, setShowFullBio] = useState(false);
  const [socialItemCount, setSocialItemCount] = useState(0);
  const [socialModalVisible, setSocialModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [retryCountUser, setRetryCountUser] = useState(0);
  const [retryCountVoyages, setRetryCountVoyages] = useState(0);
  const [retryCountVehicles, setRetryCountVehicles] = useState(0);
  const [shouldFetchUser, setShouldFetchUser] = useState(false);
  const [shouldFetchVoyages, setShouldFetchVoyages] = useState(false);
  const [shouldFetchVehicles, setShouldFetchVehicles] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [crackerModalVisible, setCrackerModalVisible] = useState(false);
  const [parrotCrackerBalance, setParrotCrackerBalance] = useState(null);
  const [getParrotCrackerBalance] = useLazyGetParrotCrackerBalanceQuery();

  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error,
    isSuccess: isSuccessUser,
    refetch: refetchUserData,
    isUninitialized: userUninit,

  } = useGetUserByIdQuery(userId);


  const {
    data: VoyagesData,
    isSuccess: isSuccessVoyages,
    isError: isErrorVoyages,
    isLoading: isLoadingVoyages,
    refetch: refetchVoyageData,
    isUninitialized: voyageUninit,

  } = useGetVoyagesByUserByIdQuery(userId);

  const {
    data: VehiclesData,
    isSuccess: isSuccessVehicles,
    isError: isErrorVehicles,
    isLoading: isLoadingVehicles,
    refetch: refetchVehicleData,
    isUninitialized: vehicleUninit,

  } = useGetVehiclesByUserByIdQuery(userId);

  const handleLogout = async () => {
    try {
      const expoPushToken = await AsyncStorage.getItem("storedExpoPushToken");
      if (expoPushToken) {
        await clearPushToken(expoPushToken).unwrap();
        await AsyncStorage.removeItem("storedExpoPushToken");
      }
    } catch (_) { }
    dispatch(updateAsLoggedOut());
    // await GoogleSignin.signOut();
  };


  /*
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
*/


  const handleGetParrotCrackerBalance = async () => {
    try {

      const response = await getParrotCrackerBalance(userId).unwrap();
      setParrotCrackerBalance(response.balance); // or response.balance depending on API
    } catch (error) {
      console.error("Error fetching ParrotCracker balance:", error);
    }
  };


  const handleCloseTermsModal = () => {
    setTermsModalVisible(false);
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        try {
          if (!isActive || !userId) return;

          if (!userUninit) await refetchUserData();
          if (!isActive || !userId) return;
          if (!voyageUninit) await refetchVoyageData();
          if (!isActive || !userId) return;
          if (!vehicleUninit) await refetchVehicleData();
        } catch (error) {
          if (userId) console.error("Error refetching profile data:", error);
        }
      };

      fetchData();

      return () => {
        isActive = false; // cleanup on blur / logout
      };
    }, [
      refetchUserData,
      refetchVoyageData,
      refetchVehicleData,
      userUninit,
      voyageUninit,
      vehicleUninit,
    ])
  );



  const prevHubConnected = React.useRef(isHubConnected);
  useEffect(() => {
    if (isHubConnected && prevHubConnected.current === false) {
      refetchUserData();
      refetchVoyageData();
      refetchVehicleData();
    }
    prevHubConnected.current = isHubConnected;
  }, [isHubConnected, refetchUserData, refetchVoyageData, refetchVehicleData]);

  useEffect(() => {
    if (isErrorUser || isErrorVehicles || isErrorVoyages) {
      setHasError(true);
    }
  }, [isErrorUser, isErrorVehicles, isErrorVoyages]);

  const onRefresh = () => {
    setRefreshing(true);
    setHasError(false);
    try {
      const refreshData = async () => {
        setIsLoading(true);
        await refetchUserData();
        await refetchVehicleData();
        await refetchVoyageData();
        setIsLoading(false);
      };
      refreshData();
    } catch (error) {
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
    if (userData.displayEmail) {
      let emailStr = userData.displayEmail;
      try {
        await Clipboard.setStringAsync(emailStr);
        showToast("Email copied to clipboard");
      } catch (error) {
        showToast("Failed to copy email to clipboard");
      }
    }
  };

  const handlePhonePress = async () => {
    if (userData.phoneNumber) {
      const phoneUrl = `tel:${userData.phoneNumber}`;

      Linking.openURL(phoneUrl).catch(() => { });
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
    if (!originalText) return null;
    const plainText = he.decode(originalText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    const words = plainText.split(" ");

    return (
      <ParrotsStdText selectable style={{ fontFamily: "Nunito_700Bold", fontSize: 15, color: "#3D3D3D", lineHeight: 23, letterSpacing: 0.2 }}>
        {words.map((word, index) =>
          word.startsWith("#") ? (
            <ParrotsStdText key={index} style={{ color: "blue" }}>
              {word + " "}
            </ParrotsStdText>
          ) : (
            <ParrotsStdText key={index}>{word + " "}</ParrotsStdText>
          )
        )}
      </ParrotsStdText>
    );
  };


  // useEffect(() => {
  //   console.log('userData:', userData);
  //   console.log('VoyagesData:', VoyagesData);
  //   console.log('VehiclesData:', VehiclesData);
  // }, [userData, VoyagesData, VehiclesData]);

  if (isLoadingUser || !userData) {
    return (
      <View style={{ flex: 1, backgroundColor: parrotCream }}>
        <View style={{ width: vw(100), height: vh(37), backgroundColor: "#d8d8d8" }} />
        <View style={{ left: vw(6), top: vh(3), backgroundColor: parrotCream, paddingBottom: vh(3), opacity: 0 }}>
          <View style={{ height: vh(20), width: vh(20), borderRadius: vh(15), backgroundColor: "#e0e0e0" }} />
        </View>
        <View style={{ paddingHorizontal: 14, paddingTop: vh(1), paddingBottom: vh(1) }}>
          <View style={{ width: vw(45), height: 22, borderRadius: 6, backgroundColor: "#e0e0e0" }} />
        </View>
        <View style={{ marginHorizontal: 14, height: vh(20), borderRadius: 12, backgroundColor: "#e0e0e0" }} />
        <LoadingLogo size={240}
          style={{
            position: "absolute", top: vh(32) + 10,
            left: vw(50) - 120
          }} />

        {/* three-dot menu placeholder in loading state */}
        <View style={[styles.menuBtn, { opacity: 0.15 }]}>
          <View style={styles.menuDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
      </View>
    );
  }

  if (hasError) {
    return (
      <ScrollView
        style={styles.mainBidsContainer2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[parrotPistachioGreen, parrotBananaLeafGreen]}
            tintColor={parrotBananaLeafGreen}
          />
        }
      >
        <View style={styles.currentBidsAndSeeAll2}>
          <Image
            source={require("../assets/parrotslogo.png")}
            style={styles.logoImage}
          />
          <ParrotsStdText style={styles.currentBidsTitle2}>Something went wrong</ParrotsStdText>
          <ParrotsStdText style={styles.currentBidsTitle2}>Swipe down to retry</ParrotsStdText>
        </View>
      </ScrollView>
    );
  }

  if (isSuccessUser || userData) {
    const profileImageUrl = `${userData.profileImageUrl}`;
    const backgroundImageUrl = `${userData.backgroundImageUrl}`;

    return (
      <>
        <TokenExpiryGuard />
        <View style={styles.mainContainer}>
          <ScrollView style={styles.scrollView} contentContainerStyle={Platform.OS === "ios" ? { paddingBottom: insets.bottom + (vh(100) - insets.top - insets.bottom) * 0.08 } : undefined}>
            <View style={styles.innerContainer}>
              <View style={styles.rectangularBox}>
                {!userData.backgroundImageUrl ? (
                  <Image
                    style={styles.imageContainer}
                    resizeMode="cover"
                    source={require("../assets/amazonforestx.jpg")}
                  />
                ) : (
                  <Image
                    style={styles.imageContainer}
                    resizeMode="cover"
                    source={{ uri: backgroundImageUrl }}
                  />
                )}
              </View>

              {/* Three-dot menu button */}
              <TouchableOpacity
                style={styles.menuBtn}
                onPress={() => setMenuOpen(v => !v)}
                activeOpacity={0.85}
              >
                <View style={styles.menuDots}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
              </TouchableOpacity>

              {menuOpen && (
                <View style={styles.menuDropdown}>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); navigation.navigate("EditProfile"); }} activeOpacity={0.8}>
                    <MaterialCommunityIcons name="account-edit-outline" size={16} color={parrotBlue} />
                    <ParrotsStdText style={styles.menuItemText}>Edit Profile</ParrotsStdText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); navigation.navigate("ProfileStack", { screen: "ProfileScreenPublic", params: { publicId: userData.publicId, userId: userId, userName: userData.id } }); }} activeOpacity={0.8}>
                    <MaterialIcons name="public" size={16} color={parrotBlue} />
                    <ParrotsStdText style={styles.menuItemText}>Public Profile</ParrotsStdText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); setTermsModalVisible(true); }} activeOpacity={0.8}>
                    <MaterialIcons name="web-asset" size={16} color={parrotBlue} />
                    <ParrotsStdText style={styles.menuItemText}>Terms of Use</ParrotsStdText>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => { setMenuOpen(false); handleLogout(); }} activeOpacity={0.8}>
                    <MaterialCommunityIcons name="logout" size={16} color={parrotBlue} />
                    <ParrotsStdText style={styles.menuItemText}>Logout</ParrotsStdText>
                  </TouchableOpacity>
                </View>
              )}

              <Modal
                animationType="fade"
                transparent={true}
                visible={termsModalVisible}
                onRequestClose={handleCloseTermsModal}
              >
                <View
                  style={{
                    marginTop: vh(8),
                    width: vw(96),
                    height: vh(96),
                    margin: "auto",
                    borderRadius: vh(1),
                    overflow: "hidden",
                  }}
                >
                  <TermsOfUseComponent />
                </View>
                <TouchableOpacity
                  style={styles.closeButtonAndText2}
                  onPress={handleCloseTermsModal}
                >
                  <View>
                    <ParrotsStdText style={styles.buttonClose2}>
                      <AntDesign name="close" size={24} color="white " />
                    </ParrotsStdText>
                  </View>
                </TouchableOpacity>
              </Modal>




              <View style={styles.parrotcrackerContainerLeft}>


                {/* ///// parrotcrackers BUTTON /////// */}


                <TouchableOpacity
                  style={styles.parrotCrackerBox}
                  onPress={async () => {
                    setCrackerModalVisible(true);
                    await handleGetParrotCrackerBalance();

                  }}
                  activeOpacity={0.5}
                >
                  <View>
                    <View style={styles.parrotCrackerContainer}>
                      <Image
                        source={require("../assets/parrotCracker.png")}
                        style={{
                          width: vw(12),
                          height: vw(12),
                          marginTop: -2,
                          marginLeft: -1,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </TouchableOpacity>

                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={crackerModalVisible}
                  onRequestClose={() => setCrackerModalVisible(false)}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      position: "relative"
                    }}
                  >
                    <View
                      style={{
                        width: vw(92),
                        paddingVertical: 32,
                        paddingHorizontal: 20,
                        backgroundColor: "white",
                        borderRadius: 12,
                        alignItems: "flex-start",
                        position: "relative"
                      }}
                    >
                      <ParrotsStdText style={{
                        fontSize: 22,
                        fontFamily: "Nunito_800ExtraBold", marginBottom: 16,
                        color: parrotTextDarkBlue, alignSelf: "center"
                      }}>
                        What ParrotCrackers Feed
                      </ParrotsStdText>

                      <View style={{ alignSelf: "stretch", paddingLeft: 0 }}>
                        <ParrotsStdText style={{ fontSize: 15, fontFamily: "Nunito_700Bold", marginBottom: 20, color: parrotTextDarkBlue }}>
                          ParrotCrackers keep your voyage visible to the community and
                          deliver instant travel insights for any location & surrounding area.

                        </ParrotsStdText>

                        <View style={{ alignSelf: "stretch", marginBottom: 12 }}>
                          <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 16, backgroundColor: "rgba(255, 240, 210, 0.5)", borderRadius: 12, padding: 10 }}>
                            <View style={{ width: 44, alignItems: "center", marginTop: 2 }}>
                              <FontAwesome5 name="map-marker-alt" size={22} color={parrotCaravanOrangeRed} />
                            </View>
                            <View style={{ width: "70%" }}>
                              <ParrotsStdText style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: parrotTextDarkBlue }}>
                                Feature Your Voyage</ParrotsStdText>
                              <ParrotsStdText style={{ fontSize: 14, fontFamily: "Nunito_700Bold", color: "gray" }}>
                                Put your journey on the public map for 1
                                <Image source={require("../assets/parrotCracker.png")} style={{ width: 14, height: 14 }} resizeMode="contain" />
                                / day</ParrotsStdText>
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                              </View>
                            </View>
                          </View>
                          <View style={{ flexDirection: "row", alignItems: "flex-start", backgroundColor: "rgba(255, 240, 210, 0.5)", borderRadius: 12, padding: 10 }}>
                            <View style={{ width: 44, alignItems: "center", marginTop: 2 }}>
                              <Image source={require("../assets/parrotwhiteoutlinebg.png")} style={{ width: 36, height: 36 }} resizeMode="contain" />
                            </View>
                            {/* <View style={{ flex: 1 }}>
                              <ParrotsStdText style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: parrotTextDarkBlue }}>
                              Ask Parrots</ParrotsStdText>
                              <ParrotsStdText style={{ fontSize: 14, fontFamily: "Nunito_700Bold", color: "gray" }}>
                              Get local and area advice</ParrotsStdText>
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <ParrotsStdText style={{ fontSize: 14, fontFamily: "Nunito_700Bold", color: "gray" }}>1 </ParrotsStdText>
                                <Image source={require("../assets/parrotCracker.png")} style={{ width: 16, height: 16 }} resizeMode="contain" />
                                <ParrotsStdText style={{ fontSize: 14, fontFamily: "Nunito_700Bold", color: "gray" }}> / query</ParrotsStdText>
                              </View>
                            </View> */}


                            <View style={{ width: "75%" }}>
                              <ParrotsStdText style={{ fontSize: 15, fontFamily: "Nunito_800ExtraBold", color: parrotTextDarkBlue }}>
                                Ask Parrots</ParrotsStdText>
                              <ParrotsStdText style={{ fontSize: 14, fontFamily: "Nunito_700Bold", color: "gray" }}>
                                Get local and area advice for your voyages for 1
                                <Image source={require("../assets/parrotCracker.png")} style={{ width: 14, height: 14 }} resizeMode="contain" />
                                / day</ParrotsStdText>
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                              </View>
                            </View>


                          </View>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, backgroundColor: "rgba(255, 240, 210, 0.5)", borderRadius: 12, paddingVertical: 6, paddingHorizontal: 8 }}>
                          <Image source={require("../assets/jar.png")} style={{ width: 52, height: 52, marginRight: 10 }} resizeMode="contain" />
                          <ParrotsStdText
                            style={{
                              fontSize: 15, fontFamily: "Nunito_800ExtraBold",
                              color: parrotTextDarkBlue, marginRight: 6
                            }}>
                            You have
                          </ParrotsStdText>
                          <ParrotsStdText style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", color: parrotCaravanOrangeRed, marginRight: 8 }}>
                            {parrotCrackerBalance?.toLocaleString() ?? "—"}
                          </ParrotsStdText>
                          <Image
                            source={require("../assets/parrotCracker.png")}
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain"
                          />
                        </View>

                        <ParrotsStdText style={{ fontSize: 14, fontFamily: "Nunito_700Bold", marginTop: 8, color: parrotTextDarkBlue }}>
                          Need more crackers? Top up anytime at{" "}
                          <ParrotsStdText style={{ fontSize: 14, fontFamily: "Nunito_700Bold", color: parrotLightBlue }}>parrotsvoyages.com</ParrotsStdText>.
                        </ParrotsStdText>
                      </View>

                      <TouchableOpacity
                        onPress={() => Linking.openURL("https://parrotsvoyages.com")}
                        style={{ backgroundColor: parrotCaravanOrangeRed, borderRadius: 20, paddingVertical: 7, paddingHorizontal: 16, marginTop: 20, alignSelf: "center" }}
                      >
                        <ParrotsStdText style={{ color: "white", fontSize: 13, fontFamily: "Nunito_800ExtraBold" }}>Get ParrotCrackers</ParrotsStdText>
                      </TouchableOpacity>











                      <TouchableOpacity
                        style={styles.closeButtonAndText3}
                        onPress={() => setCrackerModalVisible(false)}
                      >
                        <ParrotsStdText style={styles.buttonClose3}>
                          <AntDesign name="close" size={24} color="white" />
                        </ParrotsStdText>
                      </TouchableOpacity>


                    </View>


                  </View>


                </Modal>


                {/* ///// parrotcrackers BUTTON /////// */}
              </View>


              <View style={styles.profileImageAndSocial}>
                <View style={styles.profileImageAndName}>
                  <View style={styles.solidCircleProfile}>
                    <Image
                      style={styles.profileImage}
                      resizeMode="cover"
                      source={{ uri: profileImageUrl }}
                    />
                  </View>
                </View>

                <View style={{ marginRight: vw(12) }}>
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
                    setSocialModalVisible={setSocialModalVisible}
                  />
                </View>
              </View>

              {/* ------- BIO ------ */}
              <View style={styles.bioBox}>
                <View style={styles.nameContainer}>
                  <ParrotsStdText selectable style={styles.UserNameProfile}>
                    {userData.userName.length <= 30 ? (
                      userData.userName
                    ) : (
                      <>
                        <ParrotsStdText>{userData.userName.slice(0, 30)}</ParrotsStdText>
                        {userData.userName?.length > 30 ? (
                          <ParrotsStdText style={styles.clickableText}>...</ParrotsStdText>
                        ) : null}
                      </>
                    )}
                  </ParrotsStdText>
                </View>
                <View>
                  <ParrotsStdText selectable style={styles.TitleProfile} numberOfLines={1} ellipsizeMode="tail">
                    {userData.title}
                  </ParrotsStdText>
                </View>
                <View>
                  <BlueHashTagText originalText={
                    showFullBio || !userData.bio || userData.bio.length <= 200
                      ? userData.bio
                      : userData.bio.slice(0, 200) + "..."
                  } />
                  {userData.bio?.length > 200 && !showFullBio && (
                    <TouchableOpacity onPress={() => setShowFullBio(true)}>
                      <ParrotsStdText style={styles.ReadMoreLess}>
                        Read more <Feather name="chevron-down" size={16} color={parrotBlue} />
                      </ParrotsStdText>
                    </TouchableOpacity>
                  )}
                  {userData.bio?.length > 200 && showFullBio && (
                    <TouchableOpacity onPress={() => setShowFullBio(false)}>
                      <ParrotsStdText style={styles.ReadMoreLess}>
                        Read less <Feather name="chevron-up" size={16} color={parrotBlue} />
                      </ParrotsStdText>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              {/* ------- BIO ------ */}

              {isLoadingVehicles ? (
                <ActivityIndicator size="large" color={parrotBlue} style={{ marginTop: vh(3) }} />
              ) : isSuccessVehicles && VehiclesData?.[0] !== undefined ? (
                <>
                  <View style={styles.mainBidsContainer}>
                    <View style={styles.currentBidsAndSeeAll}>
                      <ParrotsStdText style={styles.currentBidsTitle}>Vehicles</ParrotsStdText>
                      {VehiclesData?.length > 1 && (
                        <ParrotsStdText style={styles.currentBidsTitleCount}>{VehiclesData.length}</ParrotsStdText>
                      )}
                    </View>
                  </View>
                  <View style={styles.vehicleListContainer}>
                    <VehicleList style={styles.voyageList} data={VehiclesData} />
                  </View>
                </>
              ) : null}

              {isLoadingVoyages ? (
                <ActivityIndicator size="large" color={parrotBlue} style={{ marginTop: vh(3) }} />
              ) : isSuccessVoyages && VoyagesData !== null ? (
                <>
                  <View style={styles.mainBidsContainer}>
                    <View style={styles.currentBidsAndSeeAll}>
                      <ParrotsStdText style={styles.currentBidsTitle}>Voyages</ParrotsStdText>
                      {VoyagesData?.length > 1 && (
                        <ParrotsStdText style={styles.currentBidsTitleCount}>{VoyagesData.length}</ParrotsStdText>
                      )}
                    </View>
                  </View>
                  <View style={styles.voyageListContainer}>
                    <VoyageListVertical
                      style={styles.voyageList}
                      data={VoyagesData?.filter(v => v.placeType === 0)}
                    />
                  </View>
                </>
              ) : null}
            </View>
          </ScrollView>

          <Modal
            animationType="fade"
            transparent={true}
            visible={socialModalVisible}
            onRequestClose={() => setSocialModalVisible(false)}
          >
            <Pressable
              style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center" }}
              onPress={() => setSocialModalVisible(false)}
            >
              <Pressable style={styles.socialRenderComponentModal} onPress={() => { }}>
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
                  setSocialModalVisible={setSocialModalVisible}
                />
              </Pressable>
            </Pressable>
          </Modal>
          {toastVisible && (
            <View style={styles.toast}>
              <ParrotsStdText style={styles.toastText}>{toastMessage}</ParrotsStdText>
            </View>
          )}
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
    color: parrotLightBlue,
    textAlign: "center",
  },

  socialRenderComponentModal: {
    backgroundColor: parrotCream,
    alignSelf: "center",
    justifyContent: "center",
    width: vw(65),
    borderRadius: vh(2),
    paddingVertical: vh(2),
    paddingHorizontal: vw(4),
  },

  currentBidsTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: parrotBlue,
    paddingLeft: vw(5),
  },
  currentBidsTitleCount: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: "#4A5A6A",
    marginLeft: 6,
  },
  UserNameProfile: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 22,
    color: parrotBlue,
  },
  TitleProfile: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: parrotBlue,
  },
  currentBidsAndSeeAll: {
    marginTop: vh(2),
    flexDirection: "row",
    alignItems: "baseline",
    paddingRight: vw(10),
  },
  mainBidsContainer: {
    borderRadius: vw(5),
  },
  rectangularBox: {
    height: vh(35),
  },
  imageContainer: {
    height: vh(40),
    width: vw(100),
  },
  scrollView: {
    height: vh(100),
    borderRadius: vh(0),
    backgroundColor: parrotCream,
  },
  ReadMoreLess: {
    fontFamily: "Nunito_700Bold",
    color: parrotBlue,
    paddingTop: vh(0.5),
    paddingBottom: vh(0.5),
    fontSize: 15,
  },
  bioBox: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginTop: vh(0),
    paddingVertical: 10,
    width: "93%",
    borderRadius: 20,
  },
  voyageListContainer: {
    width: vw(98),
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: vh(8),
  },
  vehicleListContainer: {
    width: vw(98),
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: vh(3),
  },
  nameContainer: {
    marginLeft: 0,
    paddingLeft: 0,
  },
  clickableText: {
    color: "blue",
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
    backgroundColor: parrotCream,
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
    left: vw(3),
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
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E8E3DC",
  },
  editProfileBox: {
    marginTop: vh(0.5),
    backgroundColor: "white",
    width: vw(30),
    flexDirection: "row",
    borderRadius: vh(2),
    padding: vw(1),
  },
  parrotCrackerBox: {
    backgroundColor: "rgba(255,255,255,0.92)",
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(12,30,48,1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
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
    marginTop: vh(0.5),

    backgroundColor: "white",
    width: vw(30),
    flexDirection: "row",
    borderRadius: vh(2),
    padding: vw(1),
    zIndex: 100,
  },
  menuBtn: {
    position: "absolute",
    top: 13,
    right: 13,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(12,30,48,1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    zIndex: 20,
  },
  menuDots: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#0A2540",
  },
  menuDropdown: {
    position: "absolute",
    top: 58,
    right: 13,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "rgba(12,30,48,1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 20,
    minWidth: 160,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E8DDD0",
  },
  menuItemText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: "#0A2540",
  },

  parrotcrackerContainerLeft: {
    position: "absolute",
    top: 13,
    right: 61,
    flexDirection: "column",
    zIndex: 20,
  },
  innerProfileContainer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: vh(2),
    paddingHorizontal: vw(2),
  },
  parrotCrackerContainer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: vh(2),
    paddingTop: 1
  },
  closeButtonAndText2: {
    flexDirection: "row",
    position: "absolute",
    // width: vh(11.45),
    borderRadius: vh(2.5),
    top: vh(7),
    alignSelf: "center",
    right: vw(2),
  },
  buttonClose2: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: parrotDarkBlue,
    // backgroundColor: parrotRed,
    // width: vw(30),
    borderRadius: vh(4),
    padding: vw(1),
  },

  closeButtonAndText3: {
    flexDirection: "row",
    position: "absolute",
    borderRadius: vh(5),
    alignSelf: "center",
    top: vh(-2),
    right: vw(-2),
    backgroundColor: "transparent",
    padding: 4
  },
  buttonClose3: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: parrotDarkBlue,
    // width: vw(30),
    borderRadius: vh(4),
    padding: vw(1),
  },
  toast: {
    position: "absolute",
    bottom: vh(10),
    alignSelf: "center",
    backgroundColor: "rgba(30, 111, 217, 0.9)",
    paddingHorizontal: vw(4),
    paddingVertical: vh(1),
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  toastText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },

});
