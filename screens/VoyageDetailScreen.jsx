/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useGetVoyageByIdQuery } from "../slices/VoyageSlice";
import { vw, vh } from "react-native-expo-viewport-units";
import {
  Feather,
  FontAwesome6,
  AntDesign,
  FontAwesome5,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BackHandler } from "react-native";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Button,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

const VoyageDetailScreen = () => {
  //const route = useRoute();
  //const { voyageId } = route.params;
  //console.log("hello from: ", voyageId);
  const voyageId = 2;
  const {
    data: VoyageData,
    isSuccess: isSuccessVoyages,
    isLoading: isLoadingVoyages,
  } = useGetVoyageByIdQuery(voyageId);

  const renderBids = (bids) => {
    return bids.map((bid, index) => <Text key={index}>{bid.userId}</Text>);
  };

  const WaypointComponent = ({
    description,
    latitude,
    longitude,
    profileImage,
    title,
  }) => {
    const coords = { latitude, longitude };
    // console.log(coords);
    return (
      <>
        {/* <Marker
          coordinate={coords}
          title="Bisikletle Amsterdam"
          description="Bisiklete binip sokaklarda gezicez"
        /> */}

        <Marker coordinate={coords}>
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

  const WaypointList = ({ waypoints }) => {
    return (
      <>
        {waypoints.map((waypoint) => {
          // console.log(waypoint);
          return (
            <WaypointComponent
              key={waypoint.id}
              description={waypoint.description}
              latitude={waypoint.latitude}
              longitude={waypoint.longitude}
              profileImage={waypoint.profileImage}
              title={waypoint.title}
            />
          );
        })}
      </>
    );
  };

  const getInitialRegion = (waypoints) => {
    const maxLatitude = Math.max(
      ...waypoints.map((waypoint) => waypoint.latitude)
    );
    const minLatitude = Math.min(
      ...waypoints.map((waypoint) => waypoint.latitude)
    );
    const maxLongitude = Math.max(
      ...waypoints.map((waypoint) => waypoint.longitude)
    );
    const minLongitude = Math.min(
      ...waypoints.map((waypoint) => waypoint.longitude)
    );
    const centerLatitude = (maxLatitude + minLatitude) / 2;
    const centerLongitude = (maxLongitude + minLongitude) / 2;
    const latitudeDelta = (maxLatitude - minLatitude) * 1.3;
    const longitudeDelta = (maxLongitude - minLongitude) * 1.3;
    const initialRegion = {
      latitude: centerLatitude,
      longitude: centerLongitude,
      latitudeDelta,
      longitudeDelta,
    };
    console.log("initial region: ", initialRegion);
    return initialRegion;
  };

  const navigation = useNavigation();

  if (isSuccessVoyages) {
    const bids = VoyageData.bids || [];
    const waypoints = VoyageData.waypoints || [];

    let icon;
    switch (VoyageData.vehicle.type) {
      case 0:
        icon = <FontAwesome6 name="sailboat" size={12} color="blue" />;
        break;
      case 1:
        icon = <AntDesign name="car" size={12} color="blue" />;
        break;
      case 2:
        icon = <FontAwesome5 name="caravan" size={12} color="blue" />;
        break;
      case 3:
        icon = <Ionicons name="bus-outline" size={12} color="blue" />;
        break;
      case 4:
        icon = <FontAwesome5 name="walking" size={12} color="blue" />;
        break;
      case 5:
        icon = <FontAwesome5 name="running" size={12} color="blue" />;
        break;
      case 6:
        icon = <FontAwesome name="motorcycle" size={12} color="blue" />;
        break;
      case 7:
        icon = <FontAwesome name="bicycle" size={12} color="blue" />;
        break;
      case 8:
        icon = <FontAwesome6 name="house" size={12} color="blue" />;
        break;
      case 9:
        icon = <Ionicons name="airplane-outline" size={12} color="blue" />;
        break;
      default:
        icon = "help-circle";
        break;
    }

    const backgroundImageUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/VoyageImages/${VoyageData.profileImage}`;
    const initialRegion = getInitialRegion(waypoints);

    return (
      <>
        <ScrollView style={styles.ScrollView}>
          <View style={styles.mapContainer}>
            <MapView style={styles.map} initialRegion={initialRegion}>
              <WaypointList waypoints={waypoints} />
            </MapView>
            <View style={styles.heartContainer1}>
              <Ionicons
                name="heart"
                size={24}
                color="red"
                style={styles.heartContainer2}
              />
            </View>
            <View style={styles.shareContainer1}>
              <MaterialIcons
                name="ios-share"
                size={24}
                color="black"
                style={styles.shareContainer2}
              />
            </View>
          </View>
        </ScrollView>
      </>
    );
  }
};

export default VoyageDetailScreen;

const styles = StyleSheet.create({
  mapContainer: {
    height: vh(40),
    padding: vh(1),
    backgroundColor: "blue",
    width: "94%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    margin: vh(2),
    marginTop: vh(5),
  },
  map: {
    width: "100%",
    height: "100%",
  },
  ScrollView: {
    backgroundColor: "green",
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
    borderWidth: 1,
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
    borderWidth: 1,
  },
});
