/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { Shadow } from "react-native-shadow-2";
import { parrotBlue, parrotCream } from "../assets/color";
const goldenegg = require("../assets/goldenegg.png");

export default function PlaceCardHorizontal({ cardHeader, cardDescription, cardImage, link, latitude, longitude, focusMap }) {
  const handlePress = () => {
    if (!link) return;
    const url = link.startsWith("http") ? link : `https://${link}`;
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.touchable}>
      <Shadow
        distance={12}
        offset={[0, 0]}
        startColor="rgba(0,0,0,0.08)"
        finalColor="rgba(0,0,0,0.13)"
        radius={12}
      >
        <View style={styles.cardContainerWrapper}>
          <View style={styles.eggBadgeClip}>
            <View style={styles.eggBadgeOffset}>
              <Image source={goldenegg} style={styles.eggBadge} resizeMode="contain" />
            </View>
          </View>
          <View style={styles.cardContainer}>
            <Image style={styles.cardImage} source={{ uri: cardImage }} resizeMode="cover" />
            <View style={styles.containerContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.header} numberOfLines={2}>{cardHeader}</Text>
                {cardDescription ? (
                  <Text style={styles.cardDescription} numberOfLines={5} ellipsizeMode="tail">
                    {cardDescription}
                  </Text>
                ) : null}
              </View>
            </View>
            <View style={styles.bottomRow}>
              <View style={styles.visitButton} />
              <TouchableOpacity onPress={() => focusMap && focusMap(latitude, longitude)} style={styles.mapButton}>
                <Text style={styles.seeOnMap}>View on map</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Shadow>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginRight: vw(2),
  },
  cardContainerWrapper: {
    backgroundColor: "white",
    borderRadius: vh(2),
    overflow: "hidden",
  },
  eggBadgeClip: {
    position: "absolute",
    top: 6,
    right: 2,
    width: 30,
    height: 30,
    zIndex: 10,
    overflow: "hidden",
    borderRadius: 17,
    backgroundColor: "#FFD700",
  },
  eggBadgeOffset: {
    position: "relative",
    left: 0,
    top: -1,
  },
  eggBadge: {
    width: 31,
    height: 34,
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
    height: vh(20),
    backgroundColor: parrotCream,
    borderRadius: vh(2),
  },
  containerContainer: {
    height: vh(22),
    top: 0,
  },
  cardImage: {
    width: vw(38),
    height: vh(20),
    marginRight: vh(0.5),
    borderRadius: vh(2),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  textContainer: {
    marginTop: vh(1),
    width: vw(50),
    height: vh(18),
    paddingHorizontal: vw(2),
    paddingVertical: vh(0.2),
  },
  header: {
    fontFamily: "Nunito_700Bold",
    marginTop: 2,
    fontSize: 14,
    color: parrotBlue,
    paddingVertical: vh(0.2),
    alignSelf: "flex-start",
  },
  cardDescription: {
    fontFamily: "Nunito_700Bold",
    paddingTop: vh(0.6),
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 17,
  },
  bottomRow: {
    position: "absolute",
    bottom: vh(0.8),
    left: vw(38),
    width: vw(50),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  visitButton: {
    flex: 1,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 2,
    alignItems: "flex-start",
  },
  mapButton: {
    flex: 1,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginLeft: 2,
    alignItems: "flex-end",
  },
  visitText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: parrotBlue,
  },
  seeOnMap: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: parrotBlue,
  },
});
