/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
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
import { API_URL } from "@env";
import { parrotTextDarkBlue, parrotBlue, parrotBlueMediumTransparent, parrotCream } from "../assets/color";
import he from "he";

export default function FavoriteVehicleCardProfile({
  vehicleId,
  vehiclename,
  description,
  cardImage,
  vehicletype,
  capacity,
}) {
  const cardImageUrl = `${cardImage}`;
  let icon;
  switch (vehicletype) {
    case 0:
      icon = (
        <FontAwesome6
          name="sailboat"
          size={16}
          color={parrotBlue}
          style={styles.icon}
        />
      );
      break;
    case 1:
      icon = (
        <AntDesign
          name="car"
          size={16}
          color={parrotBlue}
          style={styles.icon}
        />
      );
      break;
    case 2:
      icon = (
        <FontAwesome5
          name="caravan"
          size={16}
          color={parrotBlue}
          style={styles.icon}
        />
      );
      break;
    case 3:
      icon = (
        <Ionicons
          name="bus-outline"
          size={16}
          color={parrotBlue}
          style={styles.icon}
        />
      );
      break;
    case 4:
      icon = (
        <FontAwesome5
          name="walking"
          size={16}
          color={parrotBlue}
          style={styles.icon}
        />
      );
      break;
    case 5:
      icon = (
        <FontAwesome5
          name="running"
          size={16}
          color={parrotBlue}
          style={styles.icon}
        />
      );
      break;
    case 6:
      icon = (
        <FontAwesome
          name="motorcycle"
          size={16}
          color={parrotBlue}
          style={styles.icon}
        />
      );
      break;
    case 7:
      icon = (
        <FontAwesome
          name="bicycle"
          size={16}
          color={parrotBlue}
          style={styles.icon}
        />
      );
      break;
    case 8:
      icon = (
        <FontAwesome6
          name="house"
          size={16}
          color={parrotBlue}
          style={styles.icon}
        />
      );
      break;
    case 9:
      icon = (
        <Ionicons
          name="airplane-outline"
          size={16}
          color={parrotBlue}
          style={styles.icon}
        />
      );
      break;
    case 10:
      icon = (
        <Ionicons
          name="train-outline"
          size={16}
          color={parrotBlue}
          style={styles.icon}
        />
      );
      break;
    default:
      icon = "help-circle";
      break;
  }

  const vehicleTypeNames = ["Boat", "Car", "Caravan", "Bus", "Walk", "Run", "Motorcycle", "Bicycle", "TinyHouse", "Airplane", "Train"];
  const vehicleTypeName = vehicleTypeNames[vehicletype] ?? "";

  const navigation = useNavigation();
  const handleNavigateToVehicle = (vehicleId) => {
    // navigation.navigate("VehicleDetail", { vehicleId });

    navigation.navigate("Favorites", {
      screen: "VehicleDetail",
      params: { vehicleId: vehicleId },
    });
  };

  return (
    <TouchableOpacity onPress={() => handleNavigateToVehicle(vehicleId)}>
      <View style={styles.cardContainer}>
        <View style={styles.shadow}>
          <Image style={styles.cardImage} source={{ uri: cardImageUrl }} />
        </View>

        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.headerName}>
            {vehiclename}
          </Text>
          <View style={styles.pillRow}>
            <Text style={styles.pill}>{icon}{"  "}{vehicleTypeName}</Text>
            <View style={styles.pillView}>
              <Text style={styles.pillText}>{capacity > 100 ? "100+" : capacity}</Text>
              <Feather name="users" size={11} color={parrotBlue} />
            </View>
          </View>
          <Text style={styles.cardDescription}
            numberOfLines={4}
            ellipsizeMode="tail"
          >
            {he.decode(
              description
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
            )}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    // marginBottom: 10,
    flexDirection: "row",
    height: vh(20),
    backgroundColor: "rgba(0, 119, 234, 0.04)",
    borderRadius: vh(2),
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
    paddingHorizontal: vw(2),
    paddingTop: vh(1),
    alignSelf: "flex-start",
  },
  headerName: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: parrotBlue,
    alignSelf: "flex-start",
    paddingVertical: vh(0.2),
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: vh(0.5),
  },
  pill: {
    fontFamily: "Nunito_700Bold",
    fontSize: 11,
    color: parrotBlue,
    backgroundColor: "rgba(0, 119, 234, 0.06)",
    paddingHorizontal: vw(2),
    paddingVertical: 3,
    borderRadius: vw(3),
  },
  pillView: {
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
  cardDescription: {
    fontFamily: "Nunito_700Bold",
    paddingTop: vh(0.6),
    paddingHorizontal: 0,
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 17,
  },
});
