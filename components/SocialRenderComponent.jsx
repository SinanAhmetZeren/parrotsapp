/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
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
    if (contactDataArray.length > 0 && contactDataArray.length <= 5) {
      return contactDataArray.map((x, index) => {
        const baseStyle =
          styles[`social_${contactDataArray.length}_${index}`] ||
          styles.social_default;

        switch (x[1]) {
          case 0:
            return (
              <EmailItem
                style={baseStyle}
                key={index}
                email={userData.email}
                handleEmailPress={handleEmailPress}
              />
            );
          case 1:
            return (
              <InstagramItem
                style={baseStyle}
                key={index}
                instagram={userData.instagram}
                handleInstagramPress={handleInstagramPress}
              />
            );
          case 2:
            return (
              <YoutubeItem
                style={baseStyle}
                key={index}
                youtube={userData.youtube}
                handleYoutubePress={handleYoutubePress}
              />
            );
          case 3:
            return (
              <FacebookItem
                style={baseStyle}
                key={index}
                facebook={userData.facebook}
                handleFacebookPress={handleFacebookPress}
              />
            );
          case 4:
            return (
              <PhoneItem
                style={baseStyle}
                key={index}
                phoneNumber={userData.phoneNumber}
                handlePhonePress={handlePhonePress}
              />
            );
          default:
            return null;
        }
      });
    }
  };

  return (
    <>
      <View
        style={[
          styles[`social_Main_${contactDataArray.length}`],
          { marginLeft: vh(8), marginTop: vh(0.8) },
        ]}
      >
        {renderAllItems()}
      </View>
    </>
  );
};

const EmailItem = ({ email, handleEmailPress, style }) => {
  return (
    <TouchableOpacity style={style} onPress={() => handleEmailPress()}>
      {/* <Fontisto style={styles.icon} name="email" size={24} color="black" /> */}

      <Image
        style={styles.iconLogo}
        source={require("../assets/email_logo.png")}
      />

      <Text style={styles.iconText}>
        {email.length > 20 ? `${email.substring(0, 20)}...` : email}
      </Text>
    </TouchableOpacity>
  );
};

const InstagramItem = ({ instagram, handleInstagramPress, style }) => {
  return (
    <TouchableOpacity style={style} onPress={() => handleInstagramPress()}>
      {/* <Ionicons
        style={styles.icon}
        name="logo-instagram"
        size={24}
        color="black"
      /> */}

      <Image
        style={styles.iconLogo}
        source={require("../assets/instagram_icon.png")}
      />
      <Text style={styles.iconText}>
        {instagram.length > 20 ? `${instagram.substring(0, 20)}...` : instagram}
      </Text>
    </TouchableOpacity>
  );
};

const YoutubeItem = ({ youtube, handleYoutubePress, style }) => {
  return (
    <TouchableOpacity style={style} onPress={() => handleYoutubePress()}>
      {/* <Feather style={styles.icon} name="youtube" size={24} color="black" /> */}
      <Image
        style={styles.iconLogo}
        source={require("../assets/youtube_icon.png")}
      />
      <Text style={styles.iconText}>
        {youtube.length > 20 ? `${youtube.substring(0, 20)}...` : youtube}
      </Text>
    </TouchableOpacity>
  );
};

const FacebookItem = ({ facebook, handleFacebookPress, style }) => {
  return (
    <TouchableOpacity style={style} onPress={() => handleFacebookPress()}>
      {/* <Feather style={styles.icon} name="facebook" size={24} color="black" /> */}
      <Image
        style={styles.iconLogo}
        source={require("../assets/facebook_logo.png")}
      />
      <Text style={styles.iconText}>
        {facebook.length > 20 ? `${facebook.substring(0, 20)}...` : facebook}
      </Text>
    </TouchableOpacity>
  );
};

const PhoneItem = ({ phoneNumber, handlePhonePress, style }) => {
  return (
    <TouchableOpacity style={style} onPress={() => handlePhonePress()}>
      {/* <Feather style={styles.icon} name="phone" size={24} color="black" /> */}

      <Image
        style={styles.iconLogo}
        source={require("../assets/phone_logo.jpeg")}
      />
      <Text style={styles.iconText}>
        {phoneNumber.length > 20
          ? `${phoneNumber.substring(0, 20)}...`
          : phoneNumber}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconLogo: {
    height: vh(4),
    width: vh(4),
    borderRadius: vh(2),
    marginRight: vh(1),
  },
  social_Main_5: {
    flexDirection: "column",
    width: vw(50),
    zIndex: 100,
    paddingRight: 20,
    paddingTop: 0,
    top: vh(1),
  },
  social_Main_4: {
    flexDirection: "column",
    width: vw(50),
    zIndex: 100,
    paddingRight: 20,
    paddingTop: vh(2),
    top: vh(1),
  },
  social_Main_3: {
    flexDirection: "column",
    width: vw(50),
    zIndex: 100,
    paddingRight: 20,
    paddingTop: vh(4),
    top: vh(1),
  },
  social_Main_2: {
    flexDirection: "column",
    width: vw(50),
    zIndex: 100,
    paddingRight: 20,
    paddingTop: vh(6),
    top: vh(1),
  },
  social_Main_1: {
    flexDirection: "column",
    width: vw(50),
    zIndex: 100,
    paddingRight: 20,
    paddingTop: vh(8),
    top: vh(1),
  },

  social_5_0: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    left: vw(-12),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  social_5_1: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    left: vw(-6),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  social_5_2: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    left: vw(-4),
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  social_5_3: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    left: vw(-6),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  social_5_4: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    left: vw(-12),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  //////
  social_4_0: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    left: vw(-8.5),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  social_4_1: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    borderRadius: 20,
    marginTop: vh(0.5),
    marginBottom: 2,
    left: vw(-4),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  social_4_2: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    left: vw(-4),
    borderRadius: 20,
    marginTop: vh(0.5),
    marginBottom: 2,
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  social_4_3: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    borderRadius: 20,
    marginTop: vh(0.5),
    marginBottom: 2,
    left: vw(-8.5),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  //////
  social_3_0: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    left: vw(-6),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  social_3_1: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    borderRadius: 20,
    marginTop: vh(0.8),
    marginBottom: 2,
    left: vw(-4),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  social_3_2: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    left: vw(-6),
    borderRadius: 20,
    marginTop: vh(0.8),
    marginBottom: 2,
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  //////
  social_2_0: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    left: vw(-4.5),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  social_2_1: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    borderRadius: 20,
    marginTop: vh(1),
    marginBottom: 2,
    left: vw(-4),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  //////
  social_1_0: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    borderRadius: 20,
    marginTop: vh(1),
    marginBottom: 2,
    left: vw(-4),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  ///////

  icon: {
    padding: 3,
    margin: 2,
    marginLeft: 8,
    borderRadius: 20,
    // color: "rgba(0, 119, 234,0.9)",
    color: "#3c9dde",

    fontSize: 18,
  },
  iconText: {
    lineHeight: 22,
    marginTop: vh(0.4),
    fontSize: 13,
    color: "#3c9dde",
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
});
