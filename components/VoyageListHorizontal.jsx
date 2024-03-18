/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import VoyageCardProfileHorizontal from "./VoyageCardProfileHorizontal";
import { vh, vw } from "react-native-expo-viewport-units";

export default function VoyageListHorizontal({ data, focusMap }) {
  const renderItem = ({ item }) => {
    return (
      <VoyageCardProfileHorizontal
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
        latitude={item.waypoints[0].latitude}
        longitude={item.waypoints[0].longitude}
        focusMap={focusMap}
      />
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      contentContainerStyle={styles.containerHorizontal}
    />
  );
}

const styles = StyleSheet.create({
  containerVertical: {
    borderRadius: vh(2),
  },
  containerHorizontal: {
    flexDirection: "row",
    marginLeft: vw(2),
    marginBottom: vh(13),
    marginTop: 10,
    borderRadius: vh(2),
  },
});
