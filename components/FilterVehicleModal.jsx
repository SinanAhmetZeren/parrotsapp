import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { View,  Modal, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { parrotBlue, parrotCream, parrotGreen, parrotInputTextColor, parrotTextDarkBlue, parrotAirplaneLightGreen, parrotCarRed, parrotCaravanOrangeRed, parrotBusYellowGreen, parrotWalkTurquoise, parrotRunLightOrange, parrotMotorcycleDarkRed, parrotBicycleTealGreen, parrotTinyHouseLightYellow, parrotBoatPurple, parrotTrainPink } from "../assets/color";

const vehicleColors = {
  0: parrotBoatPurple,
  1: parrotCarRed,
  2: parrotCaravanOrangeRed,
  3: parrotBusYellowGreen,
  4: parrotWalkTurquoise,
  5: parrotRunLightOrange,
  6: parrotMotorcycleDarkRed,
  7: parrotBicycleTealGreen,
  8: parrotTinyHouseLightYellow,
  9: parrotAirplaneLightGreen,
  10: parrotTrainPink,
};

const lightColors = new Set([4, 5, 6, 7, 10]);

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
          <ParrotsStdText style={styles.title}>Vehicle Type</ParrotsStdText>
          <ParrotsStdText style={styles.subtitle}>Filter voyages by transport type</ParrotsStdText>

          <ScrollView style={{ maxHeight: vh(40) }} showsVerticalScrollIndicator={false}>
            <View style={styles.optionsGrid}>
              {Object.entries(vehicleTypes).map(([type, value]) => {
                const color = vehicleColors[value];
                const isSelected = selectedValue === value;
                const isLight = lightColors.has(value);
                return (
                  <TouchableOpacity
                    key={value}
                    style={[styles.option, { backgroundColor: isSelected ? color : color + "0D", borderWidth: 1, borderColor: isSelected ? "transparent" : "rgba(150,150,150,0.5)" }]}
                    onPress={() => handleSelect(value)}
                  >
                    <ParrotsStdText style={[styles.optionText, { color: isSelected ? "white" : "#555" }]}>
                      {type}
                    </ParrotsStdText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleClear} style={styles.buttonCancelContainer}>
              <ParrotsStdText style={styles.buttonClear}>Clear</ParrotsStdText>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.buttonSendBidContainer}>
              <ParrotsStdText style={styles.buttonSave}>Ok</ParrotsStdText>
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
  optionText: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
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
