/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  Text,
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { API_URL } from "@env";

const VehicleImagesWithCarousel = ({ vehicleImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const handleImagePress = (index) => {
    setCurrentIndex(index);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const flatListRef = useRef(null);

  return (
    <View>
      <FlatList
        horizontal
        data={vehicleImages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              handleImagePress(index);
            }}
          >
            <View>
              <Image
                source={{
                  uri: `${API_URL}/Uploads/VehicleImages/${item.vehicleImagePath}`,
                }}
                style={styles2.voyageImage1}
              />
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
        style={{ flex: 1, backgroundColor: "rgba(1,1,1,0.1)", height: vh(50) }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(1,1,1,0.4)",
            height: vh(50),
            paddingRight: vw(10),
          }}
        >
          <FlatList
            ref={flatListRef}
            horizontal
            data={
              vehicleImages
                .slice(currentIndex)
                .concat(vehicleImages.slice(0, currentIndex))
              //   .concat(
              //     voyageImages
              //       .slice(currentIndex)
              //       .concat(voyageImages.slice(0, currentIndex))
              //   )
              //   .concat(
              //     voyageImages
              //       .slice(currentIndex)
              //       .concat(voyageImages.slice(0, currentIndex))
              //   )
            }
            initialScrollIndex={0}
            onScrollToIndexFailed={(error) => {
              return null;
            }}
            renderItem={({ item, index }) => (
              <View style={styles2.imageContainerInModal}>
                <Image
                  source={{
                    uri: `${API_URL}/Uploads/VehicleImages/${item.vehicleImagePath}`,
                  }}
                  style={styles2.voyageImageInModal}
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        <TouchableOpacity
          style={styles2.closeButtonAndText}
          onPress={handleCloseModal}
        >
          <View>
            <Text style={styles2.buttonClose}>Close</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles2 = StyleSheet.create({
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
    marginTop: vh(1),
  },
  imageContainerInModal: {
    top: vh(30),
    height: vh(40),
    paddingLeft: vw(10),
    backgroundColor: "transparent",
  },
  voyageImageInModal: {
    height: vh(35),
    width: vw(80),
    marginRight: vh(1),
    borderRadius: vh(1.5),
    borderWidth: 2,
    borderColor: "white",
  },

  voyageImage1: {
    height: vh(17),
    width: vh(17),
    marginRight: vh(1),
    borderRadius: vh(2.5),
  },
  closeButtonAndText: {
    flexDirection: "row",
    position: "absolute",
    width: vh(11.45),
    borderRadius: vh(2.5),
    bottom: vh(29),
    alignSelf: "center",
  },
});

export default VehicleImagesWithCarousel;
