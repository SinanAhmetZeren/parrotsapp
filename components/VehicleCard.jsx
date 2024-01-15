/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";

export default function VehicleCard({
  cardHeader,
  cardSubHeader,
  cardDescription,
}) {
  return (
    <>
      <View style={styles.cardContainer}>
        <View style={styles.shadow}>
          <Image
            style={styles.cardImage}
            source={require("../assets/sailboat.jpg")}
          />
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
    backgroundColor: "green",
    borderRadius: 0,
  },
  imageContainer: {
    backgroundColor: "blue",
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
    backgroundColor: "blue",
  },
  header: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "700",
    backgroundColor: "orange",
  },
  subHeader: {
    fontSize: 14,
    backgroundColor: "yellow",
    fontWeight: "600",
  },
  cardDescription: {
    backgroundColor: "moccasin",
    paddingHorizontal: 0,
  },
});
