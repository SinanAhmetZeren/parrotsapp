/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

export default function VehicleCardProfile({
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
            numberOfLines={8}
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
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
    flexDirection: "row",
    height: vh(20),
    backgroundColor: "rgba(0, 119, 234,0.071)",
    borderRadius: vh(2),
  },
  imageContainer: {
    backgroundColor: "white",
  },
  cardImage: {
    width: vw(46),
    height: vh(20),
    marginRight: vh(0.5),
    borderRadius: vh(2),
    borderTopRightRadius: vh(0),
    borderBottomRightRadius: vh(0),
  },
  textContainer: {
    width: vw(46),
    padding: vh(0.2),
  },
  header: {
    // marginTop: 2,
    fontSize: 14,
    fontWeight: "700",
  },
  subHeader: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardDescription: {
    paddingHorizontal: 0,
    fontSize: 11.5,
  },
});
