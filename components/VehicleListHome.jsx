/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View } from "react-native";
import VehicleCardProfileHome from "./VehicleCardProfileHome";
import { vh } from "react-native-expo-viewport-units";

export default function VehicleListHome({ data }) {
  const renderVehicleCards = () => {
    return data.map((item) => {
      return (
        <VehicleCardProfileHome
          key={item.id}
          vehiclename={item.name}
          description={item.description}
          cardImage={item.profileImageUrl}
          vehicletype={item.type}
          capacity={item.capacity}
          vehicleId={item.id}
        />
      );
    });
  };

  return <View style={styles.container}>{renderVehicleCards()}</View>;
}

const styles = StyleSheet.create({
  container: {
    // marginBottom: vh(13),
    marginTop: 10,
    borderRadius: vh(2),
  },
});
