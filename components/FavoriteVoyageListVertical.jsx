/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import FavoriteVoyageCardProfile from "./FavoriteVoyageCardProfile";
import { vh, vw } from "react-native-expo-viewport-units";
import { Shadow } from "react-native-shadow-2";

export default function FavoriteVoyageList({ data, direction }) {
  const renderItem = ({ item }) => (

    <Shadow
      distance={6}
      offset={[0, 0]}
      startColor="rgba(0,0,0,0.08)"
      finalColor="rgba(0,0,0,0.23)"
      radius={12}
      style={{ borderRadius: vh(2), marginBottom: vh(1.3) }}
      key={item.id}
    >
      <FavoriteVoyageCardProfile
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
    </Shadow>
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
