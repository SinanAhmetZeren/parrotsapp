/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/prop-types */
import React from "react";
import { useState, memo } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import MapView, { Marker, Callout, Polyline } from "react-native-maps";
import parrotMarker1 from "../assets/parrotMarkers/parrotMarker1.png";
import parrotMarker2 from "../assets/parrotMarkers/parrotMarker2.png";
import parrotMarker3 from "../assets/parrotMarkers/parrotMarker3.png";
import parrotMarker4 from "../assets/parrotMarkers/parrotMarker4.png";
import parrotMarker5 from "../assets/parrotMarkers/parrotMarker5.png";
import parrotMarker6 from "../assets/parrotMarkers/parrotMarker6.png";
import { parrotBlue } from "../assets/color";

const markerImages = [
  parrotMarker1,
  parrotMarker2,
  parrotMarker3,
  parrotMarker4,
  parrotMarker5,
  parrotMarker6,
];


export const WaypointComponent = memo(({
  index,
  latitude,
  longitude,
  pinColor,
  id
}) => {
  const [tracksView, setTracksView] = useState(true);

  const coords = { latitude, longitude };
  const imageIndex = index % markerImages.length;
  const markerImage = markerImages[imageIndex];

  return (
    <Marker
      coordinate={coords}
      pinColor={pinColor}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={tracksView}
    >
      <Image
        source={markerImage}
        style={{ width: 36, height: 36 }}
        resizeMode="contain"
        onLoad={() => setTracksView(false)}
      />
    </Marker>
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
  const imageIndex = index % markerImages.length;
  const markerImage = markerImages[imageIndex];
  const viewKey = `waypoint-${id}-${index}-view`;
  const markerKey = `waypoint-${id}-${index}-marker`;

  return (
    <View key={viewKey}>
      <Marker
        key={markerKey}
        coordinate={coords}
        pinColor={pinColor}
        anchor={{ x: 0.5, y: 0.5 }}
      // image={markerImage}
      >
        <Image
          source={markerImage}
          style={{ width: 36, height: 36 }}
          resizeMode="contain"
        />
      </Marker>
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
