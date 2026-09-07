import { ParrotsStdText } from "./ParrotsStdText";
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
import { parrotBlue, parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotCream, parrotGreen, parrotLightBlue, parrotPlaceholderGrey } from "../assets/color";
import { FontAwesome5 } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import Toast from "react-native-toast-message";
import * as ImageManipulator from "expo-image-manipulator";
import { USE_CAMBRIDGE_DEFAULT_LOCATION, CAMBRIDGE_REGION } from "../constants/defaultLocationFlag";

const CreateVoyageMapComponent = ({
  voyageId,
  setCurrentStep,
  imagesAdded,
  createdVoyageImage,
  voyageName,
  startDate,
  endDate,
  isPublicOnMap,
  crackerBalance,
  onVoyagePosted,
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
  const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
              <ParrotsStdText>{title}</ParrotsStdText>
              <ParrotsStdText>{description}</ParrotsStdText>
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
    try {
      const queryParams = new URLSearchParams({ Latitude: latitude, Longitude: longitude, Title: title, Description: description, VoyageId: voyageId, Order: order });
      let result;
      if (imageUri) {
        const token = await AsyncStorage.getItem("storedToken");
        const uploadResult = await FileSystem.uploadAsync(
          `${API_URL}/api/Waypoint/AddWaypoint?${queryParams}`,
          imageUri,
          {
            httpMethod: "POST",
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: "imageFile",
            mimeType: "image/jpeg",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const body = JSON.parse(uploadResult.body);
        result = { data: body, error: uploadResult.status >= 400 ? { status: uploadResult.status } : undefined };
      } else {
        result = await addWaypointNoImage({ latitude, longitude, title, description, voyageId, order });
      }

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
        strokeColor={parrotBlue}
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
          let pinColor = "#06B6D4";
          if (index === 0) {
            pinColor = "green";
          } else if (index === waypoints.length - 1) {
            pinColor = "red";
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
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      console.log("[waypoint pickImage] fileSize:", asset.fileSize, "width:", asset.width, "height:", asset.height);
      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1080, height: 1080 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log("[waypoint pickImage] resized uri:", manipulated.uri);
      setImageUri(manipulated.uri);
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
      if (USE_CAMBRIDGE_DEFAULT_LOCATION) {
        setInitialRegion(CAMBRIDGE_REGION);
        return;
      }
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
    setIsConfirming(true);
    const result = await confirmVoyage(voyageId);
    if (result.error) {
      Toast.show({ type: "error", text1: "Could not confirm voyage", text2: "Check your connection and try again.", autoHide: true, visibilityTime: 3000 });
      setIsConfirming(false);
      return;
    }
    if (onVoyagePosted) onVoyagePosted();
    setAddedWayPoints([]);
    setMarkerCoords(null);
    setLatitude("");
    setLongitude("");
    setTitle("");
    setDescription("");
    setImageUri(null);
    setOrder(1);
    navigation.navigate("Home", { screen: "HomeScreen" });
  };

  const canAddWaypoint = latitude && longitude && description && title;


  return (
    <View>
      <View style={styles.mapCard}>
        <View style={styles.cardTitleRow}>
          <ParrotsStdText style={styles.cardTitle}>Voyage Route</ParrotsStdText>
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
            <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 15, color: parrotLightBlue, textAlign: "center", lineHeight: 22 }}>
              {"Tap the map to mark your waypoint, then give it a name and a description. If a city label's in the way, just zoom in for a better look."}
            </ParrotsStdText>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.newWaypointCard}>
        <View style={[styles.cardTitleRow, { flexDirection: "row", alignItems: "center", gap: vw(2) }]}>
          <ParrotsStdText style={styles.cardTitle}>New Waypoint</ParrotsStdText>
          <TouchableOpacity onPress={() => setWaypointInfoVisible(true)}>
            <ParrotsStdText style={{ fontSize: 16, color: parrotLightBlue, fontFamily: "Nunito_800ExtraBold" }}>ⓘ</ParrotsStdText>
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
                  style={[styles.profileImage, { opacity: 0.2 }]}
                />
              )}
            </TouchableOpacity>
          )}

          <View style={styles.latLng}>
            <View style={styles.latLngNameRow}>
              <View style={styles.latLngLabel}>
                <ParrotsStdText style={styles.latorLngtxt}>Lat:</ParrotsStdText>
              </View>
              <View style={styles.latorLng}>
                <ParrotsStdText
                  style={
                    latitude ? styles.latlngtextInput : styles.latlngtextInput2
                  }
                >
                  {latitude
                    ? latitude.toString().substring(0, 20)
                    : "tap on map"}
                </ParrotsStdText>
              </View>
            </View>

            <View style={styles.latLngNameRow}>
              <View style={styles.latLngLabel}>
                <ParrotsStdText style={styles.latorLngtxt}>Lng:</ParrotsStdText>
              </View>
              <View style={styles.latorLng}>
                <ParrotsStdText
                  style={
                    latitude ? styles.latlngtextInput : styles.latlngtextInput2
                  }
                >
                  {longitude
                    ? longitude.toString().substring(0, 20)
                    : "tap on map"}
                </ParrotsStdText>
              </View>
            </View>

            <View style={styles.latLngNameRow}>
              <View style={styles.nameLabel}>
                <ParrotsStdText style={styles.latorLngtxt}>Name:</ParrotsStdText>
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
            <ParrotsStdText style={styles.latorLngtxt2}>Description:</ParrotsStdText>
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


        <TouchableOpacity
          style={styles.AddWaypointButtonContainer}
          onPress={() => {
            if (latitude && longitude && description && title) {
              handleAddWaypoint();
            }
          }}
          disabled={!(latitude && longitude && description && title) || isAddingWaypoint}
        >
          <View
            style={[
              styles.completeText,
              { alignItems: "center", justifyContent: "center" },
              (latitude && longitude && description && title)
                ? { backgroundColor: parrotBlue }
                : { backgroundColor: parrotBlueSemiTransparent },
            ]}
          >
            <ParrotsStdText style={{ color: "white", fontFamily: "Nunito_700Bold", opacity: isAddingWaypoint ? 0 : 1 }}>Add Waypoint</ParrotsStdText>
            {isAddingWaypoint && <ActivityIndicator size="small" color="#ffffff" style={{ position: "absolute" }} />}
          </View>
        </TouchableOpacity>
      </View >


      <View style={styles.addedWaypointsCard}>
        <View style={styles.cardTitleRow}>
          <ParrotsStdText style={styles.cardTitle}>Added Waypoints</ParrotsStdText>
        </View>
        <View style={styles.waypointFlatlistInner}>
          <WaypointFlatList addedWayPoints={addedWayPoints} handleDeleteWaypoint={handleDeleteWaypoint} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.FinishButtonContainer}
        onPress={() => { if (addedWayPoints.length > 0) setShowConfirmModal(true); }}
        disabled={!(addedWayPoints.length > 0) || isConfirming}
      >
        <View
          style={[
            styles.completeText,
            { alignItems: "center", justifyContent: "center" },
            addedWayPoints.length > 0
              ? { backgroundColor: parrotBlue }
              : { backgroundColor: parrotBlueSemiTransparent },
          ]}
        >
          <ParrotsStdText style={{ color: "white", fontFamily: "Nunito_700Bold", opacity: isConfirming ? 0 : 1 }}>Complete</ParrotsStdText>
          {isConfirming && <ActivityIndicator size="small" color="#ffffff" style={{ position: "absolute" }} />}
        </View>
      </TouchableOpacity>

      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.box}>
            {(() => {
              const rawEnd = endDate || startDate;
              const end = rawEnd ? new Date(rawEnd?.toDate ? rawEnd.toDate() : rawEnd) : null;
              if (end) end.setHours(23, 59, 0, 0);
              const today = new Date(); today.setHours(23, 59, 0, 0);
              const cost = isPublicOnMap && end ? Math.max(0, Math.round((end - today) / (1000 * 60 * 60 * 24)) + 1) : 0;
              const startD = startDate ? new Date(startDate?.toDate ? startDate.toDate() : startDate) : null;
              const formatDate = (d) => d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "";
              const formatYear = (d) => d ? String(d.getFullYear()).slice(-2) : "";
              const dateLabel = startD && end && startD.toDateString() !== end.toDateString()
                ? `${formatDate(startD)} – ${formatDate(end)} ${formatYear(end)}`
                : `${formatDate(startD)} ${formatYear(startD)}`;
              return (
                <>
                  <ParrotsStdText style={modalStyles.title}>Post this voyage?</ParrotsStdText>

                  <View style={modalStyles.summaryCard}>
                    <View style={modalStyles.summaryRow}>
                      <ParrotsStdText style={modalStyles.summaryLabel}>Voyage</ParrotsStdText>
                      <ParrotsStdText style={modalStyles.summaryValue}>{voyageName || "—"}</ParrotsStdText>
                    </View>
                    <View style={modalStyles.summaryRow}>
                      <ParrotsStdText style={modalStyles.summaryLabel}>Dates</ParrotsStdText>
                      <ParrotsStdText style={modalStyles.summaryValue}>{dateLabel || "—"}</ParrotsStdText>
                    </View>
                  </View>

                  <View style={modalStyles.pill}>
                    <FontAwesome5 name="globe-europe" size={16} color={parrotBlue} />
                    <ParrotsStdText style={[modalStyles.pillText, { color: parrotBlue, paddingRight: 20 }]}>
                      {isPublicOnMap
                        ? "Goes public on the map right away. Anyone can find it and place a bid."
                        : "This voyage won't appear on the map. People can still view it through your profile."}
                    </ParrotsStdText>
                  </View>

                  <View style={[modalStyles.pill, { backgroundColor: "rgba(0,150,100,0.12)", marginBottom: 10 }]}>
                    <Image source={require("../assets/parrotCracker.png")} style={{ width: 18, height: 18 }} />
                    <ParrotsStdText style={[modalStyles.pillText, { color: "#065f46" }]}>
                      {isPublicOnMap && cost > 0 ? `${cost} ParrotCrackers will be used` : "Free, no ParrotCrackers used."}
                    </ParrotsStdText>
                  </View>

                  <View style={[modalStyles.pill, { backgroundColor: "#fef3c7", marginBottom: 0 }]}>
                    <FontAwesome5 name="lock" size={16} color="#92400e" />
                    <ParrotsStdText style={[modalStyles.pillText, { color: "#92400e", flex: 1 }]}>
                      The details lock once posted.{"\n"}You can still post updates later.
                    </ParrotsStdText>
                  </View>

                  <View style={{ flexDirection: "row", gap: 12, marginTop: 20, width: "100%" }}>
                    <TouchableOpacity style={modalStyles.cancelBtn} onPress={() => setShowConfirmModal(false)}>
                      <ParrotsStdText style={modalStyles.cancelText}>Cancel</ParrotsStdText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={modalStyles.confirmBtn}
                      onPress={() => { setShowConfirmModal(false); goToHomePage(); }}
                    >
                      <ParrotsStdText style={modalStyles.confirmText}>Post voyage</ParrotsStdText>
                    </TouchableOpacity>
                  </View>
                </>
              );
            })()}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateVoyageMapComponent;

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 24 },
  box: { backgroundColor: "white", borderRadius: 20, padding: 24, width: "100%", alignItems: "center" },
  title: { fontFamily: "Nunito_800ExtraBold", fontSize: 18, color: "#1a2e4a", marginBottom: 16 },
  summaryCard: { backgroundColor: "#f3f4f6", borderRadius: 10, padding: 14, width: "100%", marginBottom: 14, gap: 6 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  summaryLabel: { fontFamily: "Nunito_800ExtraBold", fontSize: 14, color: "#6b7280" },
  summaryValue: { fontFamily: "Nunito_800ExtraBold", fontSize: 14, color: "#1a2e4a", flexShrink: 1, textAlign: "right" },
  pill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(0,100,200,0.12)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, width: "100%", marginBottom: 10 },
  pillText: { fontFamily: "Nunito_700Bold", fontSize: 14 },
  cancelBtn: { flex: 1, justifyContent: "center", alignItems: "center" },
  cancelText: { fontFamily: "Nunito_700Bold", fontSize: 15, color: "#6b7280" },
  confirmBtn: { flex: 1, backgroundColor: parrotBlue, borderRadius: 30, alignItems: "center", paddingVertical: 12 },
  confirmText: { fontFamily: "Nunito_700Bold", fontSize: 15, color: "white" },
});

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
    color: parrotBlue,
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
    paddingVertical: vh(1),
    paddingHorizontal: vw(6),
    borderRadius: vh(2),
    backgroundColor: parrotBlue,
    color: "white",
    fontFamily: "Nunito_700Bold",
    marginBottom: vh(1),
  },
  completeText: {
    alignSelf: "center",
    paddingVertical: vh(1),
    paddingHorizontal: vw(6),
    borderRadius: vh(2),
    backgroundColor: parrotBlue,
    color: "white",
    fontFamily: "Nunito_700Bold",
    marginBottom: vh(3),
  },
  addWaypointTextDisabled: {
    alignSelf: "center",
    paddingVertical: vh(1),
    paddingHorizontal: vw(6),
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
  AddWaypointButtonContainer: {
    borderRadius: vh(2),
    width: vw(95),
    alignSelf: "center",
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
