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

  useFocusEffect(
    React.useCallback(() => {
      // Trigger a refetch when the screen gains focus (navigated to)
      refetch();
    }, [refetch])
  );
  const handleInstagramPress = () => {
    const instagramProfile = `https://www.instagram.com/${userData.instagram}`;
    //const instagramProfile = `https://www.instagram.com`;
    Linking.openURL(instagramProfile);
  };

  const handleFacebookPress = () => {
    const facebookPageID = "pageID";
    const facebookDeepLink = `fb://page/${facebookPageID}`;
    const fallbackUrl = `https://www.facebook.com/${facebookPageID}`;
    Linking.openURL(facebookDeepLink).catch(() => {
      Linking.openURL(fallbackUrl);
    });
  };

  const handleEmailPress = async () => {
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
  };

  const handlePhonePress = async () => {
    const phoneUrl = `tel:${userData.phoneNumber}`;

    Linking.openURL(phoneUrl).catch((err) =>
      console.error("Error opening phone app:", err)
    );
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
        <Image
          style={styles.profileImage}
          resizeMode="cover"
          //resizeMode="contain"
          source={{ uri: profileImageUrl }}
        />

        <View>
          <ScrollView style={styles.scrollView}>
            {/* ------- PROFILE AND SOCIAL ------ */}
            <View style={styles.profileAndSocial}>
              <TouchableOpacity onPress={() => handleEmailPress()}>
                <Fontisto
                  style={styles.icon}
                  name="email"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleInstagramPress()}>
                <Ionicons
                  style={styles.icon}
                  name="logo-instagram"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFacebookPress()}>
                <Feather
                  style={styles.icon}
                  name="facebook"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePhonePress()}>
                <Feather
                  style={styles.icon}
                  name="phone"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            {/* ------- PROFILE AND SOCIAL ------ */}

            {/* ------- BIO ------ */}
            <View style={styles.bioBox}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{userData.userName}</Text>
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
    top: vh(5),
    height: vh(30),
    width: vw(100),
  },
  roundedCorner: {
    backgroundColor: "white",
    height: vh(5),
    top: vh(-5),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  scrollView: {
    backgroundColor: "white",
    // borderRadius: 20,
    marginBottom: vh(20),
    top: vh(-25),
    height: vh(65),
    zIndex: 1, // Add zIndex property
  },
  profileAndSocial: {
    flexDirection: "row",
    //backgroundColor: "rgba(222, 119, 24,0.86)",
    height: vh(10),
    top: vh(-2),
    justifyContent: "flex-end",
    paddingRight: 20,
    paddingTop: 10,
  },
  profileImage: {
    height: vh(18),
    width: vh(18),
    borderRadius: vh(18),
    top: vh(-17),
    left: vw(5),
    zIndex: 100,
    borderWidth: 3,
    borderColor: "rgba(0, 119, 234,0.6)",
  },
  icon: {
    padding: 7,
    margin: 2,
    // backgroundColor: "rgba(0, 119, 234,0.06)",
    borderRadius: 20,
    color: "#909090",
  },
  bioBox: {
    paddingHorizontal: 20,
    // backgroundColor: "rgba(155, 44, 77,0.3)",
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
    // backgroundColor: "pink",
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
    backgroundColor: "white",
    paddingTop: 10,
    paddingLeft: vw(2),
    overflow: "hidden",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  vehicleList: {},
  blueText: {
    fontWeight: "600",
    color: "blue",
  },
  bioText: {
    fontWeight: "600",
    color: "#416181",
  },
  nameContainer: {
    marginLeft: 0,
    paddingLeft: 0,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0077ea",
  },
  bio: {
    fontSize: 14,
    paddingTop: 5,
  },
});
