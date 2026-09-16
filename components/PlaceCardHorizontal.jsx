import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { Ionicons } from "@expo/vector-icons";

const PLACE_INK = "#6F6455";
const PLACE_BG = "#F5F2EC";
const PLACE_BORDER = "rgba(150,131,94,0.26)";

export default function PlaceCardHorizontal({ cardHeader, cardDescription, cardImage, link, latitude, longitude, focusMap }) {
  const parts = (link || "").split("|");
  const category = parts[0] || "";
  const location = parts[1] || "";
  const url = parts[2] || "";

  const handlePress = () => {
    if (!url) return;
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    Linking.openURL(fullUrl);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.touchable}>
      <View>
        <View style={[styles.cardContainerWrapper, { borderWidth: 1.5, borderColor: PLACE_BORDER }]}>
          <View style={styles.cardContainer}>
            <Image style={styles.cardImage} source={{ uri: cardImage }} resizeMode="cover" />
            <View style={styles.containerContainer}>
              <View style={styles.textContainer}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <ParrotsStdText style={styles.header} numberOfLines={2}>{cardHeader}</ParrotsStdText>
                  <ParrotsStdText style={styles.placeLabel}>PLACE</ParrotsStdText>
                </View>

                <View style={styles.pillRow}>
                  {!!category && (
                    <View style={[styles.pill, { backgroundColor: PLACE_BG }]}>
                      <ParrotsStdText style={[styles.pillText, { color: PLACE_INK }]}>{category}</ParrotsStdText>
                    </View>
                  )}
                  {!!location && (
                    <View style={styles.pill}>
                      <Ionicons name="location-outline" size={11} color="#4A5A6A" />
                      <ParrotsStdText style={styles.pillText}>{location}</ParrotsStdText>
                    </View>
                  )}
                </View>

                {!!cardDescription && (
                  <ParrotsStdText style={styles.cardDescription} numberOfLines={2} ellipsizeMode="tail">
                    {cardDescription}
                  </ParrotsStdText>
                )}
              </View>
            </View>

            <TouchableOpacity onPress={() => focusMap && focusMap(latitude, longitude)} style={styles.extendedAreaContainer}>
              <View style={styles.extendedArea}>
                <ParrotsStdText style={styles.seeOnMap}>View on map</ParrotsStdText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
    height: vh(20),
    backgroundColor: "white",
    borderRadius: vh(2),
  },
  cardImage: {
    width: vw(38),
    height: vh(20),
  },
  containerContainer: {
    height: vh(22),
    top: 0,
  },
  textContainer: {
    marginTop: vh(1),
    width: vw(50),
    height: vh(18),
    paddingHorizontal: vw(2),
    paddingVertical: vh(0.2),
  },
  placeLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 9,
    letterSpacing: 1.2,
    color: "#5C6B7A",
    alignSelf: "flex-start",
    paddingRight: 6,
  },
  header: {
    fontFamily: "Nunito_800ExtraBold",
    marginTop: 0,
    fontSize: 15,
    color: "#0A2540",
    letterSpacing: -0.23,
    lineHeight: 18,
    paddingVertical: vh(0.2),
    alignSelf: "flex-start",
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: vh(0.5),
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F4F7FB",
    paddingHorizontal: vw(2),
    paddingVertical: 3,
    borderRadius: vw(3),
  },
  pillText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11,
    color: "#4A5A6A",
  },
  cardDescription: {
    fontFamily: "Nunito_600SemiBold",
    paddingTop: vh(0.6),
    fontSize: 12,
    color: "#4A5A6A",
    lineHeight: 17,
  },
  extendedAreaContainer: {
    alignSelf: "flex-end",
    position: "absolute",
    bottom: vh(0.3),
    right: vw(2),
    borderRadius: vh(1),
    paddingLeft: vw(5),
    paddingRight: vw(2),
  },
  extendedArea: {
    paddingHorizontal: vh(8),
    paddingVertical: vh(3),
  },
  seeOnMap: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: "#5C6B7A",
    alignSelf: "flex-end",
    position: "absolute",
    bottom: vh(0),
    right: vw(0),
  },
});
