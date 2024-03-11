/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/prop-types */
import React from "react";
import { useState } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import MapView, { Marker, Callout, Polyline } from "react-native-maps";

export const RenderPolylinesComponent = ({ waypoints }) => {
  const coordinates = waypoints.map((marker) => {
    return { latitude: marker.latitude, longitude: marker.longitude };
  });

  return (
    <Polyline
      coordinates={coordinates}
      strokeColor="#1468fb" // Change the color as needed
      strokeWidth={3}
      lineCap="butt"
      lineDashPattern={[20, 7]}
      geodesic={true}
      lineJoin="round" // Example line join
    />
  );
};
