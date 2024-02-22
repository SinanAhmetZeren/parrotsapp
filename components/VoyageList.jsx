/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View } from "react-native";
import VoyageCardProfile from "./VoyageCardProfile";
import { vh } from "react-native-expo-viewport-units";

export default function VoyageList({ data }) {
  // console.log(data);
  const data12 = [
    {
      id: "1",
      cardHeader: "Header 1z",
      cardSubHeader: "Subheader 1",
      cardDescription:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doomnis iste natus error sit voluptatem accusantium doloremque laudantium, 1",
      cardImage: require("../assets/sailboat.jpg"),
    },
    {
      id: "2",
      cardHeader: "Header 2",
      cardSubHeader: "Subheader 2",
      cardDescription:
        "Sed ut perspiciatis unde omnisunde omnis iste natus err iste natus error sitomnis iste natus error sit voluptatem accusantium doomnis iste natus error sit voluptatem accusantium do voluptatem accusantium doloremque laudantium, 2",
      cardImage: require("../assets/boatvietnam.jpg"),
    },
    {
      id: "3",
      cardHeader: "Header 3",
      cardSubHeader: "Subheader 3",
      cardDescription:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem aomnis iste natus error sit voluptatem accusantium doomnis iste natus error sit voluptatem accusantium doccusantium doloremque laudantium, 3",
      cardImage: require("../assets/catamaran.jpeg"),
    },
    {
      id: "4",
      cardHeader: "Header 4",
      cardSubHeader: "Subheader 4",
      cardDescription:
        "Sed ut perspiciatis unde omnis iste natus errunde omnis iste natus error sit voluptatem accusantiomnis iste natus error sit voluptatem accusantium doomnis iste natus error sit voluptatem accusantium doum doloremque laudantium, 2",
      cardImage: require("../assets/motorcycle.jpeg"),
    },
    {
      id: "5",
      cardHeader: "Header 5",
      cardSubHeader: "Subheader 5",
      cardDescription:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium omnis iste natus error sit voluptatem accusantium dodoloremque laudantium, 3",
      cardImage: require("../assets/caravan.jpeg"),
    },
  ];

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
