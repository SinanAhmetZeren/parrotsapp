/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, FlatList } from "react-native";
import VehicleCard from "./VehicleCard";

export default function VehicleFlatList() {
  const data = [
    {
      id: "1",
      cardHeader: "Header 1z",
      cardSubHeader: "Subheader 1",
      cardDescription:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 1",
    },
    {
      id: "2",
      cardHeader: "Header 2",
      cardSubHeader: "Subheader 2",
      cardDescription:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 2",
    },
    {
      id: "3",
      cardHeader: "Header 3",
      cardSubHeader: "Subheader 3",
      cardDescription:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 3",
    },
  ];

  const renderItem = ({ item }) => (
    <VehicleCard
      cardHeader={item.cardHeader}
      cardSubHeader={item.cardSubHeader}
      cardDescription={item.cardDescription}
    />
  );

  return (
    <FlatList
      style={styles.flatList}
      horizontal={true}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    height: 200,
    backgroundColor: "turquoise",
    marginBottom: 50,
  },
});
