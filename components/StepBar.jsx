/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { vh, vw } from "react-native-expo-viewport-units";
import { parrotBlue, parrotCream } from "../assets/color";

const StepBar = ({ currentStep }) => {
  const StepBarStep = ({ displayText, stepNumber }) => {
    const isActive = stepNumber === currentStep;

    return (
      <View
        style={[
          isActive ? styles.activeStep : styles.inactiveStep,
          styles.second,
        ]}
      >
        <Text
          style={[isActive ? styles.activeStepText : styles.inactiveStepText]}
        >
          {displayText}
        </Text>
      </View>
    );
  };

  const displayTexts2 = ["Voyage Details", "Images & Waypoints"];

  return (
    <View style={styles.mainContainer}>
      <StepBarStep displayText={displayTexts2[0]} stepNumber={1} />
      <StepBarStep displayText={displayTexts2[1]} stepNumber={2} />
    </View>
  );
};

export default StepBar;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: vh(5),
    backgroundColor: "white",
  },
  activeStep: {
    backgroundColor: parrotBlue,
    borderRadius: vh(3),
  },
  activeStepText: {
    color: "white",
    fontWeight: "700",
  },
  inactiveStepText: {
    color: parrotBlue,
    fontWeight: "700",
  },
  inactiveStep: {
    borderRadius: vh(3),
    backgroundColor: parrotCream,
  },
  stepText: {
    fontSize: 16,
    textAlign: "auto",
    fontWeight: "700",
  },
  second: {
    width: vw(45),
    marginVertical: vh(0.5),
    alignItems: "center",
    justifyContent: "center",
  },
});
