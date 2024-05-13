/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { useEffect } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";

export const VoyagesFlatlistMainpage = ({ voyages }) => {
  const imageBaseUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/VoyageImages/`;

  return (
    <FlatList
      horizontal
      style={styles.BidsFlatList}
      data={voyages}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => <VoyageItem item={item} index={index} />}
    />
  );
};

const VoyageItem = ({ item, index }) => {
  const imageBaseUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/VoyageImages/`;

  return (
    <View key={index} style={styles.singleBidContainer2}>
      <Image
        // source={require("../assets/ParrotsWhiteBg.png")}
        source={{ uri: imageBaseUrl + item.profileImage }}
        style={styles.bidImage2}
      />

      <Text style={styles.voyageName}>{item.name}</Text>
      <Text style={styles.voyageBrief}>{item.brief}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  voyageBrief: {
    width: vw(50),
    padding: vw(2),
    backgroundColor: "yellow",
  },
  voyageName: {
    paddingHorizontal: vw(2),
    fontWeight: "700",
    color: "#2ac898",
  },
  singleBidContainer2: {
    height: vh(20),
    width: vw(75),
    margin: vh(3),
  },
  bidImage2: {
    height: vh(17),
    width: vh(17),
    borderRadius: vh(2),
  },
  BidsFlatList: {
    height: vh(100),
    marginBottom: vh(10),
  },
});

const styles2 = StyleSheet.create({
  voyageBrief: {
    width: vw(50),
    padding: vw(2),
    backgroundColor: "yellow",
  },
  voyageName: {
    paddingHorizontal: vw(2),
    fontWeight: "700",
    color: "#2ac898",
  },
  singleBidContainer2: {
    height: vh(20),
    width: vw(75),
    margin: vh(3),
    flexDirection: "row",
  },
  bidImage2: {
    height: vh(17),
    width: vh(17),
    borderRadius: vh(2),
  },
  BidsFlatList: {
    height: vh(100),
    marginBottom: vh(10),
  },
});

const a = (item, index) => (
  <View key={index} style={styles.singleBidContainer2}>
    <View>
      <Image
        // source={require("../assets/ParrotsWhiteBg.png")}
        source={{ uri: item.profileImage }}
        style={styles.bidImage2}
      />
    </View>
    <View>
      <Text style={styles.voyageName}>{item.name}</Text>
      <Text style={styles.voyageBrief}>{item.brief}</Text>
    </View>
  </View>
);
