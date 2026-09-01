import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { vh, vw } from "react-native-expo-viewport-units";
import { parrotBlue, parrotCream } from "../assets/color";

const StepBar = ({ currentStep, onFirstStepPress }) => {
  const StepBarStep = ({ displayText, stepNumber, onPress }) => {
    const isActive = stepNumber === currentStep;

    return (
      <TouchableOpacity
        style={[isActive ? styles.activeStep : styles.inactiveStep, styles.second]}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        <ParrotsStdText style={isActive ? styles.activeStepText : styles.inactiveStepText}>
          {displayText}
        </ParrotsStdText>
      </TouchableOpacity>
    );
  };

  const displayTexts2 = ["Voyage Details", "Images & Waypoints"];

  return (
    <View style={styles.mainContainer}>
      <StepBarStep displayText={displayTexts2[0]} stepNumber={1} onPress={currentStep === 2 ? onFirstStepPress : null} />
      <StepBarStep displayText={displayTexts2[1]} stepNumber={2} />
    </View>
  );
};

export default StepBar;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    backgroundColor: parrotCream,
    borderRadius: vh(3),
    marginVertical: vh(1),
    marginHorizontal: vw(4),
    alignItems: "center",
    padding: vh(0.6),
  },
  activeStep: {
    backgroundColor: parrotBlue,
    borderRadius: vh(3),
  },
  activeStepText: {
    fontFamily: "Nunito_700Bold",
    color: "white",
    fontSize: 15,
  },
  inactiveStepText: {
    fontFamily: "Nunito_700Bold",
    color: parrotBlue,
    fontSize: 15,
  },
  inactiveStep: {
    borderRadius: vh(3),
  },
  second: {
    flex: 1,
    paddingVertical: vh(.8),
    alignItems: "center",
    justifyContent: "center",
  },
});
