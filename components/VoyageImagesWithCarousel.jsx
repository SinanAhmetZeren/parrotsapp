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
import { AntDesign } from "@expo/vector-icons";
import { vw, vh } from "react-native-expo-viewport-units";
import PagerView from "react-native-pager-view";

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

  const Pager = () => {
    return (
      <PagerView style={styles2.pagerView} initialPage={currentIndex}>
        {voyageImages.map((item, index) => (
          <View key={index} style={styles2.dummyText}>
            <Image
              source={{
                uri: `https://measured-wolf-grossly.ngrok-free.app/Uploads/VoyageImages/${item.voyageImagePath}`,
              }}
              style={styles2.carouselImage}
            />
          </View>
        ))}
      </PagerView>
    );
  };

  const flatListRef = useRef(null);

  return (
    <View>
      <FlatList
        horizontal
        data={voyageImages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
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
        )}
      />

      <Modal
        animationType="fade"
        transparent={false}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        {/* <Pager /> */}

        <FlatList
          horizontal
          data={voyageImages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => handleImagePress(index)}>
              <View style={styles2.imageContainerModal}>
                <Image
                  source={{
                    uri: `https://measured-wolf-grossly.ngrok-free.app/Uploads/VoyageImages/${item.voyageImagePath}`,
                  }}
                  style={styles2.voyageImageModal}
                />
              </View>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          style={styles2.closeButtonAndText}
          onPress={handleCloseModal}
        >
          <View style={styles2.closeText1}>
            <AntDesign name="closecircleo" size={22} color="rgb(148,1,1)" />
          </View>
          <Text style={styles2.closeText1}>Close</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles2 = StyleSheet.create({
  dummyText: { backgroundColor: "transparent" },
  modalWrappeer: {
    position: "absolute",
    top: 0,
    backgroundColor: "red",
    height: vh(10),
    width: vw(80),
  },
  imageContainerModal: {
    backgroundColor: "yellow",
  },
  voyageImageModal: {
    height: vh(40),
    width: vh(40),
    marginRight: vh(1),
    borderRadius: vh(1.5),
  },

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
    left: vw(35),
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
