/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { format } from "date-fns";
import {
  Feather,
  FontAwesome6,
  AntDesign,
  FontAwesome5,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import he from "he";
import { Shadow } from 'react-native-shadow-2';
import { parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotBlueSemiTransparent3, parrotBlueTransparent, parrotCream } from "../assets/color";


export default function VoyageCardProfileHorizontal({
  cardHeader,
  cardDescription,
  cardImage,
  vacancy,
  startdate,
  enddate,
  vehiclename,
  vehicletype,
  voyageId,
  latitude,
  longitude,
  focusMap,
  markerImage,
}) {
  const cardImageUrl = `${cardImage}`;
  const formattedStartDate = require("date-fns").format(startdate, "MMM d");
  const formattedEndDate = require("date-fns").format(enddate, "MMM d");
  const navigation = useNavigation();

  const handleNavigation = (voyageId) => {
    navigation.navigate("Home", {
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

  const panMapOnVoyage = () => {
    focusMap(latitude, longitude);
  };

  return (


    <TouchableOpacity onPress={() => handleNavigation(voyageId)} style={styles.TouchableOpacityStyle}>
      <Shadow
        distance={12}
        offset={[0, 0]}
        startColor="rgba(0,0,0,0.08)"
        finalColor="rgba(0,0,0,0.13)"
        radius={12}
      >
        <View style={styles.cardContainerWrapper}>
          {markerImage && (
            <View style={styles.markerBadgeClip}>
              <View style={styles.markerBadgeOffset}>
                <Image source={markerImage} style={styles.markerBadge} resizeMode="contain" />
              </View>
            </View>
          )}
          <View style={styles.cardContainer}>
            <View style={styles.shadow}>
              <Image style={styles.cardImage} source={{ uri: cardImageUrl }} />
            </View>

            <View style={styles.containerContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.header}>{cardHeader}</Text>

                <View style={styles.pillRow}>
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>
                      {vehiclename?.length > 16
                        ? vehiclename.substring(0, 16) + "..."
                        : vehiclename}
                    </Text>
                    {icon}
                  </View>
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{vacancy}</Text>
                    <Feather name="users" size={11} color={parrotBlue} />
                  </View>
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{formattedStartDate + " – " + formattedEndDate}</Text>
                    <AntDesign name="calendar" size={11} color={parrotBlue} />
                  </View>
                </View>
                <Text
                  style={styles.cardDescription}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {he.decode(
                    cardDescription
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim()
                  )}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                panMapOnVoyage();
              }}
              style={styles.extendedAreaContainer}
            >
              <View style={styles.extendedArea}>
                <Text style={styles.seeOnMap}>View on map</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Shadow>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  TouchableOpacityStyle: {
    marginRight: vw(2),
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
  cardContainerWrapper: {
    backgroundColor: "white",
    borderRadius: vh(2),
    overflow: "hidden",
  },
  markerBadgeClip: {
    position: "absolute",
    top: 6,
    right: 2,
    width: 30,
    height: 30,
    zIndex: 10,
    overflow: "hidden",
    borderRadius: 17,
    backgroundColor: "rgba(0, 119, 234, 0.4)",
  },
  markerBadgeOffset: {
    position: "relative",
    left: -2,
  },
  markerBadge: {
    width: 34,
    height: 38,
  },
  containerContainer: {
    height: vh(22),
    top: 0,
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
    color: parrotBlue,
    alignSelf: "flex-end",
    position: "absolute",
    bottom: vh(0),
    right: vw(0),
  },
  cardImage: {
    width: vw(38),
    height: vh(20),
    marginRight: vh(0.5),
    borderRadius: vh(2),
    borderTopRightRadius: vh(0),
    borderBottomRightRadius: vh(0),
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
    backgroundColor: parrotBlueMediumTransparent,
    paddingHorizontal: vw(2),
    paddingVertical: 3,
    borderRadius: vw(3),
  },
  pillText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 11,
    color: parrotBlue,
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
