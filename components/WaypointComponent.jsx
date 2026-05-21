/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/prop-types */
import React from "react";
import { memo } from "react";
import { View, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import MapView, { Marker, Callout, Polyline } from "react-native-maps";
import { parrotBlue } from "../assets/color";


export const WaypointComponent = memo(({
  index,
  latitude,
  longitude,
  pinColor,
  id
}) => {
  const coords = { latitude, longitude };

  return (
    <Marker
      coordinate={coords}
      pinColor={pinColor}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={false}
    />
  );
});



export const WaypointComponent2 = ({
  index,
  latitude,
  longitude,
  title,
  pinColor,
  id
}) => {
  const coords = { latitude, longitude };
  const viewKey = `waypoint-${id}-${index}-view`;
  const markerKey = `waypoint-${id}-${index}-marker`;

  return (
    <View key={viewKey}>
      <Marker
        key={markerKey}
        coordinate={coords}
        pinColor={pinColor}
        anchor={{ x: 0.5, y: 1 }}
        tracksViewChanges={false}
      />
    </View>
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
    color: parrotBlue,
    textAlign: "center",
  },
});
