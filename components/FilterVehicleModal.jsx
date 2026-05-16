/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { parrotBlue, parrotCream, parrotGreen, parrotInputTextColor, parrotTextDarkBlue } from "../assets/color";

const FilterVehicleModal = ({
  isVisible,
  onClose,
  setIsVehicleFiltered,
  selectedVehicleType: selectedValue,
  setSelectedVehicleType: setSelectedValue,
}) => {

  const vehicleTypes = {
    Walk: 4,
    Run: 5,
    Bicycle: 7,
    Motorcycle: 6,
    Caravan: 2,
    Boat: 0,
    Car: 1,
    Bus: 3,
    TinyHouse: 8,
    Airplane: 9,
    Train: 10,
  };

  const handleSelect = (value) => setSelectedValue(value);

  const handleClear = () => {
    setSelectedValue(null);
    setIsVehicleFiltered(false);
    onClose();
  };

  const handleSave = () => {
    setIsVehicleFiltered(selectedValue !== null && selectedValue !== undefined);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Vehicle Type</Text>
          <Text style={styles.subtitle}>Filter voyages by transport type</Text>

          <ScrollView style={{ maxHeight: vh(40) }} showsVerticalScrollIndicator={false}>
            <View style={styles.optionsGrid}>
              {Object.entries(vehicleTypes).map(([type, value]) => (
                <TouchableOpacity
                  key={value}
                  style={[styles.option, selectedValue === value && styles.selectedOption]}
                  onPress={() => handleSelect(value)}
                >
                  <Text style={[styles.optionText, selectedValue === value && styles.selectedOptionText]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleClear} style={styles.buttonCancelContainer}>
              <Text style={styles.buttonClear}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.buttonSendBidContainer}>
              <Text style={styles.buttonSave}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
        </TouchableOpacity>
      </TouchableOpacity>
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
    left: 0, right: 0, top: 0, bottom: 0,
  },
  innerContainer: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 24,
    width: vw(88),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: "Nunito_800ExtraBold",
    color: parrotTextDarkBlue,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "#9aa0aa",
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  option: {
    padding: 10,
    backgroundColor: "#f2f4f7",
    borderRadius: 50,
    width: "48%",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: parrotGreen,
  },
  optionText: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: parrotInputTextColor,
  },
  selectedOptionText: {
    color: "white",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  buttonSendBidContainer: {
    flex: 1,
    backgroundColor: parrotBlue,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  buttonSave: {
    fontSize: 16,
    color: "white",
    fontFamily: "Nunito_700Bold",
    textAlign: "center",
  },
  buttonCancelContainer: {
    flex: 1,
    backgroundColor: "#f2f4f7",
    borderRadius: 50,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonClear: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#9aa0aa",
    textAlign: "center",
  },
});

export default FilterVehicleModal;
