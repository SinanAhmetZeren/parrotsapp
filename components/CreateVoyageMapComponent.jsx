/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import MapView, { Marker, Callout, Polyline } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
import { useAddWaypointMutation } from "../slices/VoyageSlice";
import { useNavigation } from "@react-navigation/native";

const CreateVoyageMapComponent = ({ voyageId, setCurrentStep }) => {
  // console.log("voyageID from map component: ", voyageId);
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

    // console.log("lat:", latitude);
    // console.log("lng:", longitude);
    // console.log("title:", title);
    // console.log("description:", description);
    // console.log("order:", order);

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
    } catch (error) {
      console.error("Error uploading image", error);
    }
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
      aspect: [4, 3],
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

  const printState = () => {
    console.log("----------");
    console.log("latitude:", latitude);
    console.log("longitude:", longitude);
    console.log("title:", title);
    console.log("description:", description);
    console.log("imageUri:", imageUri);
    console.log("order:", order);
    console.log("added waypoints: ", addedWayPoints);
  };

  const handleMapPress = (event) => {
    // console.log("Tapped Location:", event.nativeEvent.coordinate);
    setLatitude(event.nativeEvent.coordinate.latitude);
    setLongitude(event.nativeEvent.coordinate.longitude);
    setMarkerCoords(event.nativeEvent.coordinate);
  };

  const RenderWaypointFlatList = ({ addedWayPoints }) => {
    // console.log("addedWayPoints");
    // console.log(addedWayPoints);
    return (
      <FlatList
        horizontal
        data={addedWayPoints}
        keyExtractor={(item) => item.order}
        renderItem={({ item, index }) => {
          // console.log("item: ", item);
          return (
            <View key={index}>
              <WaypointItem
                order={item.order}
                latitude={item.latitude}
                longitude={item.longitude}
                title={item.title}
                description={item.description}
                imageUri={item.imageUri}
              />
            </View>
          );
        }}
      />
    );
  };

  //////
  const WaypointItem = ({
    order,
    title,
    latitude,
    longitude,
    description,
    imageUri,
  }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const truncatedDescription =
      description.length > 70 ? `${description.slice(0, 70)}...` : description;

    return (
      <View style={styles.waypointItem}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.waypointImageContainer}>
            <Image source={{ uri: imageUri }} style={styles.waypointImage} />
          </View>
          <Text style={styles.waypointItemTitle}>{title}</Text>
          <Text>{truncatedDescription}</Text>
        </TouchableOpacity>

        {/* Modal for displaying the full description */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.waypointModalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.waypointImageContainer}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.waypointImageInModal}
                />
              </View>
              <Text style={styles.waypointTitleInModal}>{title}</Text>
              <Text style={styles.waypointDescriptionInModal}>
                {description}
              </Text>
              <TouchableOpacity
                style={styles.closeWaypointModalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeWaypointModalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const goToProfilePage = () => {
    setAddedWayPoints([]);
    setMarkerCoords(null);
    setLatitude("");
    setLongitude("");
    setTitle("");
    setDescription("");
    setImageUri(null);
    setOrder(1);
    setCurrentStep(1);
    navigation.navigate("ProfileScreen");
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

      <View style={styles.ImageAndLatLng}>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={pickVoyageImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            )}
          </TouchableOpacity>

          <View style={styles.latLng}>
            <View style={styles.latorLng}>
              <Text>Latitude:</Text>
              <Text>{latitude.toString().substring(0, 20)}</Text>
            </View>
            <View style={styles.latorLng}>
              <Text>Longitude:</Text>
              <Text>{longitude.toString().substring(0, 20)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.socialBox}>
          <Text style={styles.inputDescription}>Title</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Enter title for waypoint"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>

        <View style={styles.socialBox}>
          <Text style={styles.inputDescription}>Description</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Enter description for waypoint"
            value={description}
            onChangeText={(text) => setDescription(text)}
            multiline={true}
          />
        </View>

        <Button
          title="Add Waypoint"
          onPress={() => {
            handleAddWaypoint();
          }}
        />
      </View>

      <View style={styles.waypointFlatlistContainer}>
        <RenderWaypointFlatList addedWayPoints={addedWayPoints} />
      </View>

      <View style={styles.FinishButtonContainer}>
        <Button
          title="Complete"
          onPress={() => {
            goToProfilePage();
          }}
        />
      </View>

      <View
        style={{
          marginTop: vh(2),
          marginBottom: vh(20),
          paddingBottom: vh(10),
        }}
      >
        <Button
          title="print state 3"
          onPress={() => {
            printState();
          }}
        />
      </View>
    </View>
  );
};

