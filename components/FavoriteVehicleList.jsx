/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View } from "react-native";
import FavoriteVehicleCardProfile from "./FavoriteVehicleCardProfile";
import { vh } from "react-native-expo-viewport-units";
import { Shadow } from "react-native-shadow-2";

export default function FavoriteVehicleList({ data }) {
  const renderVehicleCards = () => {
    return data.map((item) => {
      return (
        <Shadow
          distance={6}
          offset={[0, 0]}
          startColor="rgba(0,0,0,0.08)"
          finalColor="rgba(0,0,0,0.23)"
          radius={12}
          style={{ borderRadius: vh(2), marginBottom: vh(1.3) }}
          key={item.id}
        >
          <FavoriteVehicleCardProfile
            key={item.id}
            vehiclename={item.name}
            description={item.description}
            cardImage={item.profileImageUrl}
            vehicletype={item.type}
            capacity={item.capacity}
            vehicleId={item.id}
          />
        </Shadow>
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
