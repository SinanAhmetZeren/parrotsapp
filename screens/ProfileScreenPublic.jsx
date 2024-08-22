/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState } from "react";
import { useCallback } from "react";

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
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { vw, vh } from "react-native-expo-viewport-units";
import { Feather } from "@expo/vector-icons";
import VehicleList from "../components/VehicleList";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import { useGetUserByIdQuery } from "../slices/UserSlice";
import { useGetVoyagesByUserByIdQuery } from "../slices/VoyageSlice";
import { useGetVehiclesByUserByIdQuery } from "../slices/VehicleSlice";
import { useRoute } from "@react-navigation/native";
import { SocialRenderComponent } from "../components/SocialRenderComponent";
import { SocialRenderComponentModal } from "../components/SocialRenderComponentModal";
import VoyageListVertical from "../components/VoyageListVertical";
import { API_URL } from "@env";

export default function ProfileScreenPublic({ navigation }) {
  const route = useRoute();
  const { userId } = route.params;
  const [socialItemCount, setSocialItemCount] = useState(0);
  const [socialModalVisible, setSocialModalVisible] = useState(false);

  const {
    data: userData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetUserByIdQuery(userId);
  const {
    data: VoyagesData,
    isSuccess: isSuccessVoyages,
    isLoading: isLoadingVoyages,
  } = useGetVoyagesByUserByIdQuery(userId);
  const {
    data: VehiclesData,
    isSuccess: isSuccessVehicles,
    isLoading: isLoadingVehicles,
  } = useGetVehiclesByUserByIdQuery(userId);
  const [selected, setSelected] = useState("voyages");

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
          await refetch();
        } catch (error) {
          console.error("Error refetching messages data:", error);
        }
      };

      fetchData();

      return () => {
        // Cleanup function if needed
      };
    }, [refetch])
  );

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
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (isError) {
    console.log(error);
  }

  if (isSuccess) {
    const profileImageUrl = `${API_URL}/Uploads/UserImages/${userData.profileImageUrl}`;
    const backgroundImageUrl = `${API_URL}/Uploads/UserImages/${userData.backgroundImageUrl}`;

    return (
      <>
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
                  /*
                  onPress={() => {
                    navigation.navigate("ConversationDetailScreen", {
                      conversationUserId: userId,
                      profileImg: userData.profileImageUrl,
                      name: userData.userName,
                    });
                  }}
*/
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
                  <View>
                    <View style={styles.innerProfileContainer}>
                      <Feather
                        name="send"
                        size={18}
                        color="rgba(0, 119, 234,0.9)"
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
                />
              </View>

              {/* ------- BIO ------ */}
              <View style={styles.bioBox}>
                {(socialItemCount > 5 && userData.emailVisible == true) ||
                (socialItemCount > 6 && userData.emailVisible == false) ? (
                  <TouchableOpacity
                    onPress={() => {
                      console.log("hello");
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
  currentBidsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3c9dde",
    paddingLeft: vw(5),
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
    height: vh(90),
    borderRadius: vh(4),
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
    // top: vh(-12),
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
  },
  //container of social
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
    backgroundColor: "white",
    top: vh(-0.5),
    width: vw(30),
    left: vw(-4),
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: vh(2),
    padding: vw(1),
    // borderWidth: 1,
    borderColor: "rgba(190, 119, 234,0.5)",
  },
  innerProfileContainer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: vh(2),
    borderColor: "rgba(190, 119, 234,0.5)",
    paddingHorizontal: vw(1),
  },
});
