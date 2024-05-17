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
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

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
}) {
  const cardImageUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/VoyageImages/${cardImage}`;
  const formattedStartDate = require("date-fns").format(startdate, "MMM d, yy");
  const formattedEndDate = require("date-fns").format(enddate, "MMM d, yy");
  const navigation = useNavigation();

  const handleNavigation = (voyageId) => {
    // navigation.navigate("VoyageDetail", { voyageId });

    navigation.navigate("Create", {
      screen: "VoyageDetail",
      params: { voyageId: voyageId },
    });
  };

  let icon;
  switch (vehicletype) {
    case 0:
      icon = <FontAwesome6 name="sailboat" size={12} color="blue" />;
      break;
    case 1:
      icon = <AntDesign name="car" size={12} color="blue" />;
      break;
    case 2:
      icon = <FontAwesome5 name="caravan" size={12} color="blue" />;
      break;
    case 3:
      icon = <Ionicons name="bus-outline" size={12} color="blue" />;
      break;
    case 4:
      icon = <FontAwesome5 name="walking" size={12} color="blue" />;
      break;
    case 5:
      icon = <FontAwesome5 name="running" size={12} color="blue" />;
      break;
    case 6:
      icon = <FontAwesome name="motorcycle" size={12} color="blue" />;
      break;
    case 7:
      icon = <FontAwesome name="bicycle" size={12} color="blue" />;
      break;
    case 8:
      icon = <FontAwesome6 name="house" size={12} color="blue" />;
      break;
    case 9:
      icon = <Ionicons name="airplane-outline" size={12} color="blue" />;
      break;
    default:
      icon = "help-circle";
      break;
  }

  // let x = "1234567890123456789012345";
  return (
    <TouchableOpacity onPress={() => handleNavigation(voyageId)}>
      <View style={styles.cardContainer}>
        <View style={styles.shadow}>
          <Image style={styles.cardImage} source={{ uri: cardImageUrl }} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.header}>{cardHeader}</Text>

          <View style={styles.vacancyAndVehicle}>
            <View>
              <Text style={styles.subHeader}>
                {/* {vehiclename + "111 "} */}
                {vehiclename.length > 21
                  ? vehiclename.substring(0, 21) + "..."
                  : vehiclename}
                {"  "}
                {icon}
              </Text>
            </View>
          </View>

          <View style={styles.vacancyAndVehicle}>
            <View>
              <Text style={styles.subHeader2}>
                {vacancy + " "}
                <Feather name="users" size={12} color="blue" />
              </Text>
            </View>
            <Text style={styles.subHeader3}>
              {formattedStartDate + " - " + formattedEndDate + "  "}
              <AntDesign name="calendar" size={12} color="blue" />
            </Text>
          </View>
          <Text
            style={styles.cardDescription}
            numberOfLines={5}
            ellipsizeMode="tail"
          >
            {cardDescription}
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
    marginBottom: 10,
    flexDirection: "row",
    height: vh(20),
    backgroundColor: "rgba(0, 119, 234,0.03)",
    borderRadius: vh(2),
    // borderWidth: 3,
    borderColor: "rgba(10, 119, 234,0.2)",
  },
  imageContainer: {
    backgroundColor: "white",
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
    padding: vh(0.2),
  },
  header: {
    //margintop

    marginTop: 2,
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(0, 119, 234,1)",
    paddingVertical: vh(0.2),
    alignSelf: "center",
  },

  subHeader: {
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "rgba(0, 119, 234,0.1)",
    borderColor: "rgba(0, 119, 234,0.2)",
    // borderWidth: 1,
    paddingHorizontal: vh(0.5),
    marginTop: vh(0.2),
    borderRadius: vw(2),
  },
  subHeader2: {
    fontSize: 10,
    fontWeight: "600",
    backgroundColor: "rgba(0, 119, 234,0.1)",
    borderColor: "rgba(0, 119, 234,0.2)",
    // borderWidth: 1,
    paddingHorizontal: vh(0.5),
    marginTop: vh(0.2),
    borderRadius: vw(2),
  },
  subHeader3: {
    fontSize: 10,
    fontWeight: "600",
    backgroundColor: "rgba(0, 119, 234,0.1)",
    borderColor: "rgba(0, 119, 234,0.2)",
    // borderWidth: 1,
    paddingHorizontal: vh(1),
    marginTop: vh(0.1),
    borderRadius: vw(2),
  },
  cardDescription: {
    paddingTop: vh(0.6),
    paddingHorizontal: 0,
    fontSize: 11.5,
  },
  vacancyAndVehicle: {
    flexDirection: "row",
    // backgroundColor: "pink",
    justifyContent: "space-around",
  },
});
