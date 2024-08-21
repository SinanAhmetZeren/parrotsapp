/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

export default function VehicleCardHome({
  cardHeader,
  cardSubHeader,
  cardDescription,
  cardImage,
}) {
  return (
    <>
      <View style={styles.cardContainer}>
        <View style={styles.shadow}>
          <Image style={styles.cardImage} source={cardImage} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.header}>{cardHeader}</Text>
          <Text style={styles.subHeader}>{cardSubHeader}</Text>
          <Text
            style={styles.cardDescription}
            numberOfLines={5}
            ellipsizeMode="tail"
          >
            {cardDescription}
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginLeft: 5,
    marginBottom: 10,
    flexDirection: "row",
    width: vw(83),
    height: vh(20),
    backgroundColor: "white",
    borderRadius: 0,
  },
  cardImage: {
    width: vw(40),
    height: vh(19),
    margin: 3,
    borderRadius: 30,
  },
  textContainer: {
    width: vw(40),
    padding: 5,
    backgroundColor: "white",
  },
  header: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "700",
    backgroundColor: "white",
  },
  subHeader: {
    fontSize: 14,
    backgroundColor: "white",
    fontWeight: "600",
  },
  cardDescription: {
    backgroundColor: "white",
    paddingHorizontal: 0,
  },
});
