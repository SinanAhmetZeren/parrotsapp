/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { Ionicons } from "@expo/vector-icons";

const FilterVehicleModal = ({ isVisible, onClose, setIsVehicleFiltered }) => {
  const vehicleTypes = ["Car", "Bus", "Boat", "Bicycle"];
  const [selectedValue, setSelectedValue] = useState(null);

  const handleSelect = (value) => {
    setSelectedValue(value);
  };
  const handleClear = () => {
    setSelectedValue(null);
    setIsVehicleFiltered(false);
    onClose();
  };

  const handleSave = () => {
    console.log("selected vehicle is: ", selectedValue);
    if (selectedValue) {
      setIsVehicleFiltered(true);
    } else {
      setIsVehicleFiltered(false);
    }
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Select Vehicle Type</Text>
          {vehicleTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.option,
                selectedValue === type && styles.selectedOption,
              ]}
              onPress={() => handleSelect(type)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedValue === type && styles.selectedOptionText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={handleClear}
              style={styles.buttonClearContainer}
            >
              <Text style={styles.buttonClear}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={styles.buttonSaveContainer}
            >
              <Text style={styles.buttonSave}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.floatingIcon}>
          <Ionicons
            style={styles.icon}
            name="car-outline"
            size={24}
            color="black"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    left: 0,
    right: 0,
    paddingTop: vh(17),
    paddingBottom: vh(70),
  },
  innerContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  option: {
    padding: 10,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    marginVertical: 2,
  },
  selectedOption: {
    backgroundColor: "#2ac898",
    borderRadius: 8,
  },
  selectedOptionText: {
    color: "#fff", // Change the text color for selected option
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around",
  },

  buttonSaveContainer: {
    alignItems: "center",
  },
  buttonClearContainer: {
    alignItems: "center",
  },
  buttonSave: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    backgroundColor: "#186ff1",
    padding: 5,
    width: vw(30),
    borderRadius: 10,
    marginTop: 5,
  },
  buttonClear: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    backgroundColor: "#2ac898",
    padding: 5,
    width: vw(30),
    borderRadius: 10,
    marginTop: 5,
  },
  floatingIcon: {
    backgroundColor: "white",
    height: 40,
    width: 40,
    borderRadius: 15,
    position: "absolute",
    top: vh(10),
    right: vw(14),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FilterVehicleModal;