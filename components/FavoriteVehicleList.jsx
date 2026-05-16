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
        <View key={item.id} style={{ marginBottom: vh(1.3) }}>
          <FavoriteVehicleCardProfile
            key={item.id}
            vehiclename={item.name}
            description={item.description}
            cardImage={item.profileImageThumbnailUrl || item.profileImageUrl}
            vehicletype={item.type}
            capacity={item.capacity}
            vehicleId={item.id}
          />
        </View>
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
