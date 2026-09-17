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
import { parrotBananaLeafGreen, parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotBlueSemiTransparent3, parrotBlueTransparent, parrotCream, parrotGreen, parrotTextDarkBlue, parrotBoatPurple, parrotCarRed, parrotCaravanOrangeRed, parrotBusYellowGreen, parrotWalkTurquoise, parrotRunLightOrange, parrotMotorcycleDarkRed, parrotBicycleTealGreen, parrotTinyHouseLightYellow, parrotAirplaneLightGreen, parrotTrainPink } from "../assets/color";

const vehicleColors = {
  0: parrotBoatPurple,
  1: parrotCarRed,
  2: parrotCaravanOrangeRed,
  3: parrotBusYellowGreen,
  4: parrotWalkTurquoise,
  5: parrotRunLightOrange,
  6: parrotMotorcycleDarkRed,
  7: parrotBicycleTealGreen,
  8: parrotTinyHouseLightYellow,
  9: parrotAirplaneLightGreen,
  10: parrotTrainPink,
};


export default function FavoriteVoyageCardProfile({
  cardHeader,
  cardDescription,
  cardImage,
  vacancy,
  startdate,
  enddate,
  vehiclename,
  vehicletype,
  voyagePublicId,
  isPublicOnMap,
  userBidAccepted,
}) {
  const cardImageUrl = `${cardImage}`;
  const vColor = vehicleColors[vehicletype] ?? "#0A77EA";
  const formattedStartDate = require("date-fns").format(startdate, "MMM d");
  const formattedEndDate = require("date-fns").format(enddate, "MMM d");
  const navigation = useNavigation();

  const handleNavigation = (voyagePublicId) => {
    navigation.navigate("Favorites", {
      screen: "VoyageDetail",
      params: { voyagePublicId: voyagePublicId },
    });
  };

  let icon;
  switch (vehicletype) {
    case 0:  icon = <FontAwesome6 name="sailboat" size={12} color={vColor} />; break;
    case 1:  icon = <AntDesign name="car" size={12} color={vColor} />; break;
    case 2:  icon = <FontAwesome5 name="caravan" size={12} color={vColor} />; break;
    case 3:  icon = <Ionicons name="bus-outline" size={12} color={vColor} />; break;
    case 4:  icon = <FontAwesome5 name="walking" size={12} color={vColor} />; break;
    case 5:  icon = <FontAwesome5 name="running" size={12} color={vColor} />; break;
    case 6:  icon = <FontAwesome name="motorcycle" size={12} color={vColor} />; break;
    case 7:  icon = <FontAwesome name="bicycle" size={12} color={vColor} />; break;
    case 8:  icon = <FontAwesome6 name="house" size={12} color={vColor} />; break;
    case 9:  icon = <Ionicons name="airplane-outline" size={12} color={vColor} />; break;
    case 10: icon = <Ionicons name="train-outline" size={12} color={vColor} />; break;
    default: icon = null; break;
  }

  // let x = "1234567890123456789012345";
  return (
    <TouchableOpacity onPress={() => handleNavigation(voyagePublicId)}>
      <View style={styles.cardContainerWrapper}>
      <View style={styles.cardContainer}>
        <View style={styles.shadow}>
          <Image style={styles.cardImage} source={{ uri: cardImageUrl }} resizeMode="cover" />
          {(isPublicOnMap || (userBidAccepted !== null && userBidAccepted !== undefined)) && (
            <View style={styles.bidBadge}>
              {isPublicOnMap && (
                <View style={{ backgroundColor: "#00838F", borderRadius: 99, padding: 4, alignItems: "center", justifyContent: "center" }}>
                  <MaterialIcons name="public" size={15} color="white" />
                </View>
              )}
              {userBidAccepted !== null && userBidAccepted !== undefined && (
                <View style={{ backgroundColor: userBidAccepted ? parrotGreen : parrotBlue, borderRadius: 99, minWidth: 22, minHeight: 22, paddingHorizontal: 5, alignItems: "center", justifyContent: "center" }}>
                  <FontAwesome6 name={userBidAccepted ? "circle-check" : "clock"} size={13} color="white" />
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          <ParrotsStdText style={styles.header}>{cardHeader}</ParrotsStdText>
          <View style={styles.pillRow}>
            <View style={[styles.pill, { backgroundColor: vColor + "15" }]}>
              <ParrotsStdText style={[styles.pillText, { color: vColor }]}>
                {vehiclename?.length > 16
                  ? vehiclename.substring(0, 16) + "..."
                  : vehiclename}
              </ParrotsStdText>
              {icon}
            </View>
            <View style={styles.pill}>
              <ParrotsStdText style={styles.pillText}>{vacancy}</ParrotsStdText>
              <Feather name="users" size={11} color="#4A5A6A" />
            </View>
            <View style={styles.pill}>
              <ParrotsStdText style={styles.pillText}>{formattedStartDate + " – " + formattedEndDate}</ParrotsStdText>
              <AntDesign name="calendar" size={11} color="#4A5A6A" />
            </View>
          </View>
          <ParrotsStdText style={styles.cardDescription}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {he.decode(
              cardDescription
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
            )}
          </ParrotsStdText>
        </View>
      </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainerWrapper: {
    borderRadius: vh(2),
    overflow: "hidden",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E8E3DC",
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
    height: vh(20),
    backgroundColor: "transparent",
  },
  cardImage: {
    width: vw(42),
    height: vh(20),
  },
  textContainer: {
    width: vw(50),
    height: vh(20),
    paddingHorizontal: vw(2),
    paddingTop: vh(0.5),
    paddingBottom: vh(0.2),
    position: "relative"
  },
  header: {
    fontFamily: "Nunito_700Bold",
    marginTop: 0,
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
    backgroundColor: "#F4F7FB",
    paddingHorizontal: vw(2),
    paddingVertical: 3,
    borderRadius: vw(3),
  },
  pillText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 11,
    color: "#4A5A6A",
  },
  bidBadge: {
    position: "absolute",
    bottom: vh(0.8),
    left: vw(2),
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bidBadgeText: {
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
