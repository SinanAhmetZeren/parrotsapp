/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";

export const CreateChoiceModal = ({ modalVisible, setModalVisible }) => {
  const navigation = useNavigation();
  const [slideAnim] = useState(new Animated.Value(300));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (modalVisible) {
      setIsVisible(true);
      slideAnim.setValue(300);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
      });
    }
  }, [modalVisible]);


  const handlePressOut = () => {
    setModalVisible(false);
  };

  const handleAddVehicle = () => {
    setModalVisible(false);
    navigation.navigate("Create", { screen: "CreateVehicleScreen" });
  };

  const handleAddVoyage = () => {
    setModalVisible(false);
    navigation.navigate("Create", { screen: "CreateVoyageScreen" });
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPressOut={handlePressOut}>
        <Animated.View style={[styles.centeredView, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.selection} onPress={handleAddVehicle}>
              <Text style={styles.choiceText}>New Vehicle</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalView2}>
            <TouchableOpacity style={styles.selection2} onPress={handleAddVoyage}>
              <Text style={styles.choiceText}>New Voyage</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    width: vw(75),
    height: vh(6.5),
    paddingHorizontal: vh(0.2),
    paddingVertical: vh(0.2),
    bottom: vh(-87),
    alignSelf: "center",
    backgroundColor: "rgba(205,230,247,1)",
    backgroundColor: "#ede2d5ff",
    borderRadius: vh(4),
    borderBottomRightRadius: vh(0),
    borderBottomLeftRadius: vh(0),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalView: {
    backgroundColor: "#186ff1",
    borderRadius: vh(3),
    alignSelf: "center",
  },
  modalView2: {
    backgroundColor: "#186ff1",
    borderRadius: vh(3),
    alignSelf: "center",
  },
  choiceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  selection: {
    marginHorizontal: vh(0.5),
    marginVertical: vh(0.5),
    paddingHorizontal: vh(2),
    paddingVertical: vh(0.5),
    borderRadius: vh(2.5),
  },
  selection2: {
    marginHorizontal: vh(0.5),
    marginVertical: vh(0.5),
    paddingHorizontal: vh(2),
    paddingVertical: vh(0.5),
    borderRadius: vh(2.5),
  },
});
