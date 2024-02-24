/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

const VoyageImagesWithCarousel = ({ voyageImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log(currentIndex);
  }, [currentIndex]);

  const handleImagePress = (index) => {
    setCurrentIndex(index + 1);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <FlatList
        horizontal
        data={voyageImages}
        keyExtractor={(item) => item.id}
        // windowSize={9}
        renderItem={({ item, index }) => {
          // console.log(index);
          return (
            <TouchableOpacity onPress={() => handleImagePress(index)}>
              <View style={styles2.imageContainer1}>
                <Image
                  source={{
                    uri: `https://measured-wolf-grossly.ngrok-free.app/Uploads/VoyageImages/${item.voyageImagePath}`,
                  }}
                  style={styles2.voyageImage1}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={{ flex: 1 }}></View>
      </Modal>
    </View>
  );
};

const styles2 = StyleSheet.create({
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
});

export default VoyageImagesWithCarousel;
