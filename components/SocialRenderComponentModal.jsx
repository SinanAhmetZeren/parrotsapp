import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { useEffect } from "react";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { parrotCream } from "../assets/color";

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

  return (
    <View style={styles.container}>
      {contactDataArray.map((x, index) => {
        const type = x[1];
        const brand = BRAND[type] ?? BRAND[0];
        const handle = x[0] ?? "";
        return (
          <TouchableOpacity key={index} style={styles.row} onPress={handlers[type]} activeOpacity={0.75}>
            <View style={[styles.iconLogo, { backgroundColor: brand.color }]}>
              {brand.icon(16)}
            </View>
            <View style={styles.pill}>
              <ParrotsStdText style={styles.iconText} numberOfLines={1} ellipsizeMode="tail">
                {handle.length > 22 ? `${handle.substring(0, 19)}...` : handle}
              </ParrotsStdText>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: vh(1),
    paddingHorizontal: vw(2),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
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
});
