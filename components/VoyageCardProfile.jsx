import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { format } from "date-fns";
import {
  Feather,
  FontAwesome6,
  AntDesign,
  FontAwesome5,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
import he from "he";
import { parrotBananaLeafGreen, parrotBlue, parrotBlueMediumTransparent, parrotBlueTransparent, parrotCream, parrotDarkBlue, parrotGreen } from "../assets/color";
import { Shadow } from "react-native-shadow-2";

export default function VoyageCardProfile({
  cardHeader,
  cardDescription,
  cardImage,
  vacancy,
  startdate,
  enddate,
  vehiclename,
  vehicletype,
  voyageId,
  publicOnMap,
  bidCount,
  acceptedBidCount,
}) {
  const cardImageUrl = `${cardImage}`;
  const formattedStartDate = require("date-fns").format(startdate, "MMM d");
  const formattedEndDate = require("date-fns").format(enddate, "MMM d");
  const navigation = useNavigation();

  const handleNavigation = (voyageId) => {
    const parentScreen = navigation.getState().routes[0].name;

    let targetScreen;
    switch (parentScreen) {
      case "HomeScreen":
        targetScreen = "Home";
        break;
      case "ProfileScreen":
        targetScreen = "ProfileStack";
        break;
      case "FavoritesScreen":
        targetScreen = "Favorites";
        break;
      default:
        targetScreen = "Home";
    }

    navigation.navigate(targetScreen, {
      screen: "VoyageDetail",
      params: { voyageId: voyageId },
    });
  };

  let icon;
  switch (vehicletype) {
    case 0:
      icon = <FontAwesome6 name="sailboat" size={12} color={parrotBlue} />;
      break;
    case 1:
      icon = <AntDesign name="car" size={12} color={parrotBlue} />;
      break;
    case 2:
      icon = <FontAwesome5 name="caravan" size={12} color={parrotBlue} />;
      break;
    case 3:
      icon = <Ionicons name="bus-outline" size={12} color={parrotBlue} />;
      break;
    case 4:
      icon = <FontAwesome5 name="walking" size={12} color={parrotBlue} />;
      break;
    case 5:
      icon = <FontAwesome5 name="running" size={12} color={parrotBlue} />;
      break;
    case 6:
      icon = <FontAwesome name="motorcycle" size={12} color={parrotBlue} />;
      break;
    case 7:
      icon = <FontAwesome name="bicycle" size={12} color={parrotBlue} />;
      break;
    case 8:
      icon = <FontAwesome6 name="house" size={12} color={parrotBlue} />;
      break;
    case 9:
      icon = <Ionicons name="airplane-outline" size={12} color={parrotBlue} />;
      break;
    case 10:
      icon = <Ionicons name="train-outline" size={12} color={parrotBlue} />;
      break;
    default:
      icon = "help-circle";
      break;
  }

  // let x = "1234567890123456789012345";
  return (
    <View style={{
      marginBottom: 0, borderRadius: vh(2), padding: vh(1)
    }}>

      <View>
        <TouchableOpacity onPress={() => handleNavigation(voyageId)}>
          <View style={{ ...styles.cardContainer }}>
            <View style={{ ...styles.shadow }}>
              <Image style={styles.cardImage} source={{ uri: cardImageUrl }} />
              {bidCount > 0 && (
                <View style={styles.bidPill}>
                  <View style={[styles.bidCircle, { backgroundColor: parrotBananaLeafGreen }]}>
                    <Feather name="check" size={10} color="white" />
                    <ParrotsStdText style={styles.bidPillText}>{acceptedBidCount}</ParrotsStdText>
                  </View>
                  <View style={[styles.bidCircle, { backgroundColor: parrotBlue }]}>
                    <FontAwesome name="pencil" size={10} color="white" />
                    <ParrotsStdText style={styles.bidPillText}>{bidCount}</ParrotsStdText>
                  </View>
                </View>
              )}
            </View>

            <View style={{ ...styles.textContainer, height: vh(20), position: "relative" }}>
              <ParrotsStdText numberOfLines={2} style={{ ...styles.header }}>
                {cardHeader}
              </ParrotsStdText>

              {publicOnMap &&
                <View style={{ position: "absolute", right: 5, top: 5, backgroundColor: parrotBlueMediumTransparent, borderRadius: vw(5), padding: 3 }}>
                  <MaterialIcons name="public" size={20} color={parrotBlue} />
                </View>
              }

              <View style={styles.pillRow}>
                <View style={styles.pill}>
                  <ParrotsStdText style={styles.pillText}>
                    {vehiclename?.length > 20
                      ? vehiclename.substring(0, 20) + "..."
                      : vehiclename}
                  </ParrotsStdText>
                  {icon}
                </View>
                <View style={styles.pill}>
                  <ParrotsStdText style={styles.pillText}>{vacancy}</ParrotsStdText>
                  <Feather name="users" size={11} color={parrotBlue} />
                </View>
                <View style={styles.pill}>
                  <ParrotsStdText style={styles.pillText}>{formattedStartDate + " – " + formattedEndDate}</ParrotsStdText>
                  <AntDesign name="calendar" size={11} color={parrotBlue} />
                </View>
              </View>
              <ParrotsStdText
                style={styles.cardDescription}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {he.decode(cardDescription.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())}
              </ParrotsStdText>
            </View>
          </View>
        </TouchableOpacity>
      </View>

    </View>

  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
    height: vh(20),
    backgroundColor: "rgba(0, 119, 234, 0.04)",
    borderRadius: vh(2),
  },
  cardImage: {
    width: vw(42),
    height: vh(20),
    marginRight: vh(0.5),
    borderRadius: vh(2),
    borderTopRightRadius: vh(0),
    borderBottomRightRadius: vh(0),
  },
  textContainer: {
    width: vw(50),
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
    backgroundColor: "rgba(0, 119, 234, 0.06)",
    paddingHorizontal: vw(2),
    paddingVertical: 3,
    borderRadius: vw(3),
  },
  pillText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 11,
    color: parrotBlue,
  },
  bidPill: {
    position: "absolute",
    bottom: vh(0.8),
    left: vw(2),
    backgroundColor: "rgba(222,222,222,0.85)",
    // backgroundColor: "white",
    borderRadius: vw(11),
    paddingHorizontal: vw(1),
    paddingVertical: 3,
    flexDirection: "row",
    gap: 2,
  },
  bidCircle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: vw(3),
    paddingHorizontal: vw(1.5),
    paddingVertical: 2,
    justifyContent: "center",
  },
  bidPillText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 11,
    color: "white",
  },
  cardDescription: {
    fontFamily: "Nunito_700Bold",
    paddingTop: vh(0.6),
    paddingHorizontal: 0,
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 17,
  },
});
