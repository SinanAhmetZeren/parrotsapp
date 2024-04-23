/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

export const SocialRenderComponent = ({
  userData,
  handleEmailPress,
  handleInstagramPress,
  handleYoutubePress,
  handleFacebookPress,
  handlePhonePress,
}) => {
  let contactDataArray = [];
  if (userData.email !== null) {
    contactDataArray.push([userData.email, 0]);
  }
  if (userData.instagram !== null) {
    contactDataArray.push([userData.instagram, 1]);
  }
  if (userData.youtube !== null) {
    contactDataArray.push([userData.youtube, 2]);
  }
  if (userData.facebook !== null) {
    contactDataArray.push([userData.facebook, 3]);
  }
  if (userData.phoneNumber !== null) {
    contactDataArray.push([userData.phoneNumber, 4]);
  }

  console.log("---");
  console.log("contactDataArray : ", contactDataArray);
  console.log("contactDataArray length : ", contactDataArray.length);

  return (
    <>
      <View style={styles.social}>
        <TouchableOpacity
          style={styles.socialBox1}
          onPress={() => handleEmailPress()}
        >
          <Fontisto style={styles.icon} name="email" size={24} color="black" />
          <Text style={styles.iconText}>
            {userData.email.length > 20
              ? `${userData.email.substring(0, 20)}...`
              : userData.email}
          </Text>
        </TouchableOpacity>

        {/* -------------INSTAGRAM---------- */}
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

        {/* --------------YOUTUBE----------- */}

        <TouchableOpacity
          style={styles.socialBox}
          onPress={() => handleYoutubePress()}
        >
          <Feather style={styles.icon} name="youtube" size={24} color="black" />
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

        {/* --------------PHONE------------- */}
        <TouchableOpacity
          style={styles.socialBox1}
          onPress={() => handlePhonePress()}
        >
          <Feather style={styles.icon} name="phone" size={24} color="black" />
          <Text style={styles.iconText}>
            {userData.phoneNumber.length > 20
              ? `${userData.phoneNumber.substring(0, 20)}...`
              : userData.phoneNumber}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
  },
  social: {
    flexDirection: "column",
    width: vw(50),
    zIndex: 100,
    paddingRight: 20,
    paddingTop: 0,
    top: vh(1),
    backgroundColor: "pink",
  },
});
