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
import { Ionicons, Feather, MaterialIcons, Fontisto, AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import VoyageListVertical from "../components/VoyageListVertical";
import VehicleList from "../components/VehicleList";
import { useGetUserByIdQuery, useLazyGetParrotCoinBalanceQuery } from "../slices/UserSlice";
import { useGetVoyagesByUserByIdQuery } from "../slices/VoyageSlice";
import { useGetVehiclesByUserByIdQuery } from "../slices/VehicleSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateAsLoggedOut } from "../slices/UserSlice";
import { SocialRenderComponent } from "../components/SocialRenderComponent";
import { SocialRenderComponentModal } from "../components/SocialRenderComponentModal";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL } from "@env";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import he from "he";
import { parrotBananaLeafGreen, parrotBlue, parrotBlueSemiTransparent, parrotCream, parrotDarkBlue, parrotLightBlue, parrotPistachioGreen, parrotRed, parrotTextDarkBlue } from "../assets/color";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
import TermsOfUseComponent from "../components/TermsOfUseComponent";

export default function ProfileScreen({ navigation }) {
  const userId = useSelector((state) => state.users.userId);
  const dispatch = useDispatch();
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
  const [retryCountUser, setRetryCountUser] = useState(0);
  const [retryCountVoyages, setRetryCountVoyages] = useState(0);
  const [retryCountVehicles, setRetryCountVehicles] = useState(0);
  const [shouldFetchUser, setShouldFetchUser] = useState(false);
  const [shouldFetchVoyages, setShouldFetchVoyages] = useState(false);
  const [shouldFetchVehicles, setShouldFetchVehicles] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coinModalVisible, setCoinModalVisible] = useState(false);
  const [parrotCoinBalance, setParrotCoinBalance] = useState(null);
  const [getParrotCoinBalance] = useLazyGetParrotCoinBalanceQuery();

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


  const handleGetParrotCoinBalance = async () => {
    try {

      const response = await getParrotCoinBalance(userId).unwrap();
      setParrotCoinBalance(response.balance); // or response.balance depending on API
    } catch (error) {
      console.error("Error fetching ParrotCoin balance:", error);
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
          if (!isActive) return;

          if (!userUninit) await refetchUserData();
          if (!voyageUninit) await refetchVoyageData();
          if (!vehicleUninit) await refetchVehicleData();
        } catch (error) {
          console.error("Error refetching profile data:", error);
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
      <Text style={{ fontFamily: "Nunito_700Bold", fontSize: 15, color: "#3D3D3D", lineHeight: 23, letterSpacing: 0.2 }}>
        {words.map((word, index) =>
          word.startsWith("#") ? (
            <Text key={index} style={{ color: "blue" }}>
              {word + " "}
            </Text>
          ) : (
            <Text key={index}>{word + " "}</Text>
          )
        )}
      </Text>
    );
  };


  // useEffect(() => {
  //   console.log('userData:', userData);
  //   console.log('VoyagesData:', VoyagesData);
  //   console.log('VehiclesData:', VehiclesData);
  // }, [userData, VoyagesData, VehiclesData]);

  if (!userData) {
    return <ActivityIndicator size="large" style={{ top: vh(30) }} />;
  }

  if (isLoadingUser || isLoadingVehicles || isLoadingVoyages || isLoading) {
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
          <Text style={styles.currentBidsTitle2}>Something went wrong</Text>
          <Text style={styles.currentBidsTitle2}>Swipe down to retry</Text>
        </View>
      </ScrollView>
    );
  }

  if (isSuccessUser && isSuccessVehicles && isSuccessVoyages) {
    const profileImageUrl = `${userData.profileImageUrl}`;
    const backgroundImageUrl = `${userData.backgroundImageUrl}`;

    return (
      <>
        <TokenExpiryGuard />
        <View style={styles.mainContainer}>
          <ScrollView style={styles.scrollView}>
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

              {/* ///// terms of use /////// */}
              <View style={styles.buttonsContainerTermsOfUse}>

                {/* ///// terms of use BUTTON /////// */}
                <TouchableOpacity
                  style={styles.publicProfileBox}
                  onPress={() => {
                    setTermsModalVisible(true);
                  }}
                  activeOpacity={0.8}
                >
                  <View>
                    <View style={styles.innerProfileContainer}>
                      <MaterialIcons
                        name="web-asset"
                        size={18}
                        color={parrotBlue}
                      />
                      <Text
                        style={{
                          fontFamily: "Nunito_700Bold",
                          lineHeight: 22,
                          marginLeft: vw(2),
                          fontSize: 11,
                        }}
                      >
                        Terms of Use
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {/* ///// terms of use BUTTON /////// */}
              </View>
              <Modal
                animationType="fade"
                transparent={true}
                visible={termsModalVisible}
                onRequestClose={handleCloseTermsModal}
              >
                <View
                  style={{
                    flex: 1,
                    marginTop: vh(10),
                    width: vw(90),
                    height: vh(80),
                    margin: "auto"
                  }}
                >
                  <TermsOfUseComponent />
                </View>
                <TouchableOpacity
                  style={styles.closeButtonAndText2}
                  onPress={handleCloseTermsModal}
                >
                  <View>
                    <Text style={styles.buttonClose2}>
                      <AntDesign name="close" size={24} color="white " />
                    </Text>
                  </View>
                </TouchableOpacity>
              </Modal>
              {/* ///// terms of use /////// */}


              <View style={styles.buttonsContainerRight}>
                {/* ///// PUBLIC PROFILE BUTTON /////// */}
                <TouchableOpacity
                  style={styles.publicProfileBox}
                  onPress={() => {
                    navigation.navigate("ProfileStack", {
                      screen: "ProfileScreenPublic",
                      // params: { userId: userId },
                      params: { publicId: userData.publicId, userId: userId, userName: userData.id },
                    });

                  }}
                  activeOpacity={0.8}
                >
                  <View>
                    <View style={styles.innerProfileContainer}>
                      <MaterialIcons
                        name="public"
                        size={18}
                        color={parrotBlue}
                      />
                      <Text
                        style={{
                          fontFamily: "Nunito_700Bold",
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
                        color={parrotBlue}
                      />
                      <Text
                        style={{
                          fontFamily: "Nunito_700Bold",
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
                        color={parrotBlue}
                      />
                      <Text
                        style={{
                          fontFamily: "Nunito_700Bold",
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




              <View style={styles.parrotcoinContainerLeft}>


                {/* ///// parrotcoin BUTTON /////// */}


                <TouchableOpacity
                  style={styles.parrotCoinBox}
                  onPress={async () => {
                    setCoinModalVisible(true);
                    await handleGetParrotCoinBalance();

                  }}
                  activeOpacity={0.5}
                >
                  <View>
                    <View style={styles.parrotCoinContainer}>
                      <Image
                        source={require("../assets/parrotcoin.png")}
                        style={{
                          width: vw(12),
                          height: vw(12),
                        }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </TouchableOpacity>

                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={coinModalVisible}
                  onRequestClose={() => setCoinModalVisible(false)}
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
                        width: vw(80),
                        padding: 20,
                        backgroundColor: "white",
                        borderRadius: 12,
                        alignItems: "center",
                        position: "relative"
                      }}
                    >
                      <Text style={{ fontSize: 18, fontFamily: "Nunito_800ExtraBold", marginBottom: 10, color: parrotTextDarkBlue }}>
                        ParrotCoin Balance
                      </Text>

                      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 10 }}>

                        <Text style={{ fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: parrotTextDarkBlue }}>
                          {parrotCoinBalance?.toLocaleString()}
                        </Text>

                        <Image
                          source={require("../assets/parrotcoin.png")}
                          style={{ width: 30, height: 30 }}
                          resizeMode="contain"
                        />
                      </View>


                      <Text style={{ fontSize: 15, fontFamily: "Nunito_700Bold", marginBottom: 10, color: parrotTextDarkBlue }}>
                        Featuring your voyage on the main map costs ParrotCoins.
                      </Text>
                      <Text style={{ fontSize: 15, fontFamily: "Nunito_700Bold", marginBottom: 10, color: parrotTextDarkBlue }}>
                        The cost equals the number of days between today and the voyage start date.
                      </Text>
                      <Text style={{ fontSize: 15, fontFamily: "Nunito_700Bold", marginBottom: 10, color: parrotTextDarkBlue }}>
                        Example: Starts in 10 days → 10 ParrotCoins.
                      </Text>
                      <Text style={{ fontSize: 15, fontFamily: "Nunito_700Bold", marginBottom: 10, color: parrotTextDarkBlue }}>
                        The voyage will be removed from the main map once it starts.
                      </Text>
                      <Text style={{ fontSize: 15, fontFamily: "Nunito_700Bold", marginBottom: 10, color: parrotTextDarkBlue }}>
                        You can add ParrotCoins to your balance at parrotsvoyages.com.
                      </Text>











                      <TouchableOpacity
                        style={styles.closeButtonAndText3}
                        onPress={() => setCoinModalVisible(false)}
                      >
                        <Text style={styles.buttonClose3}>
                          <AntDesign name="close" size={24} color="white" />
                        </Text>
                      </TouchableOpacity>


                    </View>


                  </View>


                </Modal>


                {/* ///// parrotcoin BUTTON /////// */}
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

                <View style={{}}>
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
                  <BlueHashTagText originalText={
                    showFullBio || !userData.bio || userData.bio.length <= 200
                      ? userData.bio
                      : userData.bio.slice(0, 200) + "..."
                  } />
                  {userData.bio?.length > 200 && !showFullBio && (
                    <TouchableOpacity onPress={() => setShowFullBio(true)}>
                      <Text style={styles.ReadMoreLess}>
                        Read more <Feather name="chevron-down" size={16} color={parrotBlue} />
                      </Text>
                    </TouchableOpacity>
                  )}
                  {userData.bio?.length > 200 && showFullBio && (
                    <TouchableOpacity onPress={() => setShowFullBio(false)}>
                      <Text style={styles.ReadMoreLess}>
                        Read less <Feather name="chevron-up" size={16} color={parrotBlue} />
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              {/* ------- BIO ------ */}

              {isLoadingVoyages ? (
                <ActivityIndicator size="large" />
              ) : isSuccessVoyages ? (
                <>
                  {VehiclesData?.[0] !== undefined ? (
                    <>
                      <View style={styles.mainBidsContainer}>
                        <View style={styles.currentBidsAndSeeAll}>
                          <Text style={styles.currentBidsTitle}>Vehicles</Text>
                        </View>
                      </View>
                      <View style={styles.vehicleListContainer}>
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
                          data={VoyagesData?.filter(v => !v.isPlace)}
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
                    setSocialModalVisible={setSocialModalVisible}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
          {toastVisible && (
            <View style={styles.toast}>
              <Text style={styles.toastText}>{toastMessage}</Text>
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
    top: vh(20),
    backgroundColor: "white",
    alignSelf: "center",
    justifyContent: "center",
    width: vw(65),
    borderRadius: vh(2),
    paddingVertical: vh(2),
  },

  currentBidsTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: parrotBlue,
    paddingLeft: vw(5),
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
    backgroundColor: parrotBlueSemiTransparent
  },
  editProfileBox: {
    marginTop: vh(0.5),
    backgroundColor: "white",
    width: vw(30),
    flexDirection: "row",
    borderRadius: vh(2),
    padding: vw(1),
  },
  parrotCoinBox: {
    backgroundColor: "white",
    // width: vw(30),
    flexDirection: "row",
    borderRadius: vw(10),
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
  buttonsContainerTermsOfUse: {
    position: "absolute",
    top: vh(.5),
    right: vw(2),
    flexDirection: "column",
    backgroundColor: ""
  },
  buttonsContainerRight: {
    position: "absolute",
    top: vh(21),
    right: vw(2),
    flexDirection: "column",
    backgroundColor: ""
  },

  parrotcoinContainerLeft: {
    position: "absolute",
    top: vh(28),
    left: vw(2),
    flexDirection: "column",
  },
  innerProfileContainer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: vh(2),
    paddingHorizontal: vw(2),
  },
  parrotCoinContainer: {
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
    top: vh(8),
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
    backgroundColor: "white",
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
