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
import LoadingLogo from "../components/LoadingLogo";
import { vw, vh } from "react-native-expo-viewport-units";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import VehicleList from "../components/VehicleList";
import { useFocusEffect } from "@react-navigation/native";
import { useGetUserByIdQuery, useGetUserByPublicIdQuery, useAddBookmarkMutation, useRemoveBookmarkMutation } from "../slices/UserSlice";
import { addBookmarkedUserId, removeBookmarkedUserId } from "../slices/UserSlice";
import { useGetVoyagesByUserByIdQuery, useLazyGetVoyagesByUserByIdQuery } from "../slices/VoyageSlice";
import { useGetVehiclesByUserByIdQuery, useLazyGetVehiclesByUserByIdQuery } from "../slices/VehicleSlice";
import { useRoute } from "@react-navigation/native";
import { SocialRenderComponent } from "../components/SocialRenderComponent";
import { SocialRenderComponentModal } from "../components/SocialRenderComponentModal";
import VoyageListVertical from "../components/VoyageListVertical";
import { API_URL } from "@env";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { parrotBananaLeafGreen, parrotBlue, parrotBlueSemiTransparent, parrotCream, parrotLightBlue, parrotPistachioGreen, parrotRed } from "../assets/color";
import { skipToken } from '@reduxjs/toolkit/query';
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreenPublic({ navigation }) {
  const route = useRoute();
  const { userId } = route.params;
  const { publicId } = route.params;
  const { userName } = route.params;
  const dispatch = useDispatch();
  const bookmarkedUserIds = useSelector((state) => state.users.bookmarkedUserIds);
  const [addBookmark] = useAddBookmarkMutation();
  const [removeBookmark] = useRemoveBookmarkMutation();
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

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
    isUninitialized: userUninit,
  } = useGetUserByPublicIdQuery(publicId);

  const receivedUserId = userData?.id ?? skipToken;

  const {
    data: VoyagesData,
    isSuccess: isSuccessVoyages,
    isError: isErrorVoyages,
    isLoading: isLoadingVoyages,
    refetch: refetchVoyages,
    isUninitialized: voyageUninit,
  } = useGetVoyagesByUserByIdQuery(receivedUserId);

  const {
    data: VehiclesData,
    isSuccess: isSuccessVehicles,
    isError: isErrorVehicles,
    isLoading: isLoadingVehicles,
    refetch: refetchVehicles,
    isUninitialized: vehicleUninit,
  } = useGetVehiclesByUserByIdQuery(receivedUserId);


  const [showFullBio, setShowFullBio] = useState(false);
  const [selected, setSelected] = useState("voyages");

  const internalUserId = userData?.id ?? null;
  const isBookmarked = internalUserId ? bookmarkedUserIds.includes(internalUserId) : false;

  const handleToggleBookmark = async () => {
    if (!internalUserId || bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(internalUserId).unwrap();
        dispatch(removeBookmarkedUserId(internalUserId));
      } else {
        await addBookmark(internalUserId).unwrap();
        dispatch(addBookmarkedUserId(internalUserId));
      }
    } catch {
      showToast("Bookmark action failed");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleShareProfile = async () => {
    try {
      const result = await Share.share({
        message: `Check out this link:\nhttps://parrotsvoyages.com/profile-public/${userData.publicId}/${encodeURIComponent(userData.userName)}`,
        title: "Share Link",
      });
    } catch (error) {
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

  /*
  useFocusEffect(
    useCallback(() => {
      if (!userData?.id) return;

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
*/

  /*
    useFocusEffect(
      useCallback(() => {
        let isActive = true;
  
        const fetchData = async () => {
          if (!isActive) return;
  
          if (!userUninit) {
            try {
              await refetchUser();
            } catch (err) {
              console.error("❌ refetchUser failed", err);
            }
          }
  
          if (!voyageUninit) {
            try {
              await refetchVoyages();
            } catch (err) {
              console.error("❌ refetchVoyages failed", err);
            }
          }
  
          if (!vehicleUninit) {
            try {
              await refetchVehicles();
            } catch (err) {
              console.error("❌ refetchVehicles failed", err);
            }
          }
        };
  
        fetchData();
  
        return () => {
          isActive = false;
        };
      }, [
        refetchUser,
        refetchVoyages,
        refetchVehicles,
        userUninit,
        voyageUninit,
        vehicleUninit,
      ])
    );
  */

  const onRefresh = () => {
    setRefreshing(true);
    setHasError(false);
    try {
      const refreshData = async () => {
        await refetchUser();
        // await triggerVehicles();
        // await triggerVoyages();
        await refetchVehicles();
        await refetchVoyages();
      };
      refreshData();
    } catch (error) {
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

  const handleChangeSelection = (s) => {
    setSelected(s);
  };

  const BlueHashTagText = ({ originalText }) => {
    if (!originalText) return null;
    const plainText = he.decode(originalText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    const words = plainText.split(" ");

    return (
      <Text selectable style={{ fontFamily: "Nunito_700Bold", fontSize: 15, color: "#3D3D3D", lineHeight: 23, letterSpacing: 0.2 }}>
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

  if (isLoading) {
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
            position: "absolute",
            top: vh(32) + 10,
            left: vw(50) - 120
          }} />
        <View style={{ position: "absolute", top: vh(31), right: vw(2) }}>
          <TouchableOpacity style={{
            marginTop: vh(0.5), backgroundColor: "white", flexDirection: "row",
            borderRadius: vh(2), padding: vw(1), opacity: 0.4
          }} activeOpacity={0.8}>
            <View style={{ alignSelf: "flex-end", flexDirection: "row", borderRadius: vh(2), paddingHorizontal: vw(2) }}>
              <Feather name="message-circle" size={18} color={"white"} />
              <Text style={{ fontFamily: "Nunito_700Bold", lineHeight: 22, marginLeft: vw(2), fontSize: 11, color: "white" }}>Send Message</Text>
            </View>
          </TouchableOpacity>
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
          <Text style={styles.currentBidsTitle2}>Something went wrong</Text>
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

                  <TouchableOpacity
                    onPress={handleToggleBookmark}
                    disabled={bookmarkLoading}
                    style={styles.bookmarkContainer1}
                  >
                    {bookmarkLoading ? (
                      <ActivityIndicator size="small" color={parrotRed} style={styles.shareContainer2} />
                    ) : (
                      <Ionicons
                        name={isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={24}
                        color={parrotRed}
                        style={styles.shareContainer2}
                      />
                    )}
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
                          fontFamily: "Nunito_700Bold",
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
                  <Text selectable style={styles.UserNameProfile}>
                    {userData?.userName?.length <= 30 ? (
                      userData.userName
                    ) : (
                      <>
                        <Text>{userData?.userName?.slice(0, 30)}</Text>
                        {userData?.userName?.length > 30 ? (
                          <Text style={styles.clickableText}>...</Text>
                        ) : null}
                      </>
                    )}
                  </Text>
                </View>
                <View>
                  <Text selectable style={styles.TitleProfile} numberOfLines={1} ellipsizeMode="tail">
                    {userData.title}
                  </Text>
                </View>
                <View>
                  <BlueHashTagText originalText={
                    showFullBio || !userData.bio || userData?.bio?.length <= 200
                      ? userData.bio
                      : userData?.bio?.slice(0, 200) + "..."
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
  currentBidsTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: parrotBlue,
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
  bookmarkContainer1: {
    position: "absolute",
    bottom: vh(0),
    right: vw(42),
  },
  shareContainer2: {
    padding: vw(1),
    width: vw(8),
    backgroundColor: "white",
    borderRadius: vh(5),
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
