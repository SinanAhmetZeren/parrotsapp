/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View, FlatList, Text, Image } from "react-native";
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

  if (data.length === 0) {
    return (
      <View style={styles.mainBidsContainer2}>
        <View style={styles.currentBidsAndSeeAll2}>
          <Image
            source={require("../assets/ParrotsWhiteBg.png")}
            style={styles.logoImage}
          />
          <Text style={styles.currentBidsTitle2}>
            No voyages here... {"\n"}
            Shove off and seek elsewhere!
          </Text>
        </View>
      </View>
    );
  }

  if (data)
    return (
      <FlatList
        key={data}
        data={data}
        extraData={data}
        renderItem={renderItem}
        // keyExtractor={(item) => item.id.toString()}
        keyExtractor={(item) => item.id}
        horizontal
        contentContainerStyle={styles.containerHorizontal}
      />
    );
}

const styles = StyleSheet.create({
  logoImage: {
    height: vh(13),
    width: vh(13),
    borderRadius: vh(10),
  },
  mainBidsContainer2: {
    borderRadius: vw(5),
  },
  currentBidsAndSeeAll2: {
    alignItems: "center",
    alignSelf: "center",
  },
  currentBidsTitle2: {
    fontSize: 17,
    fontWeight: "700",
    color: "#3c9dde",
    textAlign: "center",
  },

  containerHorizontal: {
    flexDirection: "row",
    marginLeft: vw(2),
    marginBottom: vh(0),
    marginTop: 10,
    borderRadius: vh(2),
  },
});
