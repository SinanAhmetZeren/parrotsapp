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
  console.log("ss", voyages[0].profileImage);
  const imageBaseUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/VoyageImages/`;

  return (
    <FlatList
      horizontal
      style={styles.BidsFlatList}
      data={voyages}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View key={index} style={styles.singleBidContainer2}>
          <Image
            // source={require("../assets/parrots-logo.jpg")}
            source={{ uri: imageBaseUrl + item.profileImage }}
            style={styles.bidImage2}
          />
          <Text>{item.id}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  singleBidContainer2: {
    height: vh(15),
    width: vh(15),
    margin: vh(3),
  },
  bidImage2: {
    height: "100%",
    width: "100%",
  },
  BidsFlatList: {
    height: vh(100),
    marginBottom: vh(0),
  },
});
