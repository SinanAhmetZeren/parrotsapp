/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState } from "react";
import { useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Button,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { vw, vh } from "react-native-expo-viewport-units";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import VoyageList from "../components/VoyageList";
import VehicleList from "../components/VehicleList";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import { useGetUserByIdQuery } from "../slices/UserSlice";
import { useGetVoyagesByUserByIdQuery } from "../slices/VoyageSlice";
import { useGetVehiclesByUserByIdQuery } from "../slices/VehicleSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateAsLoggedOut } from "../slices/UserSlice";

export default function ProfileScreen({ navigation }) {
  const userId = useSelector((state) => state.users.userId);
  const dispatch = useDispatch();

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

  const handleLogout = async () => {
    dispatch(updateAsLoggedOut());
  };

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
        <Text style={{ fontSize: 50 }}>loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 50 }}>error...</Text>
      </View>
    );
  }

  if (isSuccess) {
    const profileImageUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/${userData.profileImageUrl}`;
    const backgroundImageUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/${userData.backgroundImageUrl}`;

    return (
      <>
        <View style={styles.mainContainer}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.innerContainer}>
              <View style={styles.rectangularBox}>
                <Image
                  style={styles.imageContainer}
                  resizeMode="cover"
                  source={{ uri: backgroundImageUrl }}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  console.log("logout");
                  handleLogout();
                }}
                activeOpacity={0.8}
              >
                <View style={styles.logoutBox}>
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
                      Logout
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  console.log("navigate to edit profile");
                  navigation.navigate("EditProfile");
                }}
                activeOpacity={0.8}
              >
                <View style={styles.editProfileBox}>
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
                {/* ------- PROFILE AND SOCIAL ------ */}
                <View style={styles.social}>
                  {/* -----------EMAIL------------- */}
                  <TouchableOpacity
                    style={styles.socialBox1}
                    onPress={() => handleEmailPress()}
                  >
                    <Fontisto
                      style={styles.icon}
                      name="email"
                      size={24}
                      color="black"
                    />
                    <Text style={styles.iconText}>
                      {userData.email.length > 20
                        ? `${userData.email.substring(0, 20)}...`
                        : userData.email}
                    </Text>
                  </TouchableOpacity>

                  {/* --------------INSTAGRAM---------- */}
                  <TouchableOpacity
                    style={styles.socialBox2}
                    onPress={() => handleInstagramPress()}
                  >
                    <Ionicons
                      style={styles.icon}
                      name="logo-instagram"
                      size={24}
                      color="black"
                    />
                    <Text style={styles.iconText}>
                      {userData.instagram.length > 20
                        ? `${userData.instagram.substring(0, 20)}...`
                        : userData.instagram}
                    </Text>
                  </TouchableOpacity>

                  {/* --------------YOUTUBE---------- */}

                  <TouchableOpacity
                    style={styles.socialBox}
                    onPress={() => handleYoutubePress()}
                  >
                    <Feather
                      style={styles.icon}
                      name="youtube"
                      size={24}
                      color="black"
                    />
                    <Text style={styles.iconText}>
                      {userData.youtube.length > 20
                        ? `${userData.youtube.substring(0, 20)}...`
                        : userData.youtube}
                    </Text>
                  </TouchableOpacity>
                  {/* --------------FACEBOOK---------- */}

                  <TouchableOpacity
                    style={styles.socialBox2}
                    onPress={() => handleFacebookPress()}
                  >
                    <Feather
                      style={styles.icon}
                      name="facebook"
                      size={24}
                      color="black"
                    />
                    <Text style={styles.iconText}>
                      {userData.facebook.length > 20
                        ? `${userData.facebook.substring(0, 20)}...`
                        : userData.facebook}
                    </Text>
                  </TouchableOpacity>
                  {/* --------------PHONE---------- */}
                  <TouchableOpacity
                    style={styles.socialBox1}
                    onPress={() => handlePhonePress()}
                  >
                    <Feather
                      style={styles.icon}
                      name="phone"
                      size={24}
                      color="black"
                    />
                    <Text style={styles.iconText}>
                      {userData.phoneNumber.length > 20
                        ? `${userData.phoneNumber.substring(0, 20)}...`
                        : userData.phoneNumber}
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* ------- PROFILE AND SOCIAL ------ */}
              </View>

              {/* ------- BIO ------ */}
              <View style={styles.bioBox}>
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>
                    {userData.userName.length <= 30 ? (
                      userData.userName
                    ) : (
                      <>
                        <Text>{userData.userName.slice(0, 30)}</Text>
                        <Text style={styles.clickableText}>...</Text>
                      </>
                    )}
                  </Text>
                </View>
                <View>
                  <Text style={styles.title}>
                    {userData.title.length <= 35 ? (
                      userData.title
                    ) : (
                      <>
                        <Text>{userData.title.slice(0, 3)}</Text>
                        <Text style={styles.clickableText}>...</Text>
                      </>
                    )}
                  </Text>
                </View>
                <View>
                  <BlueHashTagText
                    originalText={userData.bio}
                  ></BlueHashTagText>
                </View>
              </View>
              {/* ------- BIO ------ */}

              {/* ------- CHOICE ------ */}
              <View style={styles.viewChoice}>
                <View style={styles.choiceItem}>
                  <TouchableOpacity
                    onPress={() => {
                      handleChangeSelection("voyages");
                    }}
                    style={
                      selected === "voyages"
                        ? styles.selectedChoice
                        : styles.nonSelectedChoice
                    }
                  >
                    <Text
                      style={
                        selected === "voyages"
                          ? styles.selectedText
                          : styles.nonSelectedText
                      }
                    >
                      Voyages
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.choiceItem}>
                  <TouchableOpacity
                    onPress={() => {
                      handleChangeSelection("vehicles");
                    }}
                    style={
                      selected === "vehicles"
                        ? styles.selectedChoice
                        : styles.nonSelectedChoice
                    }
                  >
                    <Text
                      style={
                        selected === "vehicles"
                          ? styles.selectedText
                          : styles.nonSelectedText
                      }
                    >
                      Vehicles
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* ------- CHOICE ------ */}

              {selected === "voyages" &&
                (isLoadingVoyages ? (
                  <Text>Loading Voyages</Text>
                ) : isSuccessVoyages ? (
                  <View style={styles.voyageListContainer}>
                    <VoyageList style={styles.voyageList} data={VoyagesData} />
                  </View>
                ) : null)}

              {selected === "vehicles" &&
                (isLoadingVehicles ? (
                  <Text>Loading vehicles</Text>
                ) : isSuccessVehicles ? (
                  <View style={styles.voyageListContainer}>
                    <VehicleList
                      style={styles.voyageList}
                      data={VehiclesData}
                    />
                  </View>
                ) : null)}

              {/* <Button
                title="Handle Refetch"
                onPress={() => {
                  handleRefetch();
                }}
              /> */}
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {},
  innerContainer: {},

  rectangularBox: {
    height: vh(35),
    backgroundColor: "white",
  },
  imageContainer: {
    top: vh(5),
    height: vh(40),
    width: vw(100),
  },
  scrollView: {
    //marginBottom: vh(30),
    // top: vh(-5),
    height: vh(95),
    borderRadius: vh(4),
    backgroundColor: "white",
  },
  bioBox: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginTop: vh(3),
    paddingVertical: 10,
    backgroundColor: "rgba(190, 119, 234,0.08)",
    width: "93%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(190, 119, 234,0.5)",
    // top: vh(-9),
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
    padding: 10,
    marginVertical: vh(1),
    width: vw(100),
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    // top: vh(-9),
  },
  selectedChoice: {
    paddingHorizontal: vh(6),
    paddingVertical: vh(0.3),
    backgroundColor: "rgba(0, 119, 234,0.07)",
    borderRadius: vh(1.5),
    borderWidth: 1,
    borderColor: "rgba(10, 119, 234,0.4)",
  },
  nonSelectedChoice: {
    paddingHorizontal: vh(6),
    paddingVertical: vh(0.3),
    backgroundColor: "rgba(0, 119, 234,0.04)",
    borderRadius: vh(1.5),
    borderWidth: 1,
    borderColor: "rgba(10, 119, 234,0.08)",
  },
  selectedText: {
    color: "#5b5bff",
    fontSize: 18,
    fontWeight: "700",
  },
  nonSelectedText: {
    fontSize: 18,
    fontWeight: "700",
    // color: "#b0b0ff",
    color: "#5b5bff",
  },
  voyageListContainer: {
    width: vw(98),
    paddingTop: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    // top: vh(-12),
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
    borderWidth: 1,
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  socialBox1: {
    flexDirection: "row",
    backgroundColor: "rgba(190, 119, 234,0.1)",
    borderRadius: 20,
    marginTop: 2,
    left: vw(-10.5),
    borderWidth: 1,
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  socialBox2: {
    flexDirection: "row",
    backgroundColor: "rgba(190, 119, 234,0.1)",
    borderRadius: 20,
    marginTop: 2,
    left: vw(-6),
    borderWidth: 1,
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
    backgroundColor: "white",
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
  },
  //container of image and name
  profileImageAndName: {
    left: vw(4),
    top: vh(2),
  },
  profileImage: {
    position: "absolute",
    top: vh(0.4),
    left: vh(0.4),
    height: vh(18),
    width: vh(18),
    borderRadius: vh(9),
    zIndex: 100,
  },
  solidCircleProfile: {
    height: vh(18.8),
    width: vh(18.8),
    borderRadius: vh(10),
    backgroundColor: "rgba(190, 119, 234,0.6)",
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
    borderWidth: 1,
    borderColor: "rgba(190, 119, 234,0.5)",
  },
  logoutBox: {
    backgroundColor: "white",
    position: "absolute",
    top: vh(-5),
    width: vw(30),
    right: vw(4),
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: vh(2),
    padding: vw(1),
    borderWidth: 1,
    borderColor: "rgba(190, 119, 234,0.5)",
  },
  innerProfileContainer: {
    backgroundColor: "rgba(190, 119, 234,0.08)",
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: vh(2),
    borderColor: "rgba(190, 119, 234,0.5)",
    paddingHorizontal: vw(2),
  },
});
