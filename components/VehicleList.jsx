/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View } from "react-native";
import VehicleCard from "./VehicleCard";

export default function VehicleList({ data }) {
  console.log(data);
  const data1 = [
    {
      id: "1",
      cardHeader: "Header 1z",
      cardSubHeader: "Subheader 1",
      cardDescription:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 1",
      cardImage: require("../assets/sailboat.jpg"),
    },
    {
      id: "2",
      cardHeader: "Header 2",
      cardSubHeader: "Subheader 2",
      cardDescription:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 2",
      cardImage: require("../assets/boatvietnam.jpg"),
    },
    {
      id: "3",
      cardHeader: "Header 3",
      cardSubHeader: "Subheader 3",
      cardDescription:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 3",
      cardImage: require("../assets/catamaran.jpeg"),
    },
    {
      id: "4",
      cardHeader: "Header 4",
      cardSubHeader: "Subheader 4",
      cardDescription:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 2",
      cardImage: require("../assets/boatvietnam.jpg"),
    },
    {
      id: "5",
      cardHeader: "Header 5",
      cardSubHeader: "Subheader 5",
      cardDescription:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 3",
      cardImage: require("../assets/catamaran.jpeg"),
    },
  ];

  const renderVehicleCards = () => {
    return data1.map((item) => (
      <VehicleCard
        key={item.id}
        cardHeader={item.cardHeader}
        cardSubHeader={item.cardSubHeader}
        cardDescription={item.cardDescription}
        cardImage={item.cardImage}
      />
    ));
  };

  return <View style={styles.container}>{renderVehicleCards()}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom: 50,
  },
});
