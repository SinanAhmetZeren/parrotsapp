/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function VehicleCard() {
  const cardHeader = "Boat Tour";
  const cardSubHeader = "in Greece";
  const cardDescription =
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis e";

  return (
    <View style={styles.cardContainer}>
      <Image
        style={styles.cardImage}
        source={require("../assets/sailboat.jpg")}
      />

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
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginLeft: 5,
    marginBottom: 10,
    flexDirection: "row",
    width: "82%",
    height: "100%",
    // backgroundColor: "white",
    borderRadius: 0,
  },
  imageContainer: {
    // backgroundColor: "white",
    width: "55%",
    height: "100%",
  },
  cardImage: {
    height: 150,
    width: 150,
    margin: 3,
    borderRadius: 30,
  },
  textContainer: {
    width: "45%",
    padding: 5,
    // backgroundColor: "white",
  },
  header: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "700",
  },
  subHeader: {
    fontSize: 14,
    fontWeight: "600",
  },
  cardDescription: {
    paddingHorizontal: 0,
  },
});
