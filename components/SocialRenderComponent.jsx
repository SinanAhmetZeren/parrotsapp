/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { useEffect } from "react";
import { parrotBlueMediumTransparent, parrotBlueSemiTransparent } from "../assets/color";

export const SocialRenderComponent = ({
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


  if (userData.displayEmail && userData.displayEmail.trim() !== "" && userData.emailVisible === true) {
    contactDataArray.push([userData.displayEmail, 0]);
  }

  if (userData.instagram && userData.instagram.trim() !== "") {
    contactDataArray.push([userData.instagram, 1]);
  }

  if (userData.youtube && userData.youtube.trim() !== "") {
    contactDataArray.push([userData.youtube, 2]);
  }

  if (userData.facebook && userData.facebook.trim() !== "") {
    contactDataArray.push([userData.facebook, 3]);
  }

  if (userData.phoneNumber && userData.phoneNumber.trim() !== "") {
    contactDataArray.push([userData.phoneNumber, 4]);
  }

  if (userData.twitter && userData.twitter.trim() !== "") {
    contactDataArray.push([userData.twitter, 5]);
  }

  if (userData.linkedin && userData.linkedin.trim() !== "") {
    contactDataArray.push([userData.linkedin, 6]);
  }

  if (userData.tiktok && userData.tiktok.trim() !== "") {
    contactDataArray.push([userData.tiktok, 7]);
  }



  const renderAllItems2 = () => {
    if (contactDataArray.length > 0) {
      return contactDataArray.slice(0, 5).map((x, index) => {
        const baseStyle =
          styles[`social_${Math.min(contactDataArray.length, 5)}_${index}`] ||
          styles.social_default;

        switch (x[1]) {
          case 0:
            return (
              <EmailItem
                style={baseStyle}
                key={index}
                email={userData.displayEmail}
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
          case 5:
            return (
              <TwitterItem
                style={baseStyle}
                key={index}
                twitter={userData.twitter}
                handleTwitterPress={handleTwitterPress}
              />
            );
          case 6:
            return (
              <TiktokItem
                style={baseStyle}
                key={index}
                tiktok={userData.tiktok}
                handleTiktokPress={handleTiktokPress}
              />
            );
          case 7:
            return (
              <LinkedinItem
                style={baseStyle}
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


  const renderAllItems = () => {
    // Take first 5 non-null contacts
    const firstFive = contactDataArray.slice(0, 5);

    console.log("first five: ", firstFive);
    // If less than 5, fill the remaining with null placeholders
    while (firstFive.length < 5) {
      firstFive.push([null, 'placeholder']); // use a custom type for shadow
    }

    return firstFive.map((x, index) => {
      const baseStyle =
        styles[`social_${firstFive.length}_${index}`] || styles.social_default;

      if (x[1] === 'placeholder') {
        return <ShadowItem style={baseStyle} />;
      }

      switch (x[1]) {
        case 0:
          return (
            <EmailItem
              style={baseStyle}
              key={index}
              email={userData.displayEmail}
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
        case 5:
          return (
            <TwitterItem
              style={baseStyle}
              key={index}
              twitter={userData.twitter}
              handleTwitterPress={handleTwitterPress}
            />
          );
        case 6:
          return (
            <LinkedinItem
              style={baseStyle}
              key={index}
              linkedin={userData.linkedin}
              handleLinkedinPress={handleLinkedinPress}
            />
          );
        case 7:
          return (
            <TiktokItem
              style={baseStyle}
              key={index}
              tiktok={userData.tiktok}
              handleTiktokPress={handleTiktokPress}
            />
          );
        default:
          return null;
      }
    });
  };



  return (
    <>
      <View
        style={[
          // styles[`social_Main_${contactDataArray.length}`],
          styles[`social_Main_5`],
          {
            //marginLeft: vw(12), marginTop: vh(0.8), minWidth: vw(45),
            // backgroundColor: "red"
          },
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
      <Image
        style={styles.iconLogo}
        source={require("../assets/email_logo.png")}
      />

      <Text style={styles.iconText}>
        {email.length > 17 ? `${email.substring(0, 14)}...` : email}
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
        {instagram.length > 17 ? `${instagram.substring(0, 14)}...` : instagram}
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
        {youtube.length > 17 ? `${youtube.substring(0, 14)}...` : youtube}
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
        {facebook.length > 17 ? `${facebook.substring(0, 14)}...` : facebook}
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
          ? `${phoneNumber.substring(0, 14)}...`
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
        {twitter.length > 17 ? `${twitter.substring(0, 14)}...` : twitter}
      </Text>
    </TouchableOpacity>
  );
};

const TiktokItem = ({ tiktok, handleTiktokPress, style }) => {
  return (
    <TouchableOpacity style={style} onPress={() => handleTiktokPress()}>
      <Image
        style={styles.iconLogo}
        source={require("../assets/tiktok_logo.png")}
      />
      <Text style={styles.iconText}>
        {tiktok.length > 17 ? `${tiktok.substring(0, 14)}...` : tiktok}
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
        {linkedin.length > 17 ? `${linkedin.substring(0, 14)}...` : linkedin}
      </Text>
    </TouchableOpacity>
  );
};


const ShadowItem = ({ style }) => {
  return (
    <TouchableOpacity style={{ ...style, opacity: 0.6 }} >
      <View style={styles.iconLogoPlaceHolder} />
      <Text style={styles.iconText}>
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
  iconLogoPlaceHolder: {
    backgroundColor: parrotBlueMediumTransparent,
    height: vh(4),
    width: vh(4),
    borderRadius: vh(2),
    marginRight: vh(1),
    opacity: 0.7,
  },
  social_Main_5: {
    flexDirection: "column",
    width: vw(50),
    zIndex: 100,
    paddingRight: 20,
    paddingTop: 0,
    top: vh(1),
    height: vh(22.5),
  },
  social_Main_4: {
    flexDirection: "column",
    width: vw(50),
    zIndex: 100,
    paddingRight: 20,
    paddingTop: vh(2),
    top: vh(1),
    height: vh(22.5),
  },
  social_Main_3: {
    flexDirection: "column",
    width: vw(50),
    zIndex: 100,
    paddingRight: 20,
    paddingTop: vh(4),
    top: vh(1),
    height: vh(22.5),
  },
  social_Main_2: {
    flexDirection: "column",
    width: vw(50),
    zIndex: 100,
    paddingRight: 20,
    paddingTop: vh(6),
    top: vh(1),
    height: vh(22.5),
  },
  social_Main_1: {
    flexDirection: "column",
    width: vw(50),
    zIndex: 100,
    paddingRight: 20,
    paddingTop: vh(8),
    top: vh(1),
    height: vh(22.5),
  },

  social_5_0: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    left: vw(-4),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  social_5_1: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    left: vw(2),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  social_5_2: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    left: vw(4),
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
    left: vw(2),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  social_5_4: {
    flexDirection: "row",
    backgroundColor: "rgba(162, 208, 239,0.2)",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    left: vw(-4),
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  /*
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
  */
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
