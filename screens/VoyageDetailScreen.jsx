/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { useEffect, useState } from "react";
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
import MapView, { Marker, Callout, Polyline } from "react-native-maps";
import VoyageImagesWithCarousel from "../components/VoyageImagesWithCarousel";

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
  const [showFullText, setShowFullText] = useState(false);

  const renderBids = (bids) => {
    const UserImageBaseUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/`;
    return bids.map((bid, index) => (
      <View key={index} style={styles.singleBidContainer}>
        <Image
          source={{
            uri: UserImageBaseUrl + bid.userProfileImage,
          }}
          style={styles.bidImage}
        />
        <View>
          <Text style={styles.bidUsername}>{bid.userName}</Text>
        </View>
        <View>
          <Text style={styles.offerPrice}>
            {bid.currency} {bid.offerPrice.toFixed(2)}
          </Text>
        </View>
      </View>
    ));
  };

  const WaypointComponent = ({
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

  const WaypointList = ({ waypoints }) => {
    return (
      <>
        {waypoints.map((waypoint, index) => {
          // let pinColor = "#cfc200";
          let pinColor = "orange";
          if (index === 0) {
            pinColor = "#115500";
          } else if (index === waypoints.length - 1) {
            pinColor = "#610101";
          }

          return (
            <WaypointComponent
              key={waypoint.id}
              description={waypoint.description}
              latitude={waypoint.latitude}
              longitude={waypoint.longitude}
              profileImage={waypoint.profileImage}
              title={waypoint.title}
              pinColor={pinColor}
            />
          );
        })}
      </>
    );
  };

  const renderPolylines = (waypoints) => {
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
    const latitudeDelta = (maxLatitude - minLatitude) * 1.4;
    const longitudeDelta = (maxLongitude - minLongitude) * 1.3;
    const initialRegion = {
      latitude: centerLatitude + (maxLatitude - minLatitude) * 0.1,
      longitude: centerLongitude,
      latitudeDelta,
      longitudeDelta,
    };
    // console.log("initial region: ", initialRegion);
    return initialRegion;
  };

  const navigation = useNavigation();

  if (isSuccessVoyages) {
    const bids = VoyageData.bids || [];
    const waypoints = VoyageData.waypoints || [];

    const descriptionShortenedChars = 165;
    const displayText = showFullText
      ? VoyageData.description
      : VoyageData.description.slice(0, descriptionShortenedChars) + "...";

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

    let allVoyageImages = [
      {
        id: "0",
        voyageId: VoyageData.id,
        voyageImagePath: VoyageData.profileImage,
      },
    ].concat(VoyageData.voyageImages);
    const initialRegion = getInitialRegion(waypoints);

    return (
      <>
        <ScrollView style={styles.ScrollView}>
          {/* // map */}
          <View style={styles.mapAndEmojisContainer}>
            <View style={styles.mapContainer}>
              <MapView style={styles.map} initialRegion={initialRegion}>
                <WaypointList waypoints={waypoints} />
                {renderPolylines(waypoints)}
              </MapView>
            </View>
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

          {/* // VoyageName and Username */}
          <View style={styles.VoyageNameAndUsername}>
            <Text style={styles.voyageName}>{VoyageData.name}</Text>
            <Text style={styles.userName}>{VoyageData.user.userName}</Text>
          </View>

          {/* // Voyage Images */}
          <View style={styles.ImagesMainContainer}>
            <View style={styles.ImagesSubContainer}>
              <VoyageImagesWithCarousel voyageImages={allVoyageImages} />
            </View>
          </View>

          {/* // Voyage Description */}
          <View style={styles.DescriptionContainer}>
            <Text style={styles.descriptionInnerContainer}>{displayText}</Text>
            {VoyageData.description.length > descriptionShortenedChars &&
              !showFullText && (
                <TouchableOpacity onPress={() => setShowFullText(true)}>
                  <Text style={styles.ReadMoreLess}>
                    Read more...
                    <MaterialIcons name="expand-more" size={24} color="blue" />
                  </Text>
                </TouchableOpacity>
              )}
            {showFullText && (
              <TouchableOpacity onPress={() => setShowFullText(false)}>
                <Text style={styles.ReadMoreLess}>
                  Read less...
                  <MaterialIcons name="expand-less" size={24} color="blue" />
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* // Bids */}
          <View style={styles.currentBidsContainer}>
            <Text style={styles.currentBidsTitle}>Current Bids</Text>
            <View style={styles.allBidsContainer}>
              {renderBids(VoyageData.bids)}
            </View>
          </View>

          {/* // enter bid */}
          <View style={styles.EnterBidContainer}>
            <Text style={styles.innerContainer}>Enter Bid</Text>
          </View>
          <View style={{ height: vh(14) }}>
            <Text> Enter bid </Text>
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
    // borderWidth: 1,
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
    // borderWidth: 1,
  },
  VoyageNameAndUsername: {
    // backgroundColor: "blue",
    padding: vh(1),
    margin: vh(0.5),
    marginTop: vh(0.5),
  },
  DescriptionContainer: {
    // backgroundColor: "blue",
    padding: vh(1),
    margin: vh(0.5),
    marginTop: vh(0.5),
  },
  descriptionInnerContainer: {
    marginVertical: vh(0.2),
    // backgroundColor: "honeydew",
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
    // backgroundColor: "honeydew",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    // backgroundColor: "honeydew",
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
    backgroundColor: "white",
  },
  ImagesSubContainer: {
    backgroundColor: "white",
    paddingHorizontal: vh(1),
    marginTop: vh(0.5),
  },
  bidImage: {
    width: vh(5),
    height: vh(5),
    borderRadius: vh(2.5),
    marginRight: 8,
    backgroundColor: "purple",
  },
  bidUsername: {
    // backgroundColor: "red",
    fontSize: 17,
    fontWeight: "700",
    width: vw(55),
  },
  offerPrice: {
    // backgroundColor: "grey",
    fontSize: 18,
    fontWeight: "800",
    color: "blue",
    width: vw(25),
    textAlign: "right",
  },
  currentBidsTitle: {
    paddingLeft: vw(2),
    fontSize: 25,
    fontWeight: "700",
    color: "blue",
  },
  currentBidsContainer: {
    backgroundColor: "white",
    // paddingLeft: vw(0),
    // fontSize: 50,
    // fontWeight: "900",
    // color: "red",
  },
  allBidsContainer: {
    // backgroundColor: "blue",
    margin: vh(1),
    padding: vh(0),
  },
  singleBidContainer: {
    flexDirection: "row",
    // backgroundColor: "cyan",
    padding: vh(0.1),
    margin: vh(0.3),
    alignItems: "center",
  },
});
