/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import VoyageCardProfile from "./VoyageCardProfile";
import { vh, vw } from "react-native-expo-viewport-units";

export default function VoyageListVertical({ data, direction }) {
  const renderItem = ({ item }) => (
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
  );
  if (!data) return null;

  if (direction === "horizontal") {
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

  return (
    <View style={styles.containerVertical}>
      {data.map((item) => renderItem({ item }))}
    </View>
  );
}

const styles = StyleSheet.create({
  containerVertical: {
    marginTop: 10,
    borderRadius: vh(2),
  },
  containerHorizontal: {
    flexDirection: "row",
    marginLeft: vw(5),
    marginBottom: vh(13),
    marginTop: 10,
    borderRadius: vh(2),
  },
});
