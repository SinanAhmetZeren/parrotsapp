/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState } from "react";
import { useCallback, useEffect, useRef } from "react";
import he from "he";
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
  Share
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { vw, vh } from "react-native-expo-viewport-units";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import VehicleList from "../components/VehicleList";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import { useGetUserByIdQuery, useGetUserByPublicIdQuery } from "../slices/UserSlice";
import { useGetVoyagesByUserByIdQuery, useLazyGetVoyagesByUserByIdQuery } from "../slices/VoyageSlice";
import { useGetVehiclesByUserByIdQuery, useLazyGetVehiclesByUserByIdQuery } from "../slices/VehicleSlice";
import { useRoute } from "@react-navigation/native";
import { SocialRenderComponent } from "../components/SocialRenderComponent";
import { SocialRenderComponentModal } from "../components/SocialRenderComponentModal";
import VoyageListVertical from "../components/VoyageListVertical";
import { API_URL } from "@env";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { parrotBananaLeafGreen, parrotBlue, parrotBlueSemiTransparent, parrotCream, parrotLightBlue, parrotPistachioGreen } from "../assets/color";
import { skipToken } from '@reduxjs/toolkit/query';

export default function ProfileScreenPublic({ navigation }) {
  const route = useRoute();
  const { userId } = route.params;
  const { publicId } = route.params;
  const { userName } = route.params;

  console.log("publicId: ", publicId);
  const [socialItemCount, setSocialItemCount] = useState(0);
  const [socialModalVisible, setSocialModalVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: userData,
    isLoading,
    isError: isErrorUser,
    error,
    isSuccess,
    refetch: refetchUser,
    // } = useGetUserByIdQuery(userId);
  } = useGetUserByPublicIdQuery(publicId);

  const receivedUserId = userData?.id ?? skipToken;

  const {
    data: VoyagesData,
    isSuccess: isSuccessVoyages,
    isError: isErrorVoyages,
    isLoading: isLoadingVoyages,
    refetch: refetchVoyages,
  } = useGetVoyagesByUserByIdQuery(receivedUserId);
  const {
    data: VehiclesData,
    isSuccess: isSuccessVehicles,
    isError: isErrorVehicles,
    isLoading: isLoadingVehicles,
    refetch: refetchVehicles,
  } = useGetVehiclesByUserByIdQuery(receivedUserId);


  const [selected, setSelected] = useState("voyages");

  const handleShareProfile = async () => {
    try {
      const result = await Share.share({
        message: `Check out this link:\nhttps://parrotsvoyages.com/profile-public/${userData.publicId}/${encodeURIComponent(userData.userName)}`,
        title: "Share Link",
      });
    } catch (error) {
      console.error("Error sharing:", error.message);
    }
  };

  useEffect(() => {
    if (isErrorUser || isErrorVehicles || isErrorVoyages) {
      setHasError(true);
    }
  }, [isErrorUser, isErrorVehicles, isErrorVoyages]);

  const handleInstagramPress = async () => {
    if (userData.instagram) {
      const instagramProfile = `https://www.instagram.com/${userData.instagram}`;
      Linking.openURL(instagramProfile);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await refetchUser();
          // await triggerVehicles();
          // await triggerVoyages();
          await refetchVehicles();
          await refetchVoyages();
        } catch (error) {
          console.error("Error refetching  data:", error);
        }
      };

      fetchData();

      return () => {
        // Cleanup function if needed
      };
    }, [refetchUser, refetchVehicles, refetchVoyages])
  );


  const onRefresh = () => {
    setRefreshing(true);
    setHasError(false);
    try {
      const refreshData = async () => {
        setIsLoading(true);
        await refetchUser();
        // await triggerVehicles();
        // await triggerVoyages();
        await refetchVehicles();
        await refetchVoyages();
        setIsLoading(false);
      };
      refreshData();
    } catch (error) {
      console.log(error);
      setHasError(true);
    }
    setRefreshing(false);
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

  const handleChangeSelection = (s) => {
    setSelected(s);
  };

  const BlueHashTagText = ({ originalText }) => {
    if (!originalText) return null;
    const plainText = he.decode(originalText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    const words = plainText.split(" ");

    return (
      <Text>
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


  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
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
            source={require("../assets/ParrotsWhiteBg.png")}
            style={styles.logoImage}
          />
          <Text style={styles.currentBidsTitle2}>Connection Error</Text>
          <Text style={styles.currentBidsTitle2}>Swipe down to retry</Text>
        </View>
      </ScrollView>
    );
  }

  if (isSuccess) {
    const profileImageUrl = `${userData.profileImageUrl}`;
    const backgroundImageUrl = `${userData.backgroundImageUrl}`;

    return (
      <>
        <TokenExpiryGuard />

        <View style={styles.mainContainer}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.innerContainer}>
              <View style={styles.rectangularBox}>
                {/* <Image
                  style={styles.imageContainer}
                  resizeMode="cover"
                  source={{ uri: backgroundImageUrl }}
                /> */}

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
                {/* ///// EDIT PROFILE BUTTON /////// */}
                <TouchableOpacity
                  style={styles.editProfileBox}
                  onPress={() => {
                    navigation.navigate("Messages", {
                      screen: "ConversationDetailScreen",
                      params: {
                        conversationUserId: userId,
                        profileImg: userData.profileImageUrl,
                        name: userData.userName,
                      },
                    });
                  }}
                  activeOpacity={0.8}
                >


                  <TouchableOpacity
                    onPress={() => handleShareProfile()}
                    style={styles.shareContainer1}
                  >
                    <MaterialIcons
                      name="ios-share"
                      size={24}
                      color={parrotBlue}
                      style={styles.shareContainer2}
                    />
                  </TouchableOpacity>

                  <View>
                    <View style={styles.innerProfileContainer}>
                      <Feather
                        name="send"
                        size={18}
                        color={parrotBlue}
                      />
                      <Text
                        style={{
                          lineHeight: 22,
                          marginLeft: vw(1),
                          fontSize: 11,
                        }}
                      >
                        Send Message
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

              {/* ------- BIO ------ */}
              <View style={styles.bioBox}>
                <View style={styles.nameContainer}>
                  <Text style={styles.UserNameProfile}>
                    {userData.userName.length <= 30 ? (
                      userData.userName
                    ) : (
                      <>
                        <Text>{userData.userName.slice(0, 30)}</Text>
                        {userData.userName.length > 30 ? (
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
  socialRenderComponentModal: {
    top: vh(20),
    backgroundColor: "white",
    alignSelf: "center",
    justifyContent: "center",
    width: vw(65),
    borderRadius: vh(2),
    paddingVertical: vh(2),
  },

  extendedAreaContainer: {
    alignSelf: "flex-end",
    position: "absolute",
    top: vh(0),
    right: vw(0),
    borderRadius: vh(4),
    zIndex: 100,
  },
  extendedArea: {
    paddingHorizontal: vw(1),
    paddingVertical: vh(1),
  },

  UserNameProfile: {
    fontSize: 22,
    fontWeight: "800",
    color: parrotLightBlue
  },
  TitleProfile: {
    fontSize: 16,
    fontWeight: "700",
    color: parrotLightBlue
  },
  currentBidsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: parrotLightBlue,
    paddingLeft: vw(5),
  },
  currentBidsAndSeeAll: {
    marginTop: vh(2),
    flexDirection: "row",
    paddingRight: vw(10),
  },
  mainBidsContainer: {
    borderRadius: vw(5),
  },
  buttonsContainer: {
    position: "absolute",
    top: vh(30),
    right: vw(2),
    flexDirection: "column",
  },
  rectangularBox: {
    height: vh(35),
    backgroundColor: "white",
  },
  imageContainer: {
    height: vh(40),
    width: vw(100),
  },
  scrollView: {
    height: vh(100),
    backgroundColor: parrotCream
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
  bio: {
    paddingTop: 5,
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
    backgroundColor: "white",
    top: vh(-0.5),
    width: vw(30),
    left: vw(-4),
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: vh(2),
    padding: vw(1),

  },
  innerProfileContainer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: vh(2),
    paddingHorizontal: vw(1),
  },
  shareContainer1: {
    position: "absolute",
    bottom: vh(0),
    right: vw(32),
  },
  shareContainer2: {
    padding: vw(1),
    width: vw(8),
    backgroundColor: "white",
    borderRadius: vh(5),
  },

});
