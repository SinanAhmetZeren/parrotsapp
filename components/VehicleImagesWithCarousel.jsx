/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useCallback } from "react";
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
import { parrotBlue } from "../assets/color";

const VehicleImagesWithCarousel = ({ vehicleImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const flatListRef = useRef(null);

  const handleImagePress = (index) => {
    setCurrentIndex(index);
    setModalIndex(index);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) setModalIndex(viewableItems[0].index);
  }, []);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });

  return (
    <View>
      <FlatList
        horizontal
        data={vehicleImages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handleImagePress(index)}>
            <View>
              <Image
                source={{ uri: `${item.vehicleImagePath}` }}
                style={carouselStyles.voyageImage1}
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
            data={vehicleImages}
            initialScrollIndex={currentIndex}
            getItemLayout={(data, index) => ({
              length: vw(80) + vh(1),
              offset: (vw(80) + vh(1)) * index,
              index,
            })}
            onScrollToIndexFailed={() => null}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig.current}
            renderItem={({ item }) => (
              <View style={carouselStyles.imageContainerInModal}>
                <Image
                  source={{ uri: `${item.vehicleImagePath}` }}
                  style={carouselStyles.voyageImageInModal}
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={carouselStyles.counterContainer}>
          <Text style={carouselStyles.counterText}>{modalIndex + 1} / {vehicleImages.length}</Text>
        </View>

        <TouchableOpacity
          style={carouselStyles.closeButtonAndText}
          onPress={handleCloseModal}
        >
          <View>
            <Text style={carouselStyles.buttonClose}>Close</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const carouselStyles = StyleSheet.create({
  buttonClose: {
    fontSize: 16,
    fontFamily: "Nunito_800ExtraBold",
    color: "white",
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: parrotBlue,
    paddingHorizontal: vw(7),
    paddingVertical: vh(1),
    borderRadius: vh(2),
    overflow: "hidden",
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
    height: vh(13),
    width: vh(13),
    marginRight: vh(1),
    borderRadius: vh(1.5),
  },
  counterContainer: {
    position: "absolute",
    bottom: vh(29) + 44,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  counterText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  closeButtonAndText: {
    flexDirection: "row",
    position: "absolute",
    borderRadius: vh(2.5),
    bottom: vh(29),
    alignSelf: "center",
  },
});

export default VehicleImagesWithCarousel;
