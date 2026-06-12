import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { parrotBlue, parrotGreen, parrotTextDarkBlue, parrotLightBlue } from "../assets/color";

const FilterCountModal = ({
  isVisible,
  setIsVisible,
  onClose,
  setIsCountFiltered,
  count,
  setCount,
}) => {

  const handleIncrement = () => setCount((c) => c + 1);

  const handleDecrement = () => {
    if (count > 1) setCount(count - 1);
  };

  const handleClear = () => {
    setCount(1);
    setIsCountFiltered(false);
    onClose();
  };

  const handleSave = () => {
    onClose();
    setIsCountFiltered(count !== 1);
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
          <ParrotsStdText style={styles.title}>Vacancy</ParrotsStdText>
          <ParrotsStdText style={styles.subtitle}>Spots needed for your group</ParrotsStdText>

          <View style={styles.inputMainContainer}>
            <ParrotsStdText style={styles.inputLabel}>Spots</ParrotsStdText>
            <View style={styles.counterContainer}>
              <TouchableOpacity onPress={handleDecrement} style={styles.decrementButtonContainer}>
                <ParrotsStdText style={styles.buttonCount}>-</ParrotsStdText>
              </TouchableOpacity>
              <TextInput
                style={styles.bidInput}
                keyboardType="numeric"
                value={count.toString()}
                onChangeText={(text) => { const n = text.replace(/[^0-9]/g, ""); setCount(n === "" ? 1 : Math.max(1, parseInt(n, 10))); }}
              />
              <TouchableOpacity onPress={handleIncrement} style={styles.incrementButtonContainer}>
                <ParrotsStdText style={styles.buttonCount}>+</ParrotsStdText>
              </TouchableOpacity>
            </View>
          </View>

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
    marginBottom: 20,
  },
  inputMainContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 13,
    color: "#9aa0aa",
    fontFamily: "Nunito_600SemiBold",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  decrementButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    width: vw(22),
    height: vh(5.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  incrementButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    width: vw(22),
    height: vh(5.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonCount: {
    fontSize: 26,
    fontFamily: "Nunito_700Bold",
    color: parrotGreen,
    textAlign: "center",
  },
  bidInput: {
    color: parrotGreen,
    fontSize: 28,
    fontFamily: "Nunito_800ExtraBold",
    width: vw(28),
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
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

export default FilterCountModal;
