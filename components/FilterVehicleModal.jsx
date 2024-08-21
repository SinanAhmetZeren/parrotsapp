/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { Ionicons } from "@expo/vector-icons";

const FilterVehicleModal = ({
  isVisible,
  onClose,
  setIsVehicleFiltered,
  selectedVehicleType: selectedValue,
  setSelectedVehicleType: setSelectedValue,
}) => {
  const vehicleTypes2 = [
    "Boat",
    "Car",
    "Caravan",
    "Bus",
    "Walk",
    "Run",
    "Motorcycle",
    "Bicycle",
    "TinyHouse",
    "Airplane",
  ];

  const vehicleTypes = {
    Boat: 0,
    Car: 1,
    Caravan: 2,
    Bus: 3,
    Walk: 4,
    Run: 5,
    Motorcycle: 6,
    Bicycle: 7,
    TinyHouse: 8,
    Airplane: 9,
  };

  const handleSelect = (value) => {
    setSelectedValue(value);
  };
  const handleClear = () => {
    setSelectedValue(null);
    setIsVehicleFiltered(false);
    onClose();
  };

  const handleSave = () => {
    if (selectedValue !== null && selectedValue !== undefined) {
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

          {Object.entries(vehicleTypes).map(([type, value]) => (
            <TouchableOpacity
              key={value} // Assuming values are unique
              style={[
                styles.option,
                selectedValue === value && styles.selectedOption,
              ]}
              onPress={() => handleSelect(value)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedValue === value && styles.selectedOptionText,
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
              <Text style={styles.buttonSave}>Ok</Text>
            </TouchableOpacity>
          </View>
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
    fontWeight: "700",
    color: "grey",
    marginLeft: vw(5),
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
});

export default FilterVehicleModal;
