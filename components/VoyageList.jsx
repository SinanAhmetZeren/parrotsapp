/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View } from "react-native";
import VoyageCardProfile from "./VoyageCardProfile";
import { vh } from "react-native-expo-viewport-units";

export default function VoyageList({ data }) {
  const renderVoyageCards = () => {
    return data.map((item) => (
      <VoyageCardProfile
        key={item.id}
        voyageId={item.id}
        cardHeader={item.name}
        cardDescription={item.brief}
        cardImage={item.profileImage}
        vacancy={item.vacancy}
        startdate={item.startDate}
        enddate={item.endDate}
        vehiclename={item.vehicle.name}
        vehicletype={item.vehicle.type}
      />
    ));
  };

  return <View style={styles.container}>{renderVoyageCards()}</View>;
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "",
    marginBottom: vh(13),
    marginTop: 10,
    borderRadius: vh(2),
  },
});
