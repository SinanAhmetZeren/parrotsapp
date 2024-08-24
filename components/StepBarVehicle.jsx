/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { vh, vw } from "react-native-expo-viewport-units";

const StepBarVehicle = ({ currentStep }) => {
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

  const displayTexts2 = ["Vehicle Details", "Images"];

  return (
    <View style={styles.mainContainer}>
      <StepBarStep displayText={displayTexts2[0]} stepNumber={1} />
      <StepBarStep displayText={displayTexts2[1]} stepNumber={2} />
    </View>
  );
};

export default StepBarVehicle;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: vh(7),
    backgroundColor: "white",
  },
  activeStep: {
    backgroundColor: "#3c9dde",
    borderRadius: vh(1),
  },
  activeStepText: {
    color: "white",
    fontWeight: "700",
  },
  inactiveStepText: {
    color: "#3c9dde",
    fontWeight: "700",
  },
  inactiveStep: {
    borderRadius: vh(1),
    backgroundColor: "rgba(24,111,241,0.05)",
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
