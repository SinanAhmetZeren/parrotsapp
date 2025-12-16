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
  ScrollView,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { API_URL } from "@env";
import {
  parrotBlue,
  parrotBlueMediumTransparent,
  parrotBlueSemiTransparent,
  parrotBlueTransparent,
  parrotDarkBlue,
  parrotTextDarkBlue,
} from "../assets/color";
import { useDeleteWaypointMutation } from "../slices/VoyageSlice";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Shadow } from "react-native-shadow-2";

export const WaypointFlatList = ({ addedWayPoints, handleDeleteWaypoint, voyageProfileImage }) => {

  return (
    <FlatList
      horizontal
      data={addedWayPoints}
      keyExtractor={(item, index) => `${item.order}-${index}`}
      renderItem={({ item, index }) => {
        return (
          <View key={index} style={{ backgroundColor: "" }}>
            <WaypointItem
              title={item.title}
              description={item.description}
              imageUri={item.imageUri}
              waypointId={item.waypointId}
              handleDeleteWaypoint={handleDeleteWaypoint}
              voyageProfileImage={voyageProfileImage}
              hasImage={item.hasImage}
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
  voyageProfileImage
}) => {

  return (
    <FlatList
      style={{ padding: vh(0.52) }}
      horizontal
      data={addedWayPoints}
      keyExtractor={(item, index) => `${item.order}-${index}`}
      renderItem={({ item, index }) => {
        let newUri = item.profileImage;
        return (
          <Shadow
            distance={8}
            offset={[0, 0]}
            startColor="rgba(0,0,0,0.05)"
            finalColor="rgba(0,0,0,0.10)"
            radius={11}
            style={{ marginRight: vh(1.5) }}
          >
            <View key={index} style={{ borderRadius: vh(3), }}>
              <WaypointItemVoyageDetailScreen
                title={item.title}
                description={item.description}
                imageUri={newUri}
                latitude={item.latitude}
                longitude={item.longitude}
                focusMap={focusMap}
                voyageProfileImage={voyageProfileImage}
              />
            </View>
          </Shadow>
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
  voyageProfileImage
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleFocusMap = () => {
    focusMap(latitude, longitude);
  };

  const handleShowModal = () => {
    setModalVisible(true);
  };

  const hasImage = typeof imageUri === 'string' && imageUri.trim().length > 0;


  return (
    <View
      style={{
        marginVertical: vh(0.5),
        borderRadius: vh(3),
      }}
    >
      <TouchableOpacity onPress={() => handleFocusMap()} >
        <View style={styles.waypointCard}>
          <View>
            <Image
              source={hasImage ? { uri: imageUri } : { uri: voyageProfileImage }}
              style={hasImage ? styles.waypointCardImage : { ...styles.waypointCardImage, opacity: 0.25 }}
            />
          </View>

          <View style={styles.titleAndDescription}>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
            <Text numberOfLines={6} style={styles.description}>
              {description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleShowModal()}>
        <Text style={styles.seeDetails}>See Details</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(1,1,1,0.4)",
          }}
        >
          {/* // modal edited // */}
          <View style={styles.imageContainerInModal}>
            <Image
              source={{ uri: imageUri }}
              style={styles.voyageImageInModal}
            />
            <ScrollView style={styles.scrollView}>
              <Text numberOfLines={2} style={styles.waypointTitleInModal2}>
                {title}
              </Text>
              <Text style={styles.waypointDescriptionInModal2}>
                {description}
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButtonAndText}
              onPress={() => setModalVisible(false)}
            >
              <View>
                <Text style={styles.buttonClose}>Close</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const WaypointItem = ({ title, description, imageUri, waypointId, handleDeleteWaypoint, hasImage }) => {
  const [modalVisibleX, setModalVisibleX] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={{ marginTop: vh(3) }}
        onPress={() => {
          setModalVisibleX(true);
        }}
      >
        <Image source={{ uri: imageUri }} style={{ ...styles.voyageImageInModalX, opacity: hasImage ? 1 : 0.25 }} />
        <ScrollView style={styles.scrollViewX}>
          <Text numberOfLines={1} style={styles.waypointTitleInModal2}>
            {title}
          </Text>
          <Text numberOfLines={6} style={styles.waypointDescriptionInModal2}>
            {description}
          </Text>
        </ScrollView>
        <TouchableOpacity
          onPress={() => handleDeleteWaypoint(waypointId)}
          style={styles.deleteAddedWaypointContainer}>
          <Text style={styles.deleteAddedWaypoint}>
            <MaterialIcons
              name="cancel"
              size={24}
              color="darkred"
            />
          </Text>
        </TouchableOpacity>
      </TouchableOpacity >



      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleX}
        onRequestClose={() => setModalVisibleX(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(1,1,1,0.4)",
          }}
        >
          {/* // modal edited // */}
          <View style={styles.imageContainerInModal}>
            <Image
              source={{ uri: imageUri }}
              style={styles.voyageImageInModal}
            />
            <ScrollView style={styles.scrollView}>
              <Text style={styles.waypointTitleInModal2}>{title}</Text>
              <Text style={styles.waypointDescriptionInModal2}>
                {description}
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButtonAndText}
              onPress={() => setModalVisibleX(false)}
            >
              <View>
                <Text style={styles.buttonClose}>Close</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View >
  );
};

const styles = StyleSheet.create({
  deleteAddedWaypoint: {
    backgroundColor: "white",
    borderRadius: vh(3),
    width: vh(3)
  },
  deleteAddedWaypointContainer:
  {
    height: vh(5), width: vh(5),
    position: "absolute",
    top: vh(-2),
    right: 0,
    justifyContent: "center",
    borderRadius: vh(5),
    alignContent: "center",
    alignItems: "center"
  },
  buttonClose: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: "#186ff1",
    width: vw(30),
    borderRadius: vh(4),
    padding: vw(1),
  },
  logo: {
    height: vh(5),
    width: vh(5),
    borderRadius: vh(10),
  },
  closeButtonInModal2: {
    alignSelf: "center",
    backgroundColor: "rgba(217, 241, 241,.75)",
    borderRadius: vh(10),
    padding: vh(1.5),
    borderColor: "#93c9ed",
  },
  scrollView: {
    height: vh(15),
    top: vh(-15) - 2,
    backgroundColor: "rgba(11,11,11,0.5)",
    marginLeft: 2,
    borderRadius: vh(1),
  },
  scrollViewX: {
    height: vh(12),
    top: vh(-12) - 2,
    width: vw(78),
    marginLeft: 4,
    borderRadius: vh(1),
    backgroundColor: "rgba(11,11,11,0.5)",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  closeButtonAndText: {
    flexDirection: "row",
    borderRadius: vh(2.5),
    borderColor: "#3aa4ff",
    top: vh(-14),
    alignSelf: "center",
  },
  closeText1: {
    marginLeft: vw(1),
    fontSize: 18,
    height: vh(3),
    alignSelf: "center",
    color: "#3aa4ff",
  },
  closeWaypointModalButton2: {
    alignSelf: "flex-end",
    width: vw(15),
  },
  waypointTitleInModal2: {
    fontWeight: "600",
    fontSize: 18,
    marginTop: vh(0.5),
    alignSelf: "center",
    color: "white",
  },
  waypointDescriptionInModal2: {
    paddingHorizontal: vw(2),
    fontWeight: "500",
    fontSize: 14,
    color: "white",
  },
  voyageImageInModal: {
    height: vh(40),
    width: vh(40),
    marginRight: vh(1),
    borderRadius: vh(1.5),
    borderWidth: 2,
    borderColor: "white",
  },
  voyageImageInModalX: {
    height: vh(30),
    width: vw(80),
    marginRight: vh(1),
    borderRadius: vh(1.5),
    borderWidth: 2,
    borderColor: "white",
  },
  imageContainerInModal: {
    top: vh(30),
    paddingHorizontal: vw(10),
    backgroundColor: "transparent",
  },

  modalContent: {
    height: vh(47),
  },
  title: {
    fontWeight: "600",
    color: parrotTextDarkBlue,
    textAlign: "center",
  },
  description: {
    width: vw(42),
    paddingLeft: vw(2),
    color: parrotTextDarkBlue,
  },
  titleAndDescription: {
    paddingVertical: vh(0.5),
    paddingHorizontal: vh(0.7),
    // backgroundColor: "lightblue",
  },
  waypointCard: {
    // width: vw(80),
    width: vh(40),
    flexDirection: "row",
    borderRadius: vh(3),
    backgroundColor: "rgba(0, 119, 234,0.05)",
    backgroundColor: "white",
    overflow: "hidden",
  },
  profileImage: {
    margin: vh(1),
    width: vh(13),
    height: vh(13),
    borderRadius: vh(3),
    borderColor: "rgba(0, 119, 234,0.3)",
    backgroundColor: "white",
  },
  waypointCardImage: {
    width: vh(17),
    height: vh(20),
    borderRadius: vh(3),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: "rgba(0, 119, 234,0.3)",
    backgroundColor: "white",
  },
  waypointCardDefaultImage: {
    width: vh(17),
    height: vh(20),
    borderRadius: vh(3),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: "rgba(0, 119, 234,0.3)",
    backgroundColor: "white",
    resizeMode: "contain",
    opacity: 0.25
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
    fontWeight: "600",
    position: "absolute",
    bottom: vh(1),
    right: vw(2),
    color: parrotTextDarkBlue,
  },
});
