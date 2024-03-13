/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { format } from "date-fns";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function VehicleVoyages({ voyages }) {
  const navigation = useNavigation();

  const handleNavigateToVoyage = (voyageId) => {
    console.log("navigate to voyage with id: ", voyageId);
    navigation.navigate("VoyageDetail", { voyageId });
  };

  const VoyageBaseUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/VoyageImages/`;

  const renderVehicleVoyages = () => {
    return voyages.map((item) => {
      const formattedStartDate = format(new Date(item.startDate), "MMM d, yy");
      const formattedEndDate = format(new Date(item.endDate), "MMM d, yy");

      return (
        <TouchableOpacity
          key={item.id}
          onPress={() => handleNavigateToVoyage(item.id)}
        >
          <View style={styles.singleVoyage} key={item.id}>
            <View>
              <Image
                source={{
                  uri: VoyageBaseUrl + item.profileImage,
                }}
                style={styles.voyageImage}
              />
            </View>

            <View style={{ paddingHorizontal: vw(3) }}>
              <View style={styles.nameAndVacancyContainer}>
                <Text style={styles.boldBlack}>
                  {item.name}
                  {"  "}
                </Text>
                <Text style={styles.boldBlue}>{item.vacancy} </Text>
                <Feather name="users" size={18} color="blue" />
              </View>
              <View style={styles.betweenDates}>
                <Text style={styles.boldBlack}>
                  from <Text style={styles.boldBlue}>{formattedStartDate}</Text>
                </Text>
                <Text style={styles.boldBlack}>
                  {"  "}to:{" "}
                  <Text style={styles.boldBlue}>{formattedEndDate}</Text>
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return <View style={styles.container}>{renderVehicleVoyages()}</View>;
}

const styles = StyleSheet.create({
  singleVoyage: {
    // backgroundColor: "green",
    padding: vh(1),
    margin: vh(0.3),
    flexDirection: "row",
    backgroundColor: "rgba(0, 119, 234,0.051)",
    // borderWidth: 1,
    borderColor: "rgba(10, 119, 234,0.3)",
    borderRadius: vh(3),
  },
  voyageImage: {
    height: vh(6),
    width: vh(6),
    borderRadius: vh(3),
  },
  nameAndVacancyContainer: {
    flexDirection: "row",
  },
  betweenDates: {
    flexDirection: "row",
  },
  boldBlue: {
    fontWeight: "500",
    color: "blue",
  },
  boldBlack: {
    fontWeight: "500",
    color: "black",
  },
});
