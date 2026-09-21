import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect } from "react";
import { vw, vh } from "react-native-expo-viewport-units";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { parrotBlueTransparent } from "../assets/color";

const BRAND = {
  0: { color: "#4EA3E0", icon: (s) => <Ionicons name="mail" size={s} color="#fff" /> },
  1: { color: "#D62976", icon: (s) => <FontAwesome5 name="instagram" size={s} color="#fff" /> },
  2: { color: "#FF0000", icon: (s) => <FontAwesome5 name="youtube" size={s} color="#fff" /> },
  3: { color: "#1877F2", icon: (s) => <FontAwesome5 name="facebook-f" size={s} color="#fff" /> },
  4: { color: "#4EA3E0", icon: (s) => <Ionicons name="call" size={s} color="#fff" /> },
  5: { color: "#0B0B0B", icon: (s) => <FontAwesome5 name="twitter" size={s} color="#fff" /> },
  6: { color: "#0A66C2", icon: (s) => <FontAwesome5 name="linkedin-in" size={s} color="#fff" /> },
  7: { color: "#000000", icon: (s) => <MaterialCommunityIcons name="music-note" size={s} color="#fff" /> },
};

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
  setSocialModalVisible,
}) => {
  let contactDataArray = [];

  if (userData.displayEmail && userData.displayEmail.trim() !== "" && userData.emailVisible === true)
    contactDataArray.push([userData.displayEmail, 0]);
  if (userData.instagram && userData.instagram.trim() !== "")
    contactDataArray.push([userData.instagram, 1]);
  if (userData.youtube && userData.youtube.trim() !== "")
    contactDataArray.push([userData.youtube, 2]);
  if (userData.facebook && userData.facebook.trim() !== "")
    contactDataArray.push([userData.facebook, 3]);
  if (userData.phoneNumber && userData.phoneNumber.trim() !== "")
    contactDataArray.push([userData.phoneNumber, 4]);
  if (userData.twitter && userData.twitter.trim() !== "")
    contactDataArray.push([userData.twitter, 5]);
  if (userData.linkedin && userData.linkedin.trim() !== "")
    contactDataArray.push([userData.linkedin, 6]);
  if (userData.tiktok && userData.tiktok.trim() !== "")
    contactDataArray.push([userData.tiktok, 7]);

  useEffect(() => {
    setSocialItemCount(contactDataArray.length);
  }, [setSocialItemCount, contactDataArray.length]);

  const handlers = {
    0: handleEmailPress,
    1: handleInstagramPress,
    2: handleYoutubePress,
    3: handleFacebookPress,
    4: handlePhonePress,
    5: handleTwitterPress,
    6: handleLinkedinPress,
    7: handleTiktokPress,
  };

  const renderAllItems = () => {
    const firstFive = contactDataArray.slice(0, 5);
    while (firstFive.length < 5) firstFive.push([null, "placeholder"]);

    return firstFive.map((x, index) => {
      const baseStyle = styles[`social_5_${index}`] || styles.social_default;

      if (x[1] === "placeholder") {
        return (
          <View key={`ph-${index}`} style={[baseStyle, { opacity: 0 }]}>
            <View style={styles.iconLogo} />
            <ParrotsStdText style={styles.iconText}> </ParrotsStdText>
          </View>
        );
      }

      const type = x[1];
      const brand = BRAND[type] ?? BRAND[0];
      const handle = x[0] ?? "";

      return (
        <TouchableOpacity key={`item-${index}`} style={baseStyle} onPress={handlers[type]} activeOpacity={0.75}>
          <View style={[styles.iconLogo, { backgroundColor: brand.color }]}>
            {brand.icon(16)}
          </View>
          <View style={styles.pill}>
            <ParrotsStdText style={styles.iconText} numberOfLines={1} ellipsizeMode="tail">
              {handle.length > 17 ? `${handle.substring(0, 14)}...` : handle}
            </ParrotsStdText>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.social_Main_5}>
      {renderAllItems()}
      {contactDataArray.length > 5 && (
        <TouchableOpacity onPress={() => setSocialModalVisible(true)} style={styles.seeMoreInline} activeOpacity={0.8}>
          <View style={styles.moreCircle}>
            <ParrotsStdText style={styles.moreButton}>+{contactDataArray.length - 5}</ParrotsStdText>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  seeMoreInline: {
    position: "absolute",
    bottom: vh(0.5),
    right: vw(-7),
  },
  moreCircle: {
    width: vh(3.5),
    height: vh(3.5),
    borderRadius: vh(1.75),
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E8E3DC",
    alignItems: "center",
    justifyContent: "center",
  },
  moreButton: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: "#0A5FBF",
  },
  iconLogo: {
    height: vh(4),
    width: vh(4),
    borderRadius: vh(2),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    shadowColor: "rgba(12,30,48,1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 3,
  },
  pill: {
    flex: 1,
    justifyContent: "center",
    zIndex: 1,
    backgroundColor: "#fff",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E8E3DC",
    paddingLeft: vh(3),
    paddingRight: vw(2),
    marginLeft: -vh(2),
    height: vh(3.5),
  },
  iconText: {
    fontFamily: "Nunito_700Bold",
    lineHeight: 22,
    fontSize: 13,
    color: "#0A5FBF",
  },
  social_Main_5: {
    flexDirection: "column",
    width: vw(44),
    zIndex: 100,
    paddingTop: 0,
    top: vh(1),
    height: vh(22.5),
    // backgroundColor: "red",
  },
  social_5_0: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    left: vw(-4),
  },
  social_5_1: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    left: vw(2),
  },
  social_5_2: {
    flexDirection: "row",
    alignItems: "center",
    left: vw(4),
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
  },
  social_5_3: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    left: vw(2),
  },
  social_5_4: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    left: vw(-4),
  },
});
