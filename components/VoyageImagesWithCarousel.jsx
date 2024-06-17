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

const VoyageImagesWithCarousel = ({ voyageImages }) => {
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
        data={voyageImages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              handleImagePress(index);
            }}
          >
            <View style={styles2.imageContainer1}>
              <Image
                source={{
                  uri: `${API_URL}/Uploads/VoyageImages/${item.voyageImagePath}`,
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
        // style={{ flex: 1, backgroundColor: "rgba(1,1,1,0.1)", height: vh(50) }}
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
            data={voyageImages
              .slice(currentIndex)
              .concat(voyageImages.slice(0, currentIndex))}
            initialScrollIndex={0}
            onScrollToIndexFailed={(error) => {
              return null;
            }}
            renderItem={({ item, index }) => (
              <View style={styles2.imageContainerInModal}>
                <Image
                  source={{
                    uri: `${API_URL}/Uploads/VoyageImages/${item.voyageImagePath}`,
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
          <View style={styles2.closeButtonInModal2}>
            <Image
              style={styles2.logo}
              source={require("../assets/close-icon.png")}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles2 = StyleSheet.create({
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
    marginBottom: vh(15),
  },
  modalWrappeer: {
    position: "absolute",
    top: 0,
    backgroundColor: "red",
    height: vh(10),
    width: vw(80),
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

  imageContainer1: {
    // backgroundColor: "white",
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
    borderRadius: vh(2.5),
    bottom: vh(11),
    alignSelf: "center",
  },
  closeText1: {
    marginLeft: vw(1),
    fontSize: 18,
    height: vh(3),
    alignSelf: "center",
    color: "#3aa4ff",
  },
  closeText2: {
    fontSize: 18,
    height: vh(3),
    alignSelf: "center",
    color: "#3aa4ff",
  },
  pagerView: {
    backgroundColor: "rgba(111,1,1,0.01)",
    height: vh(50),
    flex: 1,
  },
  pagerInside: {
    height: vh(50),
    width: vw(100),
  },
});

export default VoyageImagesWithCarousel;
