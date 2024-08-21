/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View } from "react-native";
import FavoriteVehicleCardProfile from "./FavoriteVehicleCardProfile";
import { vh } from "react-native-expo-viewport-units";

export default function FavoriteVehicleList({ data }) {
  const renderVehicleCards = () => {
    return data.map((item) => {
      return (
        <FavoriteVehicleCardProfile
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
    marginTop: 10,
    borderRadius: vh(2),
  },
});
