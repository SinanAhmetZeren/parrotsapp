import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View, FlatList,  Image } from "react-native";
import VoyageCardProfileHorizontal from "./VoyageCardProfileHorizontal";
import PlaceCardHorizontal from "./PlaceCardHorizontal";
import { vh, vw } from "react-native-expo-viewport-units";
import { parrotLightBlue } from "../assets/color";

export default function VoyageListHorizontal({ data, focusMap, navigation }) {
  const renderItem = ({ item }) => {
    if (item.placeType > 0) {
      return (
        <PlaceCardHorizontal
          key={item.id}
          cardHeader={item.name}
          cardDescription={item.description}
          cardImage={item.profileImageThumbnail || item.profileImage}
          link={item.brief}
          latitude={item.waypoints[0]?.latitude}
          longitude={item.waypoints[0]?.longitude}
          focusMap={focusMap}
          placeType={item.placeType}
        />
      );
    }
    return (
      <VoyageCardProfileHorizontal
        key={item.id}
        voyageId={item.id}
        cardHeader={item.name}
        cardDescription={item.brief}
        cardImage={item.profileImageThumbnail || item.profileImage}
        vacancy={item.vacancy}
        startdate={item.startDate}
        enddate={item.endDate}
        vehiclename={item.vehicle?.name}
        vehicletype={item.vehicle?.type}
        latitude={item.waypoints[0]?.latitude}
        longitude={item.waypoints[0]?.longitude}
        focusMap={focusMap}
        markerImage={item.markerImage}
        navigation={navigation}
      />
    );
  };

  if (data?.length === 0) {
    return (
      <View style={styles.mainBidsContainer2}>
        <View style={styles.currentBidsAndSeeAll2}>
          <Image
            source={require("../assets/parrotslogo.png")}
            style={styles.logoImage}
          />
          <ParrotsStdText style={styles.currentBidsTitle2}>
            Nothing here at this time{"\n"}Explore a different area
          </ParrotsStdText>
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
        keyExtractor={(item) => item.id}
        horizontal
        centerContent={data?.length === 1}
        contentContainerStyle={[
          styles.containerHorizontal,
          data?.length === 1 && { marginLeft: 0, justifyContent: "center", width: "100%" },
        ]}
        ListFooterComponent={<View style={{ width: vw(4) }} />}
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
    color: parrotLightBlue,
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
