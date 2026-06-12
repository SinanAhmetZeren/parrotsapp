import { ParrotsStdText } from "./ParrotsStdText";
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
import { API_URL } from "@env";
import { parrotBlue } from "../assets/color";

const VoyageImagesWithCarousel = ({ voyageImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const handleImagePress = (index) => {
    setCurrentIndex(index);
    setModalIndex(index);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const flatListRef = useRef(null);
  const [modalIndex, setModalIndex] = useState(0);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) setModalIndex(viewableItems[0].index);
  }, []);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });

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
            <View>
              <Image
                source={{
                  uri: `${item.voyageImagePath}`,
                }}
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
            data={voyageImages}
            initialScrollIndex={currentIndex}
            getItemLayout={(data, index) => ({
              length: vw(80) + vh(1),
              offset: (vw(80) + vh(1)) * index,
              index,
            })}
            onScrollToIndexFailed={() => null}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig.current}
            renderItem={({ item, index }) => (
              <View style={carouselStyles.imageContainerInModal}>
                <Image
                  source={{
                    uri: `${item.voyageImagePath}`,
                  }}
                  style={carouselStyles.voyageImageInModal}
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={carouselStyles.counterContainer}>
          <ParrotsStdText style={carouselStyles.counterText}>{modalIndex + 1} / {voyageImages.length}</ParrotsStdText>
        </View>

        <TouchableOpacity
          style={carouselStyles.closeButtonAndText}
          onPress={handleCloseModal}
        >
          <View>
            <ParrotsStdText style={carouselStyles.buttonClose}>Close</ParrotsStdText>
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
  logo: {
    height: vh(5),
    width: vh(5),
    borderRadius: vh(10),
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

export default VoyageImagesWithCarousel;
