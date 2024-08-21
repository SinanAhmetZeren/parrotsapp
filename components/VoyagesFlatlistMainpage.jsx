/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";

import { vw, vh } from "react-native-expo-viewport-units";
import { API_URL } from "@env";

export const VoyagesFlatlistMainpage = ({ voyages }) => {
  const imageBaseUrl = `${API_URL}/Uploads/VoyageImages/`;

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
  const imageBaseUrl = `${API_URL}/Uploads/VoyageImages/`;

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
