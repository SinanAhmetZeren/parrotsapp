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
import RenderHtml from "react-native-render-html";
import { parrotTextDarkBlue, parrotBlue, parrotCream } from "../assets/color";
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
          <View style={styles.iconAndName}>
            <View style={styles.icon}>{icon}</View>
            <View style={styles.name}>
              <Text
                style={styles.headerName}
                numberOfLines={1}
              >{vehiclename}</Text>
            </View>
            <View style={styles.vacancy}>
              <Text style={styles.header}>
                <Feather name="users" size={14} color={parrotBlue} />
                {" " + capacity}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: vh(14),
              overflow: "hidden",
            }}
          >
            <Text style={styles.cardDescription}
              numberOfLines={8}
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
    backgroundColor: parrotCream,
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
    paddingHorizontal: vh(0.5),
  },
  header: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "700",
    color: parrotBlue,
  },
  cardDescription: {
    paddingHorizontal: 0,
    fontSize: 11.5,
  },
  iconAndName: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  icon: {
    alignSelf: "center",
  },
  name: {
    flex: 1,
    alignSelf: "center",
  },
  vacancy: {
    paddingRight: vw(1),
  },
  headerName: {
    fontSize: 14,
    fontWeight: "700",
    color: parrotBlue,
    textAlign: "center",
  },
});
