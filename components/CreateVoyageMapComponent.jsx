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
import { FontAwesome5, Feather } from "@expo/vector-icons";
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
  onCanCompleteChange,
  completeTriggerRef,
  onWaypointsChange,
}) => {
  const [waypointInfoVisible, setWaypointInfoVisible] = useState(false);
  const [addedWayPoints, setAddedWayPoints] = useState([
    // { waypointId: "w1", order: 1, title: "Canal District", description: "Stunning 17th century canals lined with narrow townhouses. Best explored by boat or on foot at dawn.", latitude: 52.3676, longitude: 4.9041, imageUri: "https://picsum.photos/seed/canal/400/400", hasImage: true },
    // { waypointId: "w2", order: 2, title: "Vondelpark", description: "Amsterdam's most famous park. Great for a picnic or a morning run through the rose garden.", latitude: 52.3580, longitude: 4.8686, imageUri: "https://picsum.photos/seed/park/400/400", hasImage: true },
    // { waypointId: "w3", order: 3, title: "Rijksmuseum", description: "Home to Rembrandt, Vermeer and van Gogh. Allow at least 3 hours. Book tickets in advance.", latitude: 52.3600, longitude: 4.8852, imageUri: "https://picsum.photos/seed/museum/400/400", hasImage: true },
    // { waypointId: "w4", order: 4, title: "Anne Frank House", description: "The secret annex where Anne Frank hid during WWII. Deeply moving — queue early or pre-book.", latitude: 52.3752, longitude: 4.8840, imageUri: "https://picsum.photos/seed/annefrank/400/400", hasImage: true },
    // { waypointId: "w5", order: 5, title: "Jordaan Quarter", description: "Charming neighbourhood full of indie boutiques, art galleries and cosy brown cafes.", latitude: 52.3736, longitude: 4.8803, imageUri: "https://picsum.photos/seed/jordaan/400/400", hasImage: true },
    // { waypointId: "w6", order: 6, title: "Albert Cuyp Market", description: "Amsterdam's biggest street market. Grab a stroopwafel and browse stalls of cheese, flowers and clothes.", latitude: 52.3553, longitude: 4.8981, imageUri: "https://picsum.photos/seed/market/400/400", hasImage: true },
    // { waypointId: "w7", order: 7, title: "NDSM Wharf", description: "Gritty creative hub on the north bank. Street art, food trucks and great city views.", latitude: 52.4014, longitude: 4.8990, imageUri: "https://picsum.photos/seed/wharf/400/400", hasImage: true },
    // { waypointId: "w8", order: 8, title: "Heineken Experience", description: "Interactive brewery tour inside the original 1867 building. Ends with two free beers.", latitude: 52.3579, longitude: 4.8955, imageUri: "https://picsum.photos/seed/heineken/400/400", hasImage: true },
  ]);
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
  const [voyagePosted, setVoyagePosted] = useState(false);
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

  useEffect(() => {
    if (onCanCompleteChange) onCanCompleteChange(addedWayPoints.length > 0);
    if (onWaypointsChange) onWaypointsChange(addedWayPoints);
    if (completeTriggerRef) {
      completeTriggerRef.current = () => {
        if (addedWayPoints.length > 0) setShowConfirmModal(true);
      };
    }
  }, [addedWayPoints]);


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

  const handleConfirmPostVoyage = async () => {
    if (isConfirming || voyagePosted) return;
    setIsConfirming(true);
    const result = await confirmVoyage(voyageId);
    if (result.error) {
      Toast.show({ type: "error", text1: "Could not confirm voyage", text2: "Check your connection and try again.", autoHide: true, visibilityTime: 3000 });
      setIsConfirming(false);
      return;
    }
    if (result.data?.success === false) {
      Toast.show({ type: "error", text1: "Could not post voyage", text2: result.data?.message || "Please try again.", autoHide: true, visibilityTime: 3000 });
      setIsConfirming(false);
      return;
    }
    const voyagePublicId = result.data?.data;
    setIsConfirming(false);
    setVoyagePosted(true);
    setTimeout(() => {
      if (onVoyagePosted) onVoyagePosted();
      setAddedWayPoints([]);
      setMarkerCoords(null);
      setLatitude("");
      setLongitude("");
      setTitle("");
      setDescription("");
      setImageUri(null);
      setOrder(1);
      navigation.navigate("Home", { screen: "VoyageDetail", params: { voyagePublicId } });
    }, 3000);
  };

  const canAddWaypoint = latitude && longitude && description && title;


  return (
    <View style={{ gap: 10 }}>

      {/* Route card */}
      <View style={cmStyles.card}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ParrotsStdText style={[cmStyles.cardTitle, { flex: 1 }]}>Route</ParrotsStdText>
          <ParrotsStdText style={cmStyles.ct}>{addedWayPoints.length} pinned</ParrotsStdText>
          <TouchableOpacity onPress={() => setWaypointInfoVisible(true)} style={{ marginLeft: 8 }}>
            <ParrotsStdText style={{ fontSize: 14, color: parrotLightBlue, fontFamily: "Nunito_800ExtraBold" }}>ⓘ</ParrotsStdText>
          </TouchableOpacity>
        </View>

        {/* Map */}
        <View style={{ borderRadius: 11, overflow: "hidden", height: vh(25) }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ width: "100%", height: "100%" }}
            initialRegion={initialRegion}
            onPress={handleMapPress}
            userInterfaceStyle="light"
          >
            {markerCoords && <Marker coordinate={markerCoords} />}
            <WaypointList waypoints={addedWayPoints} />
            {renderPolylines(addedWayPoints)}
          </MapView>
          {!markerCoords && (
            <View style={{ position: "absolute", left: 8, bottom: 8, flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(30,111,217,0.72)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Feather name="navigation" size={11} color="#fff" />
              <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 10, color: "#fff" }}>Tap the map to pin</ParrotsStdText>
            </View>
          )}
        </View>

        {/* Coordinate pill */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#E8F1FB", borderRadius: 9, paddingHorizontal: 9, paddingVertical: 6 }}>
          <Feather name="map-pin" size={12} color="#5B3FD6" />
          <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 8.5, letterSpacing: 1, color: "#5A6874" }}>PINNED</ParrotsStdText>
          <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 11.5, color: "#0A5FBF", marginLeft: "auto" }}>
            {markerCoords ? `${latitude.toString().substring(0, 8)},  ${longitude.toString().substring(0, 8)}` : ""}
          </ParrotsStdText>
        </View>

        {/* Waypoint form */}
        <ParrotsStdText style={cmStyles.cardTitle}>Add Waypoint</ParrotsStdText>
        {/* 2-column layout: left = image+add, right = name / description */}
        <View style={{ flexDirection: "row", gap: 8, alignItems: "stretch" }}>
          {/* Left: image picker + add button */}
          <View style={{ width: 96, gap: 3 }}>
            <ParrotsStdText style={cmStyles.lb}>IMAGE</ParrotsStdText>
            <TouchableOpacity
              style={{ width: 96, height: 86, borderRadius: 10, borderWidth: 1, borderColor: "#E8E3DC", backgroundColor: "#fff", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
              onPress={pickVoyageImage}
              activeOpacity={0.75}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={{ width: "100%", height: "100%", resizeMode: "cover" }} />
              ) : (
                <Image source={require("../assets/ParrotsLogoPlus.png")} style={{ width: 75, height: 75, opacity: 0.22 }} resizeMode="contain" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{ height: 32, marginTop: 3, backgroundColor: canAddWaypoint && !isUploadingWaypointImage ? "#0A5FBF" : "rgba(10,95,191,0.4)", borderRadius: 999, alignItems: "center", justifyContent: "center" }}
              onPress={() => { if (canAddWaypoint) handleAddWaypoint(); }}
              disabled={!canAddWaypoint || isUploadingWaypointImage}
            >
              {isUploadingWaypointImage
                ? <ActivityIndicator size="small" color="#fff" />
                : <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 11.5, color: "#fff" }}>Add</ParrotsStdText>}
            </TouchableOpacity>
          </View>

          {/* Right: name (top), description (bottom) */}
          <View style={{ flex: 1, gap: 6 }}>
            <View style={{ gap: 3 }}>
              <ParrotsStdText style={cmStyles.lb}>TITLE</ParrotsStdText>
              <TextInput
                style={cmStyles.fld}
                placeholder="Waypoint title (max 25)"
                placeholderTextColor={parrotPlaceholderGrey}
                value={title}
                onChangeText={setTitle}
                maxLength={25}
              />
            </View>
            <View style={{ gap: 3 }}>
              <ParrotsStdText style={cmStyles.lb}>DESCRIPTION</ParrotsStdText>
              <TextInput
                style={[cmStyles.fld, { height: 62, paddingTop: 9, textAlignVertical: "top" }]}
                placeholder="What happens here (max 300)"
                placeholderTextColor={parrotPlaceholderGrey}
                value={description}
                onChangeText={setDescription}
                maxLength={300}
                multiline
                numberOfLines={2}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Added waypoints */}
      {addedWayPoints.length > 0 && (
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 2 }}>
            <ParrotsStdText style={[cmStyles.cardTitle, { flex: 1 }]}>Added waypoints</ParrotsStdText>
            <ParrotsStdText style={cmStyles.ct}>{addedWayPoints.length}</ParrotsStdText>
          </View>
          {addedWayPoints.map((wp, index) => (
            <View key={wp.waypointId} style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, borderWidth: 1.5, borderColor: "#D8E0E8", borderRadius: 11, backgroundColor: "#fff", padding: 7 }}>
              <View style={{ width: 19, height: 19, borderRadius: 9.5, backgroundColor: "#0A5FBF", alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0 }}>
                <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 10, color: "#fff" }}>{index + 1}</ParrotsStdText>
              </View>
              <Image source={{ uri: wp.imageUri }} style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0 }} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 12.5, color: "#1F2933" }} numberOfLines={1}>{wp.title}</ParrotsStdText>
                <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", fontSize: 10.5, color: "#5A6874", lineHeight: 15, marginTop: 2 }} numberOfLines={2}>{wp.description}</ParrotsStdText>
              </View>
              <TouchableOpacity
                style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#F1F4F7", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                onPress={() => handleDeleteWaypoint(wp.waypointId)}
              >
                <Feather name="x" size={10} color="#5A6874" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Info modal */}
      <Modal transparent animationType="fade" visible={waypointInfoVisible} onRequestClose={() => setWaypointInfoVisible(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" }} activeOpacity={1} onPress={() => setWaypointInfoVisible(false)}>
          <View style={{ backgroundColor: "white", borderRadius: vh(2), borderWidth: 2, borderColor: parrotLightBlue, paddingHorizontal: vw(6), paddingVertical: vh(3), width: vw(80) }}>
            <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 15, color: parrotLightBlue, textAlign: "center", lineHeight: 22 }}>
              {"Tap the map to mark your waypoint, then give it a name and a description. If a city label's in the way, just zoom in for a better look."}
            </ParrotsStdText>
          </View>
        </TouchableOpacity>
      </Modal>

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
                    {!isConfirming && !voyagePosted && (
                      <TouchableOpacity style={modalStyles.cancelBtn} onPress={() => setShowConfirmModal(false)}>
                        <ParrotsStdText style={modalStyles.cancelText}>Cancel</ParrotsStdText>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[modalStyles.confirmBtn, voyagePosted && { backgroundColor: "#16a34a" }]}
                      onPress={handleConfirmPostVoyage}
                      disabled={isConfirming || voyagePosted}
                    >
                      {isConfirming
                        ? <ActivityIndicator size="small" color="#ffffff" />
                        : <ParrotsStdText style={modalStyles.confirmText}>{voyagePosted ? "Voyage Created!" : "Post voyage"}</ParrotsStdText>}
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

const cmStyles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderColor: "#D8E0E8",
    borderRadius: 14,
    backgroundColor: "#fff",
    padding: 10,
    gap: 8,
  },
  cardTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12.5,
    color: "#0A5FBF",
  },
  ct: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 10.5,
    color: "#5A6874",
  },
  lb: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 8.5,
    letterSpacing: 1.1,
    color: "#5A6874",
  },
  fld: {
    fontFamily: "Nunito_700Bold",
    height: 42,
    borderRadius: 8,
    backgroundColor: "#F7F9FB",
    borderWidth: 1,
    borderColor: "#E8E3DC",
    paddingHorizontal: 9,
    fontSize: 12.5,
    color: "#1F2933",
  },
});
