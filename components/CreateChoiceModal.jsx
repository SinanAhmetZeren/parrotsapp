/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";

export const CreateChoiceModal = ({ modalVisible, setModalVisible }) => {
  const navigation = useNavigation();

  const handlePressOut = () => {
    setModalVisible(false);
  };
  const handleAddVehicle = () => {
    setModalVisible(false);
    navigation.navigate("CreateVehicleScreen");
  };
  const handleAddVoyage = () => {
    setModalVisible(false);
    navigation.navigate("CreateVoyageScreen");
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={1}
        onPressOut={() => handlePressOut()} // Close modal when touched outside
      >
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableOpacity
            style={styles.centeredView}
            onPressOut={() => handlePressOut()}
          >
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.selection}
                onPress={handleAddVehicle}
              >
                <Text style={styles.choiceText}>New Vehicle</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalView2}>
              <TouchableOpacity
                style={styles.selection2}
                onPress={handleAddVoyage}
              >
                <Text style={styles.choiceText}>New Voyage</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    width: vw(100),
    height: vh(100),
    paddingHorizontal: vh(0.2),
    paddingVertical: vh(0.2),
    position: "absolute",
    alignSelf: "center",
  },
  selection: {
    backgroundColor: "#3c9dde",
    paddingHorizontal: vh(2),
    paddingVertical: vh(1),
    marginHorizontal: vh(0.5),
    marginVertical: vh(0.5),
    borderRadius: vh(2.5),
  },
  selection2: {
    marginHorizontal: vh(0.5),
    marginVertical: vh(0.5),
    backgroundColor: "#3c9dde",
    paddingHorizontal: vh(2),
    paddingVertical: vh(1),
    borderRadius: vh(2.5),
  },
  choiceText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  modalView: {
    backgroundColor: "#3c9dde",
    borderRadius: vh(3),
    borderWidth: 2,
    borderColor: "#1f7ab7",
    width: vw(40),
    position: "absolute",
    // alignSelf: "center",
    // bottom: vh(20),
    alignSelf: "center",
    bottom: vh(13),
    left: vw(9),
  },
  modalView2: {
    backgroundColor: "#3c9dde",
    borderRadius: vh(3),
    borderWidth: 2,
    borderColor: "#1f7ab7",
    width: vw(40),
    position: "absolute",
    //alignSelf: "center",
    // bottom: vh(13),
    right: vw(9),
    alignSelf: "center",
    bottom: vh(13),
  },
});
