import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { Feather, FontAwesome6, AntDesign, FontAwesome5, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import he from "he";
import {
  parrotBlue,
  parrotBoatPurple, parrotCarRed, parrotCaravanOrangeRed, parrotBusYellowGreen,
  parrotWalkTurquoise, parrotRunLightOrange, parrotMotorcycleDarkRed, parrotBicycleTealGreen,
  parrotTinyHouseLightYellow, parrotAirplaneLightGreen, parrotTrainPink,
} from "../assets/color";

const vehicleColors = {
  0: parrotBoatPurple, 1: parrotCarRed, 2: parrotCaravanOrangeRed, 3: parrotBusYellowGreen,
  4: parrotWalkTurquoise, 5: parrotRunLightOrange, 6: parrotMotorcycleDarkRed,
  7: parrotBicycleTealGreen, 8: parrotTinyHouseLightYellow, 9: parrotAirplaneLightGreen, 10: parrotTrainPink,
};

const vehicleTypeNames = ["Boat", "Car", "Caravan", "Bus", "Walk", "Run", "Motorcycle", "Bicycle", "TinyHouse", "Airplane", "Train"];

export default function FavoriteVehicleCardProfile({ vehicleId, vehiclename, description, cardImage, vehicletype, capacity }) {
  const vColor = vehicleColors[vehicletype] ?? "#0A77EA";

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

  const vehicleTypeName = vehicleTypeNames[vehicletype] ?? "";
  const navigation = useNavigation();

  const handleNavigateToVehicle = (id) => {
    navigation.navigate("Favorites", { screen: "VehicleDetail", params: { vehicleId: id } });
  };

  return (
    <TouchableOpacity onPress={() => handleNavigateToVehicle(vehicleId)}>
      <View style={[styles.cardContainerWrapper, { backgroundColor: "white", borderColor: "#E8E3DC" }]}>
        <View style={styles.cardContainer}>
          <Image style={styles.cardImage} source={{ uri: cardImage }} resizeMode="cover" />
          <View style={styles.textContainer}>
            <ParrotsStdText numberOfLines={1} style={[styles.headerName, { color: "#0A5FBF" }]}>{vehiclename}</ParrotsStdText>
            <View style={styles.pillRow}>
              <View style={[styles.pillView, { backgroundColor: vColor + "15" }]}>
                <ParrotsStdText style={[styles.pillText, { color: vColor }]} numberOfLines={1}>{vehicleTypeName}</ParrotsStdText>
                {icon}
              </View>
              <View style={styles.pillView}>
                <ParrotsStdText style={styles.pillText}>{capacity > 100 ? "100+" : capacity}</ParrotsStdText>
                <Feather name="users" size={11} color="#4A5A6A" />
              </View>
            </View>
            <ParrotsStdText style={styles.cardDescription} numberOfLines={4} ellipsizeMode="tail">
              {he.decode(description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())}
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
    borderWidth: 1,
    overflow: "hidden",
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
    width: vw(46),
    height: vh(20),
  },
  textContainer: {
    width: vw(46),
    paddingHorizontal: vw(2),
    paddingTop: vh(1),
    alignSelf: "flex-start",
  },
  headerName: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
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
    color: "#4A5A6A",
    backgroundColor: "#F4F7FB",
    paddingHorizontal: vw(2),
    paddingVertical: 3,
    borderRadius: vw(3),
  },
  pillView: {
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
