/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { useEffect } from "react";

export const SocialRenderComponentModal = ({
  userData,
  handleEmailPress,
  handleInstagramPress,
  handleYoutubePress,
  handleFacebookPress,
  handlePhonePress,
  handleLinkedinPress,
  handleTwitterPress,
  handleTiktokPress,
  setSocialItemCount,
}) => {
  useEffect(() => {
    setSocialItemCount(contactDataArray.length);
  }, [setSocialItemCount]);
  let contactDataArray = [];
  if (userData.email !== null && userData.emailVisible === true) {
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
  if (userData?.twitter !== null) {
    contactDataArray.push([userData.twitter, 5]);
  }
  if (userData?.linkedin !== null) {
    contactDataArray.push([userData.linkedin, 6]);
  }
  if (userData?.tiktok !== null) {
    contactDataArray.push([userData.tiktok, 7]);
  }

  const renderAllItems = () => {
    if (contactDataArray.length > 0) {
      return contactDataArray.map((x, index) => {
        console.log(x[1]);
        switch (x[1]) {
          case 0:
            return (
              <EmailItem
                style={styles.baseStyle}
                key={index}
                email={userData.email}
                handleEmailPress={handleEmailPress}
              />
            );
          case 1:
            return (
              <InstagramItem
                style={styles.baseStyle}
                key={index}
                instagram={userData.instagram}
                handleInstagramPress={handleInstagramPress}
              />
            );
          case 2:
            return (
              <YoutubeItem
                style={styles.baseStyle}
                key={index}
                youtube={userData.youtube}
                handleYoutubePress={handleYoutubePress}
              />
            );
          case 3:
            return (
              <FacebookItem
                style={styles.baseStyle}
                key={index}
                facebook={userData.facebook}
                handleFacebookPress={handleFacebookPress}
              />
            );
          case 4:
            return (
              <PhoneItem
                style={styles.baseStyle}
                key={index}
                phoneNumber={userData.phoneNumber}
                handlePhonePress={handlePhonePress}
              />
            );
          case 5:
            return (
              <TwitterItem
                style={styles.baseStyle}
                key={index}
                twitter={userData.twitter}
                handleTwitterPress={handleTwitterPress}
              />
            );
          case 7:
            return (
              <TiktokItem
                style={styles.baseStyle}
                key={index}
                tiktok={userData.tiktok}
                handleTiktokPress={handleTiktokPress}
              />
            );
          case 6:
            return (
              <LinkedinItem
                style={styles.baseStyle}
                key={index}
                linkedin={userData.linkedin}
                handleLinkedinPress={handleLinkedinPress}
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
      <View>{renderAllItems()}</View>
    </>
  );
};

const EmailItem = ({ email, handleEmailPress, style }) => {
  return (
    <TouchableOpacity style={style} onPress={() => handleEmailPress()}>
      <Image
        style={styles.iconLogo}
        source={require("../assets/email_logo.png")}
      />

      <Text style={styles.iconText}>
        {email.length > 22 ? `${email.substring(0, 19)}...` : email}
      </Text>
    </TouchableOpacity>
  );
};

const InstagramItem = ({ instagram, handleInstagramPress, style }) => {
  return (
    <TouchableOpacity style={style} onPress={() => handleInstagramPress()}>
      <Image
        style={styles.iconLogo}
        source={require("../assets/instagram_icon.png")}
      />
      <Text style={styles.iconText}>
        {instagram.length > 22 ? `${instagram.substring(0, 19)}...` : instagram}
      </Text>
    </TouchableOpacity>
  );
};

const YoutubeItem = ({ youtube, handleYoutubePress, style }) => {
  return (
    <TouchableOpacity style={style} onPress={() => handleYoutubePress()}>
      <Image
        style={styles.iconLogo}
        source={require("../assets/youtube_icon.png")}
      />
      <Text style={styles.iconText}>
        {youtube.length > 22 ? `${youtube.substring(0, 19)}...` : youtube}
      </Text>
    </TouchableOpacity>
  );
};

const FacebookItem = ({ facebook, handleFacebookPress, style }) => {
  return (
    <TouchableOpacity style={style} onPress={() => handleFacebookPress()}>
      <Image
        style={styles.iconLogo}
        source={require("../assets/facebook_logo.png")}
      />
      <Text style={styles.iconText}>
        {facebook.length > 22 ? `${facebook.substring(0, 19)}...` : facebook}
      </Text>
    </TouchableOpacity>
  );
};

const PhoneItem = ({ phoneNumber, handlePhonePress, style }) => {
  return (
    <TouchableOpacity style={style} onPress={() => handlePhonePress()}>
      <Image
        style={styles.iconLogo}
        source={require("../assets/phone_logo.jpeg")}
      />
      <Text style={styles.iconText}>
        {phoneNumber.length > 17
          ? `${phoneNumber.substring(0, 19)}...`
          : phoneNumber}
      </Text>
    </TouchableOpacity>
  );
};

const TwitterItem = ({ twitter, handleTwitterPress, style }) => {
  return (
    <TouchableOpacity style={style} onPress={() => handleTwitterPress()}>
      <Image
        style={styles.iconLogo}
        source={require("../assets/twitter_logo.png")}
      />
      <Text style={styles.iconText}>
        {twitter.length > 22 ? `${twitter.substring(0, 19)}...` : twitter}
      </Text>
    </TouchableOpacity>
  );
};

const TiktokItem = ({ tiktok, handleTiktokPress, style }) => {
  console.log(tiktok);
  return (
    <TouchableOpacity style={style} onPress={() => handleTiktokPress()}>
      <Image
        style={styles.iconLogo}
        source={require("../assets/tiktok_logo.png")}
      />
      <Text style={styles.iconText}>
        {tiktok.length > 22 ? `${tiktok.substring(0, 19)}...` : tiktok}
      </Text>
    </TouchableOpacity>
  );
};

const LinkedinItem = ({ linkedin, handleLinkedinPress, style }) => {
  return (
    <TouchableOpacity style={style} onPress={() => handleLinkedinPress()}>
      <Image
        style={styles.iconLogo}
        source={require("../assets/linkedin_logo.png")}
      />
      <Text style={styles.iconText}>
        {linkedin.length > 22 ? `${linkedin.substring(0, 19)}...` : linkedin}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseStyle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    borderRadius: 20,
    marginVertical: vh(0.6),
    marginBottom: 2,
    borderColor: "rgba(190, 119, 234,0.4)",
    width: vw(55),
  },
  iconLogo: {
    height: vh(4),
    width: vh(4),
    borderRadius: vh(2),
    marginRight: vh(1),
  },

  ///////
  icon: {
    padding: 3,
    margin: 2,
    marginLeft: 8,
    borderRadius: 20,
    color: "#3c9dde",
    fontSize: 18,
  },
  iconText: {
    lineHeight: 22,
    marginTop: vh(0.4),
    fontSize: 13,
    color: "#3c9dde",
  },
});
