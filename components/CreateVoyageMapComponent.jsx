/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import MapView, { Marker, Callout, Polyline } from "react-native-maps";

import * as ImagePicker from "expo-image-picker";
import { useAddWaypointMutation } from "../slices/VoyageSlice";
import { useNavigation } from "@react-navigation/native";
import { WaypointFlatList, WaypointItem } from "../components/WaypointFlatlist";

const CreateVoyageMapComponent = ({
  voyageId,
  setCurrentStep,
  imagesAdded,
}) => {
  const [addedWayPoints, setAddedWayPoints] = useState([]);
  const [markerCoords, setMarkerCoords] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [title, setTitle] = useState("Amsterdamda gezinti");
  const [description, setDescription] = useState(
    "Amsterdam'da geziyoruz, ot içiyoruz.  Ot kafelerde takiliyoruz"
  );
  const [imageUri, setImageUri] = useState(null);
  const [order, setOrder] = useState(1);
  const [addWaypoint] = useAddWaypointMutation();
  const navigation = useNavigation();
  const [isUploadingWaypointImage, setIsUploadingWaypointImage] =
    useState(false);

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

  const handleAddWaypoint = async () => {
    if (!imageUri) {
      return;
    }

    const formData = new FormData();
    formData.append("imageFile", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profileImage.jpg",
    });

    setIsUploadingWaypointImage(true);
    try {
      await addWaypoint({
        formData,
        latitude,
        longitude,
        title,
        description,
        voyageId,
        order,
      });
      setAddedWayPoints((prevWaypoints) => [
        ...prevWaypoints,
        {
          imageUri,
          latitude,
          longitude,
          title,
          description,
          voyageId,
          order,
        },
      ]);
      setOrder(order + 1);
      setImageUri(null);
      setLatitude("");
      setLongitude("");
    } catch (error) {
      console.error("Error uploading image", error);
    }
    setIsUploadingWaypointImage(false);
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

  const WaypointList = ({ waypoints }) => {
    return (
      <>
        {waypoints.map((waypoint, index) => {
          let pinColor = "orange";
          if (index === 0) {
            pinColor = "#115500";
          } else if (index === waypoints.length - 1) {
            pinColor = "#610101";
          }

          return (
            <WaypointComponent
              key={Math.floor(Math.random() * 10000000000000000)}
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

  const pickVoyageImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
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
    return initialRegion;
  };

  const initialRegion = {
    latitude: 52.3676, // Amsterdam's latitude
    longitude: 4.9041, // Amsterdam's longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleMapPress = (event) => {
    setLatitude(event.nativeEvent.coordinate.latitude);
    setLongitude(event.nativeEvent.coordinate.longitude);
    setMarkerCoords(event.nativeEvent.coordinate);
  };

  const goToHomePage = () => {
    setAddedWayPoints([]);
    setMarkerCoords(null);
    setLatitude("");
    setLongitude("");
    setTitle("");
    setDescription("");
    setImageUri(null);
    setOrder(1);
    setCurrentStep(1);
    navigation.navigate("Home");
  };

  return (
    <View>
      {/* // map */}

      <View style={styles.mapAndEmojisContainer}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            onPress={handleMapPress}
          >
            {markerCoords && (
              <Marker coordinate={markerCoords} title="Tapped Location" />
            )}
            <WaypointList waypoints={addedWayPoints} />
            {renderPolylines(addedWayPoints)}
          </MapView>
        </View>
      </View>

      {/* <View style={styles.warningTextContainer}>
        <Image
          source={require("../assets/parrots-logo-mini.png")}
          style={styles.miniLogo}
        />
        <Text style={styles.warningText}>
          Tap to pick your spot. If a city name is in the way, zoom in closer.
        </Text>
      </View> */}

      <View style={styles.ImageAndLatLng}>
        <View style={styles.warningTextContainer}>
          <Image
            source={require("../assets/parrots-logo-mini.png")}
            style={styles.miniLogo}
          />
          <Image
            source={require("../assets/messagebubble.png")}
            style={styles.messageBubble}
          />
          {/* <Text style={styles.warningText}>
            Tap to pick your spot. If a city name is in the way, zoom in closer.
          </Text> */}
        </View>
        <View style={styles.profileContainer}>
          {isUploadingWaypointImage ? (
            <View style={styles.profileImage}>
              <ActivityIndicator size="large" style={{ top: vh(4) }} />
            </View>
          ) : (
            <TouchableOpacity onPress={pickVoyageImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.profileImage} />
              ) : (
                <Image
                  source={require("../assets/ParrotsWhiteBgPlus.png")}
                  style={styles.profileImage}
                />
              )}
            </TouchableOpacity>
          )}

          <View style={styles.latLng}>
            <View style={styles.latLngNameRow}>
              <View style={styles.latLngLabel}>
                <Text style={styles.latorLngtxt}>Lat:</Text>
              </View>
              <View style={styles.latorLng}>
                <Text
                  style={
                    latitude ? styles.latlngtextInput : styles.latlngtextInput2
                  }
                >
                  {latitude
                    ? latitude.toString().substring(0, 20)
                    : "tap on map"}
                </Text>
              </View>
            </View>

            <View style={styles.latLngNameRow}>
              <View style={styles.latLngLabel}>
                <Text style={styles.latorLngtxt}>Lng:</Text>
              </View>
              <View style={styles.latorLng}>
                <Text
                  style={
                    latitude ? styles.latlngtextInput : styles.latlngtextInput2
                  }
                >
                  {longitude
                    ? longitude.toString().substring(0, 20)
                    : "tap on map"}
                </Text>
              </View>
            </View>

            <View style={styles.latLngNameRow}>
              <View style={styles.latLngLabel}>
                <Text style={styles.latorLngtxt}>Name:</Text>
              </View>
              <View style={styles.latorLng}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter title for waypoint"
                  value={title}
                  multiline
                  numberOfLines={1}
                  onChangeText={(text) => setTitle(text)}
                  maxLength={35}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.latLngNameRow2}>
          <View style={styles.latLngLabel2}>
            <Text style={styles.latorLngtxt2}>Description:</Text>
          </View>
          <View style={styles.latorLng2}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter description for waypoint"
              value={description}
              multiline
              numberOfLines={3}
              onChangeText={(text) => setDescription(text)}
              maxLength={200}
            />
          </View>
        </View>

        {latitude && imageUri ? (
          <TouchableOpacity
            style={styles.addWaypointButtonContainer}
            onPress={() => {
              handleAddWaypoint();
            }}
          >
            <Text style={styles.addWaypointText}> Add Waypoint </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.addWaypointTextDisabled}> Add Waypoint </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.waypointFlatlistContainer}>
        <WaypointFlatList addedWayPoints={addedWayPoints} />
      </View>

      <TouchableOpacity
        style={styles.FinishButtonContainer}
        onPress={() => {
          if (addedWayPoints.length > 0 && imagesAdded > 0) {
            goToHomePage();
          }
        }}
        disabled={!(addedWayPoints.length > 0 && imagesAdded > 0)}
      >
        <Text
          style={[
            styles.completeText,
            addedWayPoints.length > 0 && imagesAdded > 0
              ? { backgroundColor: "rgba(0, 119, 234,1)" }
              : { backgroundColor: "rgba(0, 119, 234,.2)" },
          ]}
        >
          Complete
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateVoyageMapComponent;

const styles = StyleSheet.create({
  messageBubble: {
    width: vw(63),
    height: vh(5.2),
    marginTop: vh(0.7),
  },
  warningTextContainer: {
    alignSelf: "center",
    justifyContent: "center",
    width: vw(80),
    height: vh(7),
    flexDirection: "row",
    marginTop: vh(1),
    borderRadius: vh(2),
  },
  warningText: {
    width: vw(60),
    marginLeft: vw(4),
  },
  miniLogo: {
    height: vh(4),
    width: vh(4),
    alignSelf: "center",
  },

  addWaypointText: {
    alignSelf: "center",
    padding: vh(1),
    borderRadius: vh(2),
    backgroundColor: "rgba(0, 119, 234,1)",
    color: "white",
    fontWeight: "600",
    marginBottom: vh(1),
  },
  completeText: {
    alignSelf: "center",
    padding: vh(1),
    borderRadius: vh(2),
    backgroundColor: "rgba(0, 119, 234,1)",
    color: "white",
    fontWeight: "600",
    marginBottom: vh(3),
  },
  addWaypointTextDisabled: {
    alignSelf: "center",
    padding: vh(1),
    borderRadius: vh(2),
    backgroundColor: "rgba(0, 119, 234,.5)",
    color: "white",
    fontWeight: "600",
    marginBottom: vh(1),
  },

  waypointItem: {
    margin: vw(1),
    width: vw(50),
    height: vh(25),
    alignItems: "center",
    backgroundColor: "rgba(0, 119, 234,0.19)",
    borderWidth: 1,
    borderColor: "rgba(0, 119, 234,0.39)",
    borderRadius: vh(3),
  },

  waypointImage: {
    width: vh(14),
    height: vh(14),
    borderRadius: vh(3),
    borderWidth: 3,
    borderColor: "rgba(0, 119, 234,0.3)",
  },

  waypointFlatlistContainer: {
    height: vh(32),
    marginLeft: vw(3),
  },
  FinishButtonContainer: {
    borderRadius: vh(2),
    width: vw(95),
    alignSelf: "center",
    marginBottom: vh(5),
  },
  ImageAndLatLng: {
    backgroundColor: "rgba(240, 241, 242,.7)",
    borderColor: "rgba(230, 231, 232,1)",
    borderRadius: vh(2),
    width: vw(97),
    alignSelf: "center",
  },
  latLng: {
    width: vw(66),
    marginTop: vh(1),
  },
  latorLng: {
    flexDirection: "row",
    backgroundColor: "white",
    marginVertical: vh(0.3),
    padding: vh(0.4),
    borderTopRightRadius: vh(3),
    borderBottomRightRadius: vh(3),
    width: vw(52),
  },
  latorLng2: {
    flexDirection: "row",
    backgroundColor: "#fafbfc",
    marginVertical: vh(0.3),
    padding: vh(0.4),
    // borderWidth: 1,
    borderColor: "#babbbc",
    width: vw(66),
    borderTopRightRadius: vh(3),
    borderBottomRightRadius: vh(3),
  },
  latLngNameRow: {
    flexDirection: "row",
    backgroundColor: "#f1f2f3",
    borderRadius: vh(3),
    marginBottom: vh(0.5),
  },
  latLngNameRow2: {
    flexDirection: "row",
    backgroundColor: "#f1f2f3",
    borderRadius: vh(3),
    marginBottom: vh(0.5),
    marginHorizontal: vw(2),
  },
  latLngLabel: {
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    marginVertical: vh(0.3),
    padding: vh(0.4),
    borderRadius: vh(3),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: "#babbbc",
  },
  latLngLabel2: {
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    marginVertical: vh(0.3),
    marginLeft: vw(3),
    padding: vh(0.4),
    borderRadius: vh(3),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    width: vw(25),
  },
  latorLngtxt: {
    color: "#6b7f9d",
    fontWeight: "500",
    width: vw(12),
    textAlign: "center",
  },
  latorLngtxt2: {
    color: "#6b7f9d",
    fontWeight: "500",
    width: vw(20),
    textAlign: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: vh(1.5),
    borderRadius: vh(1.5),
    justifyContent: "space-between",
  },
  profileImage: {
    marginLeft: vw(3),
    marginVertical: vh(1),
    width: vh(13),
    height: vh(13),
    borderRadius: vh(3),
    borderColor: "rgba(0, 119, 234,0.3)",
    backgroundColor: "white",
  },
  textInput: {
    fontSize: 13,
    paddingLeft: vw(1),
    width: "90%",
  },
  latlngtextInput: {
    fontSize: 13,
    padding: vw(1),
    width: "90%",
    color: "#989898",
  },
  latlngtextInput2: {
    fontSize: 13,
    padding: vw(1),
    width: "90%",
    color: "#b1b1b1",
  },

  container: {
    flex: 1,
    padding: vh(1),
    margin: vh(2),
    justifyContent: "center",
    backgroundColor: "yellow",
  },

  label: {
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
  },
  mapAndEmojisContainer: {
    height: vh(40),
    padding: vh(1),
    width: "98%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: vh(0.2),
  },
  mapContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: vh(3),
    borderColor: "#93c9ed",
    // borderWidth: 3,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: vw(10),
  },
});
