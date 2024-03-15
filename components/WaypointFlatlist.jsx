/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  textInput,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";

export const WaypointFlatList = ({ addedWayPoints }) => {
  return (
    <FlatList
      horizontal
      data={addedWayPoints}
      keyExtractor={(item) => item.order}
      renderItem={({ item, index }) => {
        return (
          <View key={index}>
            <WaypointItem
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

export const WaypointFlatListVoyageDetailsScreen = ({
  addedWayPoints,
  focusMap,
}) => {
  let baseUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/WaypointImages/`;
  return (
    <FlatList
      horizontal
      data={addedWayPoints}
      keyExtractor={(item) => item.order}
      renderItem={({ item, index }) => {
        let newUri = baseUrl + item.profileImage;
        return (
          <View key={index}>
            <WaypointItemVoyageDetailScreen
              title={item.title}
              description={item.description}
              imageUri={newUri}
              latitude={item.latitude}
              longitude={item.longitude}
              focusMap={focusMap}
            />
          </View>
        );
      }}
    />
  );
};

export const WaypointItemVoyageDetailScreen = ({
  title,
  description,
  imageUri,
  latitude,
  longitude,
  focusMap,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleFocusMap = () => {
    focusMap(latitude, longitude);
  };

  const handleShowModal = () => {
    setModalVisible(true);
  };

  const truncatedDescription =
    description.length > 70 ? `${description.slice(0, 70)}...` : description;

  return (
    <>
      <TouchableOpacity onPress={() => handleFocusMap()}>
        <View style={styles.waypointCard}>
          <View>
            <Image source={{ uri: imageUri }} style={styles.profileImage} />
          </View>

          <View style={styles.titleAndDescription}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{truncatedDescription}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleShowModal()}>
        <Text style={styles.seeDetails}>See Details</Text>
      </TouchableOpacity>

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
            <Text style={styles.waypointDescriptionInModal}>{description}</Text>
            <TouchableOpacity
              style={styles.closeWaypointModalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeWaypointModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export const WaypointItem = ({ title, description, imageUri }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const truncatedDescription =
    description.length > 70 ? `${description.slice(0, 70)}...` : description;

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.waypointCard}>
          <View>
            <Image source={{ uri: imageUri }} style={styles.profileImage} />
          </View>

          <View style={styles.titleAndDescription}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{truncatedDescription}</Text>
          </View>
        </View>
      </TouchableOpacity>

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
            <Text style={styles.waypointDescriptionInModal}>{description}</Text>
            <TouchableOpacity
              style={styles.closeWaypointModalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeWaypointModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    height: vh(47),
  },
  title: {
    fontWeight: "600",
    paddingBottom: vh(1),
  },
  description: {
    width: vw(35),
    marginBottom: vh(2),
  },
  titleAndDescription: {
    paddingVertical: vh(1),
  },
  waypointCard: {
    width: vw(70),
    flexDirection: "row",
    backgroundColor: "#eff3f6",
    borderRadius: vh(3),
    margin: vh(0.2),
  },
  profileImage: {
    margin: vh(1),
    width: vh(13),
    height: vh(13),
    borderRadius: vh(3),
    borderColor: "rgba(0, 119, 234,0.3)",
    backgroundColor: "white",
  },
  closeWaypointModalButtonText: {
    fontWeight: "800",
    color: "purple",
  },
  closeWaypointModalButton: {
    alignSelf: "flex-end",
    position: "absolute",
    bottom: 0,
    width: vw(15),
  },
  waypointTitleInModal: {
    fontWeight: "700",
    fontSize: 18,
    marginTop: vh(0.5),
    alignSelf: "center",
  },
  waypointDescriptionInModal: {
    paddingHorizontal: vw(2),
    fontWeight: "500",
    fontSize: 14,
  },
  waypointModalContainer: {
    borderWidth: 2,
    borderColor: "rgba(0, 119, 234,0.19)",
    backgroundColor: "white",
    height: vh(50),
    top: vh(20),
    width: vw(80),
    alignSelf: "center",
    borderRadius: vh(5),
    padding: vh(2),
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
    width: vh(24),
    height: vh(24),
    borderRadius: vh(1),
  },
  seeDetails: {
    color: "rgba(0, 119, 234,1)",
    fontWeight: "600",
    position: "absolute",
    bottom: vh(1),
    right: vw(2),
  },
});
