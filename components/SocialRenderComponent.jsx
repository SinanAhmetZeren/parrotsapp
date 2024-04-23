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

  const renderAllItems = () => {
    if (contactDataArray.length === 5) {
      return contactDataArray.map((x, index) => {
        switch (x[1]) {
          case 0:
            return (
              <EmailItem
                key={index}
                email={userData.email}
                handleEmailPress={handleEmailPress}
              />
            );
          case 1:
            return (
              <InstagramItem
                key={index}
                instagram={userData.instagram}
                handleInstagramPress={handleInstagramPress}
              />
            );
          case 2:
            return (
              <YoutubeItem
                key={index}
                youtube={userData.youtube}
                handleYoutubePress={handleYoutubePress}
              />
            );
          case 3:
            return (
              <FacebookItem
                key={index}
                facebook={userData.facebook}
                handleFacebookPress={handleFacebookPress}
              />
            );
          case 4:
            return (
              <PhoneItem
                key={index}
                phoneNumber={userData.phoneNumber}
                handlePhonePress={handlePhonePress}
              />
            );
          default:
            return null;
        }
      });
    } else {
      return null; // Handle case where contactDataArray length is not 5
    }
  };
  return (
    <>
      <View style={styles.social}>{renderAllItems()}</View>
    </>
  );
};

const EmailItem = ({ email, handleEmailPress }) => {
  return (
    <TouchableOpacity
      style={styles.socialBox1}
      onPress={() => handleEmailPress()}
    >
      <Fontisto style={styles.icon} name="email" size={24} color="black" />
      <Text style={styles.iconText}>
        {email.length > 20 ? `${email.substring(0, 20)}...` : email}
      </Text>
    </TouchableOpacity>
  );
};

const InstagramItem = ({ instagram, handleInstagramPress }) => {
  return (
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
        {instagram.length > 20 ? `${instagram.substring(0, 20)}...` : instagram}
      </Text>
    </TouchableOpacity>
  );
};

const YoutubeItem = ({ youtube, handleYoutubePress }) => {
  return (
    <TouchableOpacity
      style={styles.socialBox}
      onPress={() => handleYoutubePress()}
    >
      <Feather style={styles.icon} name="youtube" size={24} color="black" />
      <Text style={styles.iconText}>
        {youtube.length > 20 ? `${youtube.substring(0, 20)}...` : youtube}
      </Text>
    </TouchableOpacity>
  );
};

const FacebookItem = ({ facebook, handleFacebookPress }) => {
  return (
    <TouchableOpacity
      style={styles.socialBox2}
      onPress={() => handleFacebookPress()}
    >
      <Feather style={styles.icon} name="facebook" size={24} color="black" />
      <Text style={styles.iconText}>
        {facebook.length > 20 ? `${facebook.substring(0, 20)}...` : facebook}
      </Text>
    </TouchableOpacity>
  );
};

const PhoneItem = ({ phoneNumber, handlePhonePress }) => {
  return (
    <TouchableOpacity
      style={styles.socialBox1}
      onPress={() => handlePhonePress()}
    >
      <Feather style={styles.icon} name="phone" size={24} color="black" />
      <Text style={styles.iconText}>
        {phoneNumber.length > 20
          ? `${phoneNumber.substring(0, 20)}...`
          : phoneNumber}
      </Text>
    </TouchableOpacity>
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

{
  /* 
        <EmailItem email={userData.email} handleEmailPress={handleEmailPress} />
        <InstagramItem
          instagram={userData.instagram}
          handleInstagramPress={handleInstagramPress}
        />
        <YoutubeItem
          youtube={userData.youtube}
          handleYoutubePress={handleYoutubePress}
        />
        <FacebookItem
          facebook={userData.facebook}
          handleFacebookPress={handleFacebookPress}
        />
        <PhoneItem
          phoneNumber={userData.phoneNumber}
          handlePhonePress={handlePhonePress}
        /> */
}
