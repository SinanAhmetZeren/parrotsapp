/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { vh, vw } from "react-native-expo-viewport-units";

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

  const displayTexts = [
    "Voyage Details: Name, brief, description, vacancy, dates, price ",
    "Voyage Images:\nAdd images of the voyage",
    "Voyage Itinerary:\nAdd waypoints - with title, brief and image",
  ];

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
    height: vh(7),
    top: vh(5),
  },
  activeStep: {
    backgroundColor: "white",
    borderColor: "rgba(110, 11, 211,0.36)",
    borderRadius: vh(1),
  },
  activeStepText: {
    color: "rgba(91,91,255,1)",
    fontWeight: "700",
  },
  inactiveStepText: {
    color: "rgba(91,91,255,.35)",
    fontWeight: "700",
  },
  inactiveStep: {
    // backgroundColor: "rgba(110, 11, 211,0.16)",
    borderRadius: vh(1),
    backgroundColor: "white",
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