export default CreateVoyageMapComponent;

const styles = StyleSheet.create({
  closeWaypointModalButtonText: {
    fontWeight: "800",
    color: "red",
  },
  closeWaypointModalButton: {
    alignSelf: "flex-end",
    bottom: vh(-5),
    width: vw(15),
  },
  waypointTitleInModal: {
    fontWeight: "700",
    fontSize: 20,
  },
  waypointDescriptionInModal: {
    fontWeight: "500",
    fontSize: 14,
  },
  waypointModalContainer: {
    borderWidth: 3,
    borderColor: "rgba(0, 119, 234,0.19)",
    backgroundColor: "white",
    height: vh(50),
    top: vh(20),
    width: vw(75),
    alignSelf: "center",
    borderRadius: vh(5),
    padding: vh(2),
  },
  waypointItemTitle: {
    fontWeight: "700",
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
  waypointImageContainer: {
    marginTop: vh(1),
    alignItems: "center",
  },
  waypointImage: {
    width: vh(14),
    height: vh(14),
    borderRadius: vh(3),
    borderWidth: 3,
    borderColor: "rgba(0, 119, 234,0.3)",
  },
  waypointImageInModal: {
    width: vh(30),
    height: vh(30),
    borderRadius: vh(3),
  },
  waypointFlatlistContainer: {
    height: vh(27),
    marginLeft: vw(3),
  },
  FinishButtonContainer: {
    backgroundColor: "rgba(0, 119, 234,0.19)",
    borderWidth: 1,
    borderColor: "rgba(0, 119, 234,0.39)",
    borderRadius: vh(2),
    width: vw(95),
    alignSelf: "center",
  },
  ImageAndLatLng: {
    backgroundColor: "rgba(0, 119, 234,0.19)",
    borderWidth: 1,
    borderColor: "rgba(0, 119, 234,0.39)",
    borderRadius: vh(2),
    width: vw(95),
    alignSelf: "center",
  },
  latLng: {
    width: vw(45),
  },
  latorLng: {
    // backgroundColor: "green",
    backgroundColor: "white",
    marginVertical: vh(0.3),
    padding: vh(0.4),
    borderRadius: vh(1),
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "orange",
    marginHorizontal: vh(2),
    marginTop: vh(1),
    borderRadius: vh(1.5),
    justifyContent: "space-between",
  },
  profileImage: {
    marginLeft: vw(3),
    marginVertical: vh(1),
    width: vh(15),
    height: vh(15),
    borderRadius: vh(3),
    borderWidth: 3,
    borderColor: "rgba(0, 119, 234,0.3)",
  },
  textInput: {
    lineHeight: 21,
    marginVertical: 1,
    fontSize: 14,
    padding: vw(1),
    width: "90%",
  },
  inputDescription: {
    color: "rgba(0, 119, 234,0.9)",
    fontSize: 13,
    alignSelf: "center",
    width: vw(17),
  },
  socialBox: {
    width: "95%",
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: vh(1),
    marginTop: 2,
    borderWidth: 1,
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  container: {
    flex: 1,
    padding: vh(1),
    margin: vh(2),
    justifyContent: "center",
    backgroundColor: "yellow",
  },
  inputContainer: {
    marginBottom: 10,
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
    marginTop: vh(1),
    // backgroundColor: "orange",
  },
  mapContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 20,
    borderColor: "#93c9ed",
    borderWidth: 3,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: vw(10),
  },
});