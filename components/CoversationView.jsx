/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */

import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";

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
  count,
}) {
  return (
    <View style={styles.mainContainer}>
      <View>
        <Image
          style={styles.profileImage}
          resizeMode="cover"
          //   source={require("../assets/parrot-looks.jpg")}
          source={{
            uri: `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/${profileImg}`,
          }}
        />
      </View>
      <View style={styles.messagesTextContainer}>
        <View>
          {/* <Text style={styles.name}>Mango Featherwing</Text> */}
          <Text style={styles.name}>{name}</Text>
        </View>
        <View>
          <Text style={styles.message} numberOfLines={1} ellipsizeMode="tail">
            {message}
          </Text>
        </View>
      </View>
      <View style={styles.timeAndAlertContainer}>
        <View style={styles.time}>
          <Text style={styles.timeText}>{formatDate(time)[0]}</Text>
          <Text style={styles.timeText}>{formatDate(time)[1]}</Text>
        </View>
        {/* <View style={styles.alert}>
          <Text style={styles.alertText}>{count ? count : ""}</Text>
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    backgroundColor: "#e9e9e9",
    padding: 6,
    marginBottom: vh(2),
  },
  profileImage: {
    height: vh(10),
    width: vh(10),
    borderRadius: vh(10),
  },
  messagesTextContainer: {
    height: vh(10),
    width: vw(50),
  },
  timeAndAlertContainer: {
    // flex: 1,
  },
  name: {
    backgroundColor: "#e9e9e9",
    padding: 10,
    fontWeight: "700",
  },
  message: {
    padding: 10,
    // backgroundColor: "#e9e9e9",
    backgroundColor: "yellow",
  },
  time: {
    padding: 1,
    // backgroundColor: "#e9e9e9",
    backgroundColor: "orange",
    width: vw(35),
  },
  timeText: {
    fontWeight: "700",
    color: "grey",
  },
  alert: {
    padding: 7,
    backgroundColor: "#0077ea",
    borderRadius: 20,
    width: vw(10),
    alignSelf: "center",
  },
  alertText: {
    padding: 2,
    fontWeight: "800",
    alignSelf: "center",
    color: "white",
  },
});
