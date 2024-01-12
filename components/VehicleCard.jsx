/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function VehicleCard() {
  const cardHeader = "Card Header";
  const cardSubHeader = "Card SubHeader";
  const cardDescription =
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis e";

  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.cardImage}
          source={require("../assets/parrot-profile.jpg")}
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
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginLeft: 5,
    flexDirection: "row",
    width: "82%",
    height: "100%",
    backgroundColor: "white",
  },
  imageContainer: {
    backgroundColor: "white",
    width: "55%",
    height: "95%",
  },
  cardImage: {
    height: "100%",
    width: "100%",
    margin: 3,
    borderRadius: 20,
  },
  textContainer: {
    width: "45%",
    padding: 5,
    backgroundColor: "white",
  },
  header: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: "700",
  },
  subHeader: {
    fontSize: 18,
  },
  cardDescription: {
    paddingHorizontal: 0,
  },
});
