/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */

import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";
import { MessagesComponent } from "../components/MessagesComponent";
import { API_URL } from "@env";

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
}) {
  const navigation = useNavigation();

  const handleNavigate = (conversationUserId) => {
    navigation.navigate("ConversationDetailScreen", {
      conversationUserId,
      profileImg,
      name,
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
            uri: `${API_URL}/Uploads/UserImages/${profileImg}`,
          }}
        />
      </View>
      <View style={styles.columnContainer}>
        <View style={styles.nameAndMessage}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.message} numberOfLines={1} ellipsizeMode="tail">
            {message}
          </Text>
        </View>
      </View>
      <View style={styles.columnContainer}>
        <View style={styles.time}>
          <Text style={styles.timeText1}>{formatDate(time)[0]}</Text>
          <Text style={styles.timeText2}>{formatDate(time)[1]}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileImageContainer: {
    justifyContent: "center",
  },
  mainContainer: {
    flexDirection: "row",
    padding: 6,
    marginBottom: vh(1),
    backgroundColor: "#f2f6f9",
    borderRadius: vh(3),
  },
  profileImage: {
    height: vw(13),
    width: vw(13),
    borderRadius: vh(10),
  },

  columnContainer: {
    padding: vh(0.6),
    justifyContent: "center",
  },
  name: {
    paddingHorizontal: vh(2),
    paddingVertical: vh(0.5),
    fontWeight: "700",
    // color: "grey",
    color: "#3c9dde",
  },
  message: {
    paddingHorizontal: vh(2),
    fontWeight: "700",
    color: "grey",
  },
  nameAndMessage: {
    padding: 1,
    width: vw(50),
  },
  time: {
    width: vw(20),
  },
  timeText1: {
    fontWeight: "700",
    color: "darkgrey",
    marginBottom: vh(1),
  },
  timeText2: {
    fontWeight: "700",
    color: "darkgrey",
  },
  alert: {
    padding: 7,
    backgroundColor: "#0077ea",
    borderRadius: 20,
    width: vw(10),
    alignSelf: "center",
  },
});
