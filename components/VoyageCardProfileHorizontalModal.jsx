import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import {
  Feather,
  FontAwesome6,
  AntDesign,
  FontAwesome5,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import he from "he";
import {
  parrotBlue,
  parrotBoatPurple, parrotCarRed, parrotCaravanOrangeRed, parrotBusYellowGreen,
  parrotWalkTurquoise, parrotRunLightOrange, parrotMotorcycleDarkRed, parrotBicycleTealGreen,
  parrotTinyHouseLightYellow, parrotAirplaneLightGreen, parrotTrainPink,
} from "../assets/color";

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

export default function VoyageCardProfileHorizontalModal({
  cardHeader,
  cardDescription,
  cardImage,
  vacancy,
  startdate,
  enddate,
  vehiclename,
  vehicletype,
  voyagePublicId,
  setSelectedVoyageModalVisible,
  navigation: navProp,
}) {
  const vt = Number(vehicletype);
  const vColor = vehicleColors[vt] ?? parrotBlue;
  const formattedStartDate = require("date-fns").format(startdate, "MMM d");
  const formattedEndDate = require("date-fns").format(enddate, "MMM d");
  const dateLabel = formattedStartDate === formattedEndDate
    ? formattedStartDate
    : `${formattedStartDate} – ${formattedEndDate}`;
  const navHook = useNavigation();
  const navigation = navProp || navHook;

  let icon;
  switch (vt) {
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

  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedVoyageModalVisible(false);
        navigation.push("VoyageDetail", { voyagePublicId });
      }}
    >
      <View style={[styles.cardContainerWrapper, { backgroundColor: "white", borderWidth: 1, borderColor: "#E8E3DC" }]}>
        <View style={styles.cardContainer}>
          <Image style={styles.cardImage} source={{ uri: cardImage }} resizeMode="cover" />

          <View style={styles.containerContainer}>
            <View style={styles.textContainer}>
              <ParrotsStdText style={styles.header}>{cardHeader}</ParrotsStdText>

              <View style={styles.pillRow}>
                <View style={[styles.pill, { backgroundColor: vColor + "15" }]}>
                  <ParrotsStdText style={[styles.pillText, { color: vColor }]}>
                    {vehiclename?.length > 16 ? vehiclename.substring(0, 16) + "..." : vehiclename}
                  </ParrotsStdText>
                  {icon}
                </View>
                <View style={styles.pill}>
                  <ParrotsStdText style={styles.pillText}>{vacancy}</ParrotsStdText>
                  <Feather name="users" size={11} color="#4A5A6A" />
                </View>
                <View style={styles.pill}>
                  <ParrotsStdText style={styles.pillText}>{dateLabel}</ParrotsStdText>
                  <AntDesign name="calendar" size={11} color="#4A5A6A" />
                </View>
              </View>

              <ParrotsStdText style={styles.cardDescription} numberOfLines={3} ellipsizeMode="tail">
                {he.decode(
                  cardDescription
                    .replace(/<[^>]+>/g, " ")
                    .replace(/\s+/g, " ")
                    .trim()
                )}
              </ParrotsStdText>
            </View>
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
    marginHorizontal: vw(2),
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
  header: {
    fontFamily: "Nunito_800ExtraBold",
    marginTop: 2,
    fontSize: 15,
    color: "#0A5FBF",
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
    fontFamily: "Nunito_700Bold",
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
});
