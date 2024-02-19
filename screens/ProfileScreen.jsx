/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import VehicleList from "../components/VehicleList";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectUserById, useGetUserByIdQuery } from "../slices/UserSlice";

export default function ProfileScreen({ navigation }) {
  //   const { message } = route.params;

  let userId = "1bf7d55e-7be2-49fb-99aa-93d947711e32";
  console.log("hi there");
  const {
    data: userData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetUserByIdQuery(userId);
  //const user = useSelector((state) => selectUserById(state, userId));
  console.log(userData);
  const [copiedText, setCopiedText] = React.useState("");
  exampleText = "Elizabeth Annabelle Kensington-Smith";

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleInstagramPress = () => {
    if (userData.instagram) {
      const instagramProfile = `https://www.instagram.com/${userData.instagram}`;
      Linking.openURL(instagramProfile);
    }
  };

  const handleFacebookPress = () => {
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

  const showNameToast = async () => {
    if (userData.userName) {
      let usernameStr = userData.userName;

      try {
        await Clipboard.setStringAsync(usernameStr);
        Toast.show({
          type: "success",
          text1: "Username is",
          text2: userData.userName,
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
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (isError) {
    console.log(error);
  }

  if (isSuccess) {
    const profileImageUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/${userData.profileImageUrl}`;

    return (
      <>
        <View style={styles.rectangularBox}>
          <Image
            style={styles.imageContainer}
            resizeMode="cover"
            source={require("../assets/amazon.jpeg")}
          />
        </View>

        <View style={styles.roundedCorner}></View>

        <View>
          <ScrollView style={styles.scrollView}>
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
                  <Text style={styles.iconText}>{userData.email}</Text>
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
                  <Text style={styles.iconText}>{userData.instagram}</Text>
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
                  <Text style={styles.iconText}>{userData.youtube}</Text>
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
                  <Text style={styles.iconText}>{userData.facebook}</Text>
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
                  <Text style={styles.iconText}>{userData.phoneNumber}</Text>
                </TouchableOpacity>
              </View>
              {/* ------- PROFILE AND SOCIAL ------ */}
            </View>

            {/* ------- BIO ------ */}
            <View style={styles.bioBox}>
              <View style={styles.nameContainer}>
                {/* <Text style={styles.name}>{userData.userName}</Text> */}

                <TouchableOpacity onPress={showNameToast}>
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
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.title}>{userData.title}</Text>
              </View>
              <View>
                <BlueHashTagText originalText={userData.bio}></BlueHashTagText>
              </View>
            </View>
            {/* ------- BIO ------ */}

            {/* ------- CHOICE ------ */}
            <View style={styles.viewChoice}>
              <View style={styles.choiceItem}>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.selectedChoice}
                >
                  <Text style={styles.selectedText}>Vehicles</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.choiceItem}>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.choiceItemText}>Voyages</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* ------- CHOICE ------ */}
            <View style={styles.vehicleListContainer}>
              <VehicleList style={styles.vehicleList} data={{}} />
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  rectangularBox: {
    height: vh(35),
    backgroundColor: "white",
  },
  imageContainer: {
    top: vh(0),
    height: vh(35),
    width: vw(100),
  },
  roundedCorner: {
    backgroundColor: "white",
    height: vh(3),
    top: vh(-5),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  scrollView: {
    backgroundColor: "white",
    marginBottom: vh(20),
    top: vh(-5),
    height: vh(65),
  },
  bioBox: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginTop: 0,
    paddingVertical: 10,
    backgroundColor: "rgba(190, 119, 234,0.08)",
    width: "93%",
    borderRadius: 20,

    borderWidth: 1,
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
    padding: 10,
    marginTop: 2,
    flexDirection: "row",
  },
  selectedChoice: {
    backgroundColor: "rgba(0, 0, 255, 0.05)",
    paddingHorizontal: 14,
    paddingVertical: 0,
    borderRadius: 10,
  },
  selectedText: {
    color: "#0077ea",
    fontSize: 18,
    fontWeight: "700",
  },
  vehicleListContainer: {
    width: vw(98),
    paddingTop: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
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
    textDecorationLine: "underline",
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
    left: vw(-5.5),
    borderWidth: 1,
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  socialBox2: {
    flexDirection: "row",
    backgroundColor: "rgba(190, 119, 234,0.1)",
    borderRadius: 20,
    marginTop: 2,
    left: vw(-1.7),
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
    // backgroundColor: "rgba(0, 119, 234,0.09)",
    borderRadius: vh(3),
    width: "95%",
    alignSelf: "center",
    paddingBottom: vh(0.95),
  },
  //container of social
  social: {
    flexDirection: "column",
    width: vw(50),
    zIndex: 100,
    paddingRight: 20,
    paddingTop: 0,
  },
  //container of image and name
  profileImageAndName: {
    left: vw(2),
  },
  profileImage: {
    position: "absolute",
    top: vh(0.4),
    left: vh(0.4),
    height: vh(18),
    width: vh(18),
    borderRadius: vh(14),
    zIndex: 100,
  },
  solidCircleProfile: {
    height: vh(18.8),
    width: vh(18.8),
    borderRadius: vh(25),
    backgroundColor: "rgba(190, 119, 234,0.6)",
  },
});
