/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/prop-types */
import React from "react";
import { useState } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import MapView, { Marker, Callout, Polyline } from "react-native-maps";

export const WaypointComponent = ({
  description,
  latitude,
  longitude,
  profileImage,
  title,
  pinColor,
}) => {
  const coords = { latitude, longitude };

  return (
    <>
      <Marker coordinate={coords} pinColor={pinColor}>
        <Callout>
          <View>
            <Text>{title}</Text>
            <Text>{description}</Text>
            {profileImage && (
              <Image
                source={{ uri: profileImage }}
                style={{ width: 100, height: 100 }}
              />
            )}
          </View>
        </Callout>
      </Marker>
    </>
  );
};

const styles = StyleSheet.create({
  rectangularBox: {
    height: vh(27),
    backgroundColor: "white",
  },
  imageContainer: {
    top: vh(5),
    height: vh(29),
  },
  voyageDetailsContainer: {
    marginTop: vh(2),
    backgroundColor: "rgba(0, 119, 234,0.071)",
    // borderWidth: 1,
    borderColor: "rgba(10, 119, 234,0.2)",
    padding: 4,
    borderRadius: vh(2),
  },
  OwnerAndBoat: {
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 1,
  },
  voyageOwner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: vh(5),
    marginTop: vh(1),
    marginHorizontal: vw(2),
    paddingVertical: vh(0.3),
    paddingHorizontal: vw(2),
    backgroundColor: "rgba(0, 119, 234,0.1)",
    // borderWidth: 1,
    borderColor: "rgba(10, 119, 234,0.3)",
  },
  voyageBoat: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: vh(5),
    marginTop: vh(1),
    marginHorizontal: vw(2),
    backgroundColor: "rgba(0, 119, 234,0.1)",
    // borderWidth: 1,
    borderColor: "rgba(10, 119, 234,0.3)",
    paddingVertical: vh(0.3),
    paddingHorizontal: vw(2),
  },
  VoyagePropsBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 1,
  },
  VoyageProps: {
    flexDirection: "row",
    paddingHorizontal: vh(0.9),
    paddingVertical: vh(0.2),
    marginTop: vh(0.2),
    marginHorizontal: vw(1),
    borderRadius: vw(3),
    backgroundColor: "rgba(0, 119, 234,0.1)",
    // borderWidth: 1,
    borderColor: "rgba(10, 119, 234,0.3)",
  },
  propTextDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: "blue",
  },
  propText: {
    fontSize: 14,
    fontWeight: "600",
  },

  priceInputContainer: {
    flexDirection: "row",
  },
  bidButtonContainer: {
    backgroundColor: "#186ff1",
    borderRadius: vh(2),
    borderColor: "#3c9ede",
    // borderWidth: 3,
    marginBottom: vh(35),
    width: vw(60),
    alignSelf: "center",
    marginTop: vh(1),
    height: vh(5),
    justifyContent: "center",
  },
  createBidButton: {
    fontSize: 22,
    color: "white",
    alignSelf: "center",
    fontWeight: "700",
    letterSpacing: 1,
  },
  bidModalContainer: {
    backgroundColor: "#06d1d3",
    padding: vh(4),
    margin: vh(5),
  },
  ScrollView: {
    backgroundColor: "white",
  },
  mapAndEmojisContainer: {
    height: vh(40),
    padding: vh(0.5),
    width: "98%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: vh(2),
    marginTop: vh(5),
  },
  mapContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 20,
    borderColor: "#93c9ed",
    // borderWidth: 3,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: vw(10),
  },
  heartContainer1: {
    position: "absolute",
    bottom: vh(-1),
    right: vw(15),
  },
  heartContainer2: {
    padding: vw(1),
    width: vw(8),
    backgroundColor: "white",
    borderRadius: vh(5),
  },
  shareContainer1: {
    position: "absolute",
    bottom: vh(-1),
    right: vw(5),
  },
  shareContainer2: {
    padding: vw(1),
    width: vw(8),
    backgroundColor: "white",
    borderRadius: vh(5),
  },
  VoyageNameAndUsername: {
    padding: vh(1),
    margin: vh(0.5),
    marginTop: vh(0.5),
  },
  DescriptionContainer: {
    padding: vh(1),
    margin: vh(0.5),
    marginTop: vh(0.5),
  },
  descriptionInnerContainer: {
    marginVertical: vh(0.2),
  },
  ReadMoreLess: {
    color: "blue",
  },
  subContainer: {
    backgroundColor: "blue",
    padding: vh(1),
    margin: vh(0.5),
    marginTop: vh(0.5),
  },
  innerContainer: {
    marginVertical: vh(0.2),
    backgroundColor: "honeydew",
  },
  voyageName: {
    fontSize: 24,
    fontWeight: "700",
    alignSelf: "center",
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: vh(0.2),
    color: "blue",
  },

  voyageImage: {
    height: vh(13),
    width: vh(13),
    marginRight: vh(1),
    borderRadius: vh(1.5),
  },
  ImagesSubContainer: {
    paddingHorizontal: vh(1),
    marginTop: vh(0.5),
  },
  bidImage: {
    width: vh(5),
    height: vh(5),
    borderRadius: vh(2.5),
    marginRight: 8,
    backgroundColor: "grey",
  },
  profileImage: {
    width: vh(3),
    height: vh(3),
    borderRadius: vh(2.5),
    marginRight: 8,
    backgroundColor: "grey",
  },
  bidUsername: {
    fontSize: 17,
    fontWeight: "700",
    width: vw(50),
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4aa5e1",
    width: vw(23),
    textAlign: "right",
  },
  currentBidsTitle: {
    paddingLeft: vw(2),
    fontSize: 25,
    fontWeight: "700",
    color: "#1c71a9",
  },
  mainBidsContainer: {
    backgroundColor: "#f2fafa",
    borderRadius: vw(5),
    marginHorizontal: vw(2),
    borderColor: "#93c9ed",
    // borderWidth: 2,
  },
  allBidsContainer: {
    // backgroundColor: "blue",
    margin: vh(1),
    padding: vh(0),
  },
  singleBidContainer: {
    flexDirection: "row",
    padding: vh(0.5),
    margin: vh(0.3),
    alignItems: "center",
    borderRadius: vh(3),
    backgroundColor: "rgba(0, 119, 234,0.1)",
    // borderWidth: 1,
    borderColor: "rgba(10, 119, 234,0.3)",
  },

  // BID FLATLIST STYLES
  BidsFlatList: {
    width: vw(85),
    height: vh(90),
    alignSelf: "center",
    backgroundColor: "#f2fafa",
    borderColor: "#bfdff4",
    // borderWidth: 2,
    borderRadius: vh(2),
    padding: vh(1),
  },
  singleBidContainer2: {
    flexDirection: "row",
    padding: vh(0.1),
    margin: vh(0.3),
    alignItems: "center",
  },
  bidImage2: {
    width: vh(5),
    height: vh(5),
    borderRadius: vh(2.5),
    marginRight: 8,
    backgroundColor: "grey",
  },
  bidUsername2: {
    fontSize: 17,
    fontWeight: "700",
    width: vw(45),
  },
  offerPrice2: {
    fontSize: 18,
    fontWeight: "800",
    color: "blue",
    width: vw(25),
    textAlign: "right",
  },
  currentBidsTitle2: {
    paddingLeft: vw(2),
    fontSize: 25,
    fontWeight: "700",
    color: "blue",
  },
  currentBidsContainer2: {
    width: vw(90),
  },
  allBidsContainer2: {
    margin: vh(1),
    padding: vh(0),
    backgroundColor: "red",
  },
  // BID FLATLIST STYLES - END
  currentBidsAndSeeAll: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: vw(10),
    alignItems: "center",
  },
  seeAllButton: {
    color: "#3c9dde",
    fontWeight: "700",
    fontSize: 16,
  },
  voyageDataWrapper: {
    backgroundColor: "white",
    paddingTop: vh(1),
    borderRadius: vh(5),
  },
  VoyageDataContainer: {
    // backgroundColor: "#f2fafa",

    borderRadius: vh(5),
    marginHorizontal: vw(2),
    // marginBottom: vh(2),
    // borderColor: "#93c9ed",
    // borderWidth: 2,
  },
  closeButtonInModal: {
    alignSelf: "flex-end",
    marginRight: vw(10),
    backgroundColor: "#f2fafa",
    borderRadius: vw(5),
    borderColor: "#93c9ed",
    // borderWidth: 2,
    padding: vw(1),
    paddingHorizontal: vw(3),
    marginTop: vh(1),
  },

  closeTextInModal: {
    color: "#3c9dde",
    fontWeight: "700",
    fontSize: 16,
  },
});
