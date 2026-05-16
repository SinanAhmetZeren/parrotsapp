/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import MapView, { Marker, Callout, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

import * as ImagePicker from "expo-image-picker";
import {
  useAddWaypointMutation,
  useAddWaypointNoImageMutation,
  useConfirmVoyageMutation,
  useDeleteWaypointMutation
} from "../slices/VoyageSlice";
import { useNavigation } from "@react-navigation/native";
import { WaypointFlatList, WaypointItem } from "../components/WaypointFlatlist";
import { parrotBlue, parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotCream, parrotLightBlue, parrotPlaceholderGrey } from "../assets/color";
import Toast from "react-native-toast-message";

const CreateVoyageMapComponent = ({
  voyageId,
  setCurrentStep,
  imagesAdded,
  createdVoyageImage
}) => {
  const [waypointInfoVisible, setWaypointInfoVisible] = useState(false);
  const [addedWayPoints, setAddedWayPoints] = useState([]);
  const [markerCoords, setMarkerCoords] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  // const [title, setTitle] = useState("Amsterdamda gezinti");
  // const [description, setDescription] = useState("Amsterdam'da geziyoruz, ot içiyoruz.  Ot kafelerde takiliyoruz");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [imageUri, setImageUri] = useState(null);
  const [order, setOrder] = useState(1);
  const [addWaypoint] = useAddWaypointMutation();
  const [addWaypointNoImage] = useAddWaypointNoImageMutation();
  const [deleteWaypoint] = useDeleteWaypointMutation();
  const [confirmVoyage] = useConfirmVoyageMutation();
  const navigation = useNavigation();
  const [isUploadingWaypointImage, setIsUploadingWaypointImage] = useState(false);
  const [initialRegion, setInitialRegion] = useState(null)

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

    setIsUploadingWaypointImage(true);
    const formData = new FormData();

    if (imageUri) {
      formData.append("imageFile", {
        uri: imageUri,
        type: "image/jpeg",
        name: "profileImage.jpg",
      });
    }

    try {
      const result = imageUri ?
        await addWaypoint({
          formData,
          latitude,
          longitude,
          title,
          description,
          voyageId,
          order,
        })
        :
        await addWaypointNoImage({
          latitude,
          longitude,
          title,
          description,
          voyageId,
          order,
        })

      if (result.error || !result.data?.data) {
        Toast.show({ type: "error", text1: "Could not add waypoint", text2: "Check your connection and try again.", autoHide: true, visibilityTime: 3000 });
        return;
      }
      const waypointId = result.data.data;
      setAddedWayPoints((prevWaypoints) => [
        ...prevWaypoints,
        {
          imageUri: imageUri ?? createdVoyageImage,
          latitude,
          longitude,
          title,
          description,
          voyageId,
          order,
          waypointId,
          hasImage: !!imageUri
        },
      ]);
      setOrder(prev => prev + 1);
      setImageUri(null);
      setLatitude("");
      setLongitude("");
      setTitle("");
      setDescription("")
    } catch (error) {
      Toast.show({ type: "error", text1: "Could not add waypoint", text2: "Check your connection and try again.", autoHide: true, visibilityTime: 3000 });
    }
    finally {
      setIsUploadingWaypointImage(false);
    }

  };

  const handleDeleteWaypoint = async (waypointId) => {
    const result = await deleteWaypoint(waypointId);
    if (result.error) {
      Toast.show({ type: "error", text1: "Could not delete waypoint", text2: "Check your connection and try again.", autoHide: true, visibilityTime: 3000 });
      return;
    }
    setAddedWayPoints((prevWaypoints) =>
      prevWaypoints.filter((waypoint) => waypoint.waypointId !== waypointId)
    );
  }

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
      mediaTypes: ["images"],
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  /*
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
*/

  // 1. GET LOCATION & SET INITIAL REGION //
  useEffect(() => {
    const fetchLocation = async () => {
      try {

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Toast.show({ type: "error", text1: "Location permission denied", text2: "Enable location in device settings.", autoHide: false });
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const initial = {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        setInitialRegion(initial);
      } catch (error) {
      }
    };

    fetchLocation();
  }, []);


  /*
  const initialRegion = {
    latitude: 52.3676, // Amsterdam's latitude
    longitude: 4.9041, // Amsterdam's longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  */

  const handleMapPress = (event) => {
    setLatitude(event.nativeEvent.coordinate.latitude);
    setLongitude(event.nativeEvent.coordinate.longitude);
    setMarkerCoords(event.nativeEvent.coordinate);
  };

  const goToHomePage = async () => {
    const result = await confirmVoyage(voyageId);
    if (result.error) {
      Toast.show({ type: "error", text1: "Could not confirm voyage", text2: "Check your connection and try again.", autoHide: true, visibilityTime: 3000 });
      return;
    }
    setAddedWayPoints([]);
    setMarkerCoords(null);
    setLatitude("");
    setLongitude("");
    setTitle("");
    setDescription("");
    setImageUri(null);
    setOrder(1);
    setCurrentStep(1);
    navigation.navigate("Home", { screen: "HomeScreen" });
  };



  return (
    <View>
      <View style={styles.mapCard}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>Add Waypoints</Text>
        </View>
        <View style={styles.mapAndEmojisContainer}>
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
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


      </View>


      <Modal transparent animationType="fade" visible={waypointInfoVisible} onRequestClose={() => setWaypointInfoVisible(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" }} activeOpacity={1} onPress={() => setWaypointInfoVisible(false)}>
          <View style={{ backgroundColor: "white", borderRadius: vh(2), borderWidth: 2, borderColor: parrotLightBlue, paddingHorizontal: vw(6), paddingVertical: vh(3), width: vw(80) }}>
            <Text style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 15, color: parrotLightBlue, textAlign: "center", lineHeight: 22 }}>
              {"Tap the map to mark your waypoint, then give it a name and a description. If a city label's in the way, just zoom in for a better look."}
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.newWaypointCard}>
        <View style={[styles.cardTitleRow, { flexDirection: "row", alignItems: "center", gap: vw(2) }]}>
          <Text style={styles.cardTitle}>Waypoint Details</Text>
          <TouchableOpacity onPress={() => setWaypointInfoVisible(true)}>
            <Text style={{ fontSize: 16, color: parrotLightBlue, fontFamily: "Nunito_800ExtraBold" }}>ⓘ</Text>
          </TouchableOpacity>
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
                  source={require("../assets/ParrotsLogoPlus.png")}
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
              <View style={styles.nameLabel}>
                <Text style={styles.latorLngtxt}>Name:</Text>
              </View>
              <View style={styles.nameInputContainer}>
                <TextInput
                  style={styles.nameInput}
                  placeholder="Title (max 25 chars)"
                  value={title}
                  multiline
                  placeholderTextColor={parrotPlaceholderGrey}
                  numberOfLines={1}
                  onChangeText={(text) => setTitle(text)}
                  maxLength={25}
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
              style={styles.textInputDescription}
              placeholder="Waypoint description (max 300)"
              value={description}
              placeholderTextColor={parrotPlaceholderGrey}
              multiline
              numberOfLines={3}
              onChangeText={(text) => setDescription(text)}
              maxLength={300}
            />
          </View>
        </View>


        <View style={{ marginTop: vh(.5), marginBottom: vh(.05) }}>
          {(latitude && longitude && description && title) ? (
            <TouchableOpacity
              style={styles.addWaypointButtonContainer}
              onPress={() => {
                handleAddWaypoint();
              }}
            >
              <Text style={styles.addWaypointText}> Add Waypoint </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity disabled>
              <Text style={styles.addWaypointTextDisabled}> Add Waypoint </Text>
            </TouchableOpacity>
          )}
        </View>

      </View >


      <View style={styles.addedWaypointsCard}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>Added Waypoints</Text>
        </View>
        <View style={styles.waypointFlatlistInner}>
          <WaypointFlatList addedWayPoints={addedWayPoints} handleDeleteWaypoint={handleDeleteWaypoint} />
        </View>
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
              ? { backgroundColor: parrotBlue }
              : { backgroundColor: parrotBlueSemiTransparent },
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

  mapCard: {
    borderRadius: 20,
    backgroundColor: "#fdf9f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: vw(2),
    marginBottom: vh(1),
    paddingTop: vh(1.5),
    overflow: "hidden",
  },
  addedWaypointsCard: {
    borderRadius: 20,
    backgroundColor: "#fdf9f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: vw(2),
    marginBottom: vh(1),
    paddingTop: vh(1.5),
    paddingBottom: vh(1),
  },
  cardTitleRow: {
    marginHorizontal: vw(2),
    marginBottom: vh(1),
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: "Nunito_800ExtraBold",
    color: parrotLightBlue,
  },
  waypointFlatlistInner: {
    height: vh(38),
    padding: vh(2),
    paddingVertical: vh(0),
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginBottom: vh(1),
  },
  messageBubble: {
    width: vw(88),
    height: vh(6.8),
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
  miniLogo: {
    height: vh(4),
    width: vh(4),
    alignSelf: "center",
  },
  addWaypointText: {
    alignSelf: "center",
    padding: vh(1),
    borderRadius: vh(2),
    backgroundColor: parrotBlue,
    color: "white",
    fontFamily: "Nunito_700Bold",
    marginBottom: vh(1),
  },
  completeText: {
    alignSelf: "center",
    padding: vh(1),
    borderRadius: vh(2),
    backgroundColor: parrotBlue,
    color: "white",
    fontFamily: "Nunito_700Bold",
    marginBottom: vh(3),
  },
  addWaypointTextDisabled: {
    alignSelf: "center",
    padding: vh(1),
    borderRadius: vh(2),
    backgroundColor: parrotBlueSemiTransparent2,
    color: "white",
    fontFamily: "Nunito_700Bold",
    marginBottom: vh(1),
  },
  FinishButtonContainer: {
    borderRadius: vh(2),
    width: vw(95),
    alignSelf: "center",
    marginBottom: vh(5),
  },
  newWaypointCard: {
    borderRadius: 20,
    backgroundColor: "#fdf9f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: vw(2),
    marginBottom: vh(1),
    paddingTop: vh(1.5),
    paddingBottom: vh(1),
    paddingHorizontal: vw(2),
  },
  latLng: {
    width: vw(59),
    marginTop: vh(1),
  },
  latorLng: {
    flexDirection: "row",
    backgroundColor: "white",
    marginVertical: vh(0.2),
    padding: vh(0.4),
    borderTopRightRadius: vh(1.5),
    borderBottomRightRadius: vh(1.5),
    width: vw(45),
  },
  nameInputContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginVertical: vh(0),
    padding: vh(0.4),
    paddingVertical: 0,
    borderTopRightRadius: vh(1.5),
    borderBottomRightRadius: vh(1.5),
    width: vw(45),
  },
  latorLng2: {
    flexDirection: "row",
    backgroundColor: parrotCream,
    marginVertical: vh(0.3),
    padding: vh(0.1),
    width: vw(62),
    borderTopRightRadius: vh(1.5),
    borderBottomRightRadius: vh(1.5),
  },
  latLngNameRow: {
    flexDirection: "row",
    backgroundColor: parrotCream,
    borderRadius: vh(1.5),
    marginBottom: vh(0.5),
    height: vh(4.5),
  },
  latLngNameRow2: {
    flexDirection: "row",
    backgroundColor: parrotCream,
    borderRadius: vh(1.5),
    marginBottom: vh(0.5),
    marginHorizontal: vw(2),
  },
  nameLabel: {
    justifyContent: "center",
    backgroundColor: parrotCream,
    marginVertical: vh(0.3),
    padding: vh(0.4),
    borderRadius: vh(1.5),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  latLngLabel: {
    justifyContent: "center",
    backgroundColor: parrotCream,
    marginVertical: vh(0.1),
    padding: vh(0.4),
    borderRadius: vh(1.5),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  latLngLabel2: {
    justifyContent: "center",
    backgroundColor: parrotCream,
    marginVertical: vh(0.3),
    marginLeft: vw(3),
    padding: vh(0.4),
    borderRadius: vh(1.5),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    width: vw(25),
  },
  latorLngtxt: {
    color: parrotPlaceholderGrey,
    fontFamily: "Nunito_700Bold",
    width: vw(12),
    textAlign: "center",
  },
  latorLngtxt2: {
    color: parrotPlaceholderGrey,
    fontFamily: "Nunito_700Bold",
    width: vw(21),
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
    marginLeft: vw(2),
    marginRight: vw(2),
    marginVertical: vh(1),
    width: vh(14.5),
    height: vh(14.5),
    borderRadius: vh(1.5),
    borderColor: parrotBlueSemiTransparent,
    backgroundColor: "white",

  },
  textInputDescription: {
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    paddingLeft: vw(1),
    width: "99%",
    backgroundColor: "white",
    borderRadius: vh(1.5),
  },
  nameInput: {
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    paddingLeft: vw(1),
    width: "90%",
  },
  latlngtextInput: {
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    padding: vw(1),
    width: "90%",
    color: parrotPlaceholderGrey,
  },
  latlngtextInput2: {
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    padding: vw(1),
    width: "90%",
    color: parrotPlaceholderGrey,
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
    // borderColor: "#93c9ed",
    borderColor: parrotBlueSemiTransparent,
    // borderWidth: 2,
    borderRadius: vh(2),

  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: vw(10),
  },
});
