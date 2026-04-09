/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */

import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";
import { MessagesComponent } from "../components/MessagesComponent";
import { API_URL } from "@env";
import { parrotBlueDarkTransparent, parrotBlueDarkTransparent2, parrotCream, parrotLightBlue, parrotPlaceholderGrey } from "../assets/color";

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0
  const year = String(date.getFullYear()).slice(-2);

  return [`${hours}:${minutes}`, `${day}/${month}/${year}`];
}

export default function CoversationView({
  profileImg,
  name,
  message,
  time,
  userId,
  publicId
}) {
  const navigation = useNavigation();

  const handleNavigate = (conversationUserId) => {
    navigation.navigate("ConversationDetailScreen", {
      conversationUserId,
      profileImg,
      name,
      publicId
    });
  };

  return (
    <TouchableOpacity
      style={styles.mainContainer}
      onPress={() => handleNavigate(userId)}
    >
      <View style={styles.profileImageContainer}>
        <Image
          style={styles.profileImage}
          resizeMode="cover"
          source={{
            uri: `${profileImg}`,
          }}
        />
      </View>
      <View style={styles.nameAndMessage}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.message} numberOfLines={1} ellipsizeMode="tail">
          {message}
        </Text>
      </View>
      <View style={styles.time}>
        <Text style={styles.timeText1}>{formatDate(time)[0]}</Text>
        <Text style={styles.timeText2}>{formatDate(time)[1]}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: vw(2),
    paddingRight: vw(4),
    paddingVertical: vh(0.6),
    backgroundColor: "white",
    borderRadius: vh(6),
    width: vw(90),
  },
  profileImageContainer: {
    justifyContent: "center",
    marginRight: vw(2),
  },
  profileImage: {
    height: vw(11),
    width: vw(11),
    borderRadius: vw(6),
  },
  columnContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontWeight: "700",
    fontSize: 15,
    color: parrotLightBlue,
    marginBottom: vh(0.4),
  },
  message: {
    fontWeight: "500",
    fontSize: 13,
    color: parrotPlaceholderGrey,
  },
  nameAndMessage: {
    flex: 1,
  },
  time: {
    alignItems: "flex-end",
    justifyContent: "center",
    paddingLeft: vw(2),
  },
  timeText1: {
    fontWeight: "700",
    fontSize: 13,
    color: parrotBlueDarkTransparent2,
    marginBottom: vh(0.5),
  },
  timeText2: {
    fontWeight: "600",
    fontSize: 12,
    color: parrotBlueDarkTransparent,
  },
});
