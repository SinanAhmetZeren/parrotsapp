/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { format } from "date-fns";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
import { parrotBlueMediumTransparent, parrotCream, parrotDarkBlue } from "../assets/color";
import { Shadow } from "react-native-shadow-2";

export default function VehicleVoyages({ voyages }) {
  const navigation = useNavigation();

  const handleNavigateToVoyage = (voyageId) => {
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


  const renderVehicleVoyages = () => {
    return voyages.map((item) => {
      const formattedStartDate = format(new Date(item.startDate), "MMM d, yy");
      const formattedEndDate = format(new Date(item.endDate), "MMM d, yy");

      return (
        <Shadow
          key={item.id}
          distance={8}
          offset={[0, 0]}
          startColor="rgba(0,0,0,0.08)"
          finalColor="rgba(0,0,0,0.13)"
          radius={12}
          style={{ borderRadius: vh(3), marginBottom: vh(1), width: "100%" }}
        >
        <TouchableOpacity
          onPress={() => handleNavigateToVoyage(item.id)}
        >
          <View style={styles.singleVoyage}>
            <Image
              source={{ uri: item.profileImageThumbnail || item.profileImage }}
              style={styles.voyageImage}
            />
            <Text style={styles.voyageName} numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </Text>
            <View style={styles.pill}>
              <Feather name="calendar" size={13} color={parrotDarkBlue} />
              <Text style={styles.pillText}>{formattedStartDate} – {formattedEndDate}</Text>
            </View>
            <View style={styles.pill}>
              <Feather name="users" size={13} color={parrotDarkBlue} />
              <Text style={styles.pillText}>{item.vacancy}</Text>
            </View>
          </View>
        </TouchableOpacity>
        </Shadow>
      );
    });
  };

  return <View>{renderVehicleVoyages()}</View>;
}

const styles = StyleSheet.create({
  singleVoyage: {
    paddingVertical: vh(1),
    paddingHorizontal: vw(3),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: parrotCream,
    borderRadius: vh(3),
    gap: vw(2),
  },
  voyageImage: {
    height: vh(5),
    width: vh(5),
    borderRadius: vh(3),
  },
  voyageName: {
    flex: 1,
    fontWeight: "600",
    color: parrotDarkBlue,
    fontSize: 13,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: parrotBlueMediumTransparent,
    borderRadius: vw(5),
    paddingHorizontal: vw(2),
    paddingVertical: vh(0.5),
    gap: 4,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "500",
    color: parrotDarkBlue,
  },
});
