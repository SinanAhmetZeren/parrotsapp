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
            style={{ flex: 1 }}
            onPressOut={() => handlePressOut()}
          >
            <View style={styles.centeredView}>
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
            </View>
          </TouchableOpacity>
        </Modal>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    width: vw(95),
    height: vh(12),
    paddingHorizontal: vh(0.2),
    paddingVertical: vh(0.2),
    position: "absolute",
    bottom: vh(14),
    alignSelf: "center",
    backgroundColor: "rgba(205,230,247,.8)",
    borderRadius: vh(4),
  },
  modalView: {
    backgroundColor: "#2184c6",
    borderRadius: vh(3),
    borderWidth: 2,
    borderColor: "#76bae8",
    width: vw(40),
    position: "absolute",
    bottom: vh(2.5),
    alignSelf: "center",
    left: vw(4),
  },
  modalView2: {
    backgroundColor: "#2184c6",
    borderRadius: vh(3),
    borderWidth: 2,
    borderColor: "#76bae8",
    width: vw(40),
    position: "absolute",
    right: vw(4),
    alignSelf: "center",
    bottom: vh(2.5),
  },
  choiceText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  selection: {
    marginHorizontal: vh(0.5),
    marginVertical: vh(0.5),
    paddingHorizontal: vh(2),
    paddingVertical: vh(1),
    backgroundColor: "#15537d",
    borderRadius: vh(2.5),
  },
  selection2: {
    marginHorizontal: vh(0.5),
    marginVertical: vh(0.5),
    paddingHorizontal: vh(2),
    paddingVertical: vh(1),
    backgroundColor: "#15537d",
    borderRadius: vh(2.5),
  },
});

const styles2 = StyleSheet.create({
  centeredView: {
    width: vw(100),
    height: vh(100),
    paddingHorizontal: vh(0.2),
    paddingVertical: vh(0.2),
    position: "absolute",
    alignSelf: "center",
    // backgroundColor: "pink",
  },
  selection: {
    marginHorizontal: vh(0.5),
    marginVertical: vh(0.5),
    paddingHorizontal: vh(2),
    paddingVertical: vh(1),
    backgroundColor: "#15537d",
    borderRadius: vh(2.5),
  },
  selection2: {
    marginHorizontal: vh(0.5),
    marginVertical: vh(0.5),
    paddingHorizontal: vh(2),
    paddingVertical: vh(1),
    backgroundColor: "#15537d",
    borderRadius: vh(2.5),
  },
  modalView: {
    backgroundColor: "#2184c6",
    borderRadius: vh(3),
    borderWidth: 2,
    borderColor: "#76bae8",
    width: vw(40),
    position: "absolute",
    alignSelf: "center",
    bottom: vh(15),
    left: vw(7),
  },
  modalView2: {
    backgroundColor: "#2184c6",
    borderRadius: vh(3),
    borderWidth: 2,
    borderColor: "#76bae8",
    width: vw(40),
    position: "absolute",
    right: vw(7),
    alignSelf: "center",
    bottom: vh(15),
  },
  choiceText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
});
