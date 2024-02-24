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
import VoyageImagesWithCarousel from "../components/VoyageImagesWithCarousel";
import PagerView from "react-native-pager-view";

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

    const initialRegion = getInitialRegion(waypoints);

    return (
      <>
        <ScrollView style={styles.ScrollView}>
          <View style={styles.mapAndEmojisContainer}>
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
          <View style={styles.subContainer}>
            <Text style={styles.voyageName}>{VoyageData.name}</Text>
            <Text style={styles.userName}>{VoyageData.user.userName}</Text>
          </View>
          <View style={styles.ImagesMainContainer}>
            <View style={styles.ImagesSubContainer}>
              <VoyageImagesWithCarousel
                voyageImages={VoyageData.voyageImages}
              />
            </View>
          </View>
          <View style={styles.subContainer}>
            <Text style={styles.innerContainer}>Description</Text>
          </View>
          <View style={styles.subContainer}>
            <Text style={styles.innerContainer}>Current Bids x</Text>
          </View>
          <View style={styles.subContainer}>
            <Text style={styles.innerContainer}>Enter Bid</Text>
          </View>
        </ScrollView>
      </>
    );
  }
};

export default VoyageDetailScreen;

const styles2 = StyleSheet.create({
  modalWrapper: {
    backgroundColor: "red",
  },
  imageContainer1: {
    backgroundColor: "cyan",
  },
  voyageImage1: {
    height: vh(13),
    width: vh(13),
    marginRight: vh(1),
    borderRadius: vh(1.5),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Adjust opacity as needed
  },
  carouselImage: {
    position: "absolute",
    top: vh(30),
    alignSelf: "center",
    height: vh(40),
    width: vw(90),
    borderRadius: vh(3),
    borderWidth: 1.5,
    borderColor: "white",
  },
  closeButtonAndText: {
    flexDirection: "row",
    position: "absolute",
    height: vh(3.5),
    width: vh(11.45),
    backgroundColor: "white",
    borderRadius: vh(2.5),
    bottom: vh(24),
    borderColor: "rgb(148,1,1)",
    borderWidth: 1,
    verticalAlign: "middle",
  },
  closeText1: {
    marginLeft: vw(1),
    fontSize: 18,
    height: vh(3),
    alignSelf: "center",
    color: "rgb(148,1,1)",
  },
  closeText2: {
    fontSize: 18,
    height: vh(3),
    alignSelf: "center",
    color: "rgb(148,1,1)",
  },
  pagerView: {
    backgroundColor: "red",
    height: vh(20),
    flex: 1,
  },
  dummyText: {
    backgroundColor: "red",
    height: vh(20),
    width: vw(50),
  },
});

const styles = StyleSheet.create({
  ScrollView: {
    backgroundColor: "green",
  },
  mapAndEmojisContainer: {
    height: vh(40),
    padding: vh(1),
    backgroundColor: "blue",
    width: "98%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    margin: vh(1),
    marginTop: vh(5),
  },
  map: {
    width: "100%",
    height: "100%",
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
    backgroundColor: "honeydew",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "honeydew",
    marginTop: vh(0.2),
    textDecorationLine: "underline",
    color: "blue",
  },
  voyageImage: {
    height: vh(13),
    width: vh(13),
    marginRight: vh(1),
    borderRadius: vh(1.5),
  },
  ImagesMainContainer: {
    backgroundColor: "green",
  },
  ImagesSubContainer: {
    backgroundColor: "green",
    paddingHorizontal: vh(1),
    marginTop: vh(0.5),
  },
});

const initialRegion2 = {
  latitude: 52.362847,
  longitude: 4.922197,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};
