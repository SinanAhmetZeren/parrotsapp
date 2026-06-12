import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { StyleSheet,  View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { vh, vw } from "react-native-expo-viewport-units";
import { parrotBlue, parrotCream } from "../assets/color";

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
        </ParrotsStdText>
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
    height: vh(5),
    backgroundColor: "white",
  },
  activeStep: {
    backgroundColor: parrotBlue,
    borderRadius: vh(3),
  },
  activeStepText: {
    color: "white",
    fontFamily: "Nunito_700Bold",
  },
  inactiveStepText: {
    color: parrotBlue,
    fontFamily: "Nunito_700Bold",
  },
  inactiveStep: {
    borderRadius: vh(3),
    backgroundColor: parrotCream,
  },
  second: {
    width: vw(45),
    marginVertical: vh(0.5),
    alignItems: "center",
    justifyContent: "center",
  },
});

