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
        <Callout style={styles.calloutContainer}>
          <Text style={styles.calloutText}>{title}</Text>
        </Callout>
      </Marker>
    </>
  );
};

const styles = StyleSheet.create({
  calloutContainer: {
    width: vw(50),
    height: vh(5.5),
    justifyContent: "center",
    borderRadius: vh(5),
  },
  calloutText: {
    fontWeight: "700",
    fontSize: 13,
    color: "#186ff1",
    textAlign: "center",
  },
});
