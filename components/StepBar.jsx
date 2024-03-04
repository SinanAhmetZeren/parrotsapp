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
          style={[isActive ? styles.activeStepText : null, styles.stepText]}
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

  return (
    <View style={styles.mainContainer}>
      <StepBarStep displayText={displayTexts[0]} stepNumber={1} />
      <StepBarStep displayText={displayTexts[1]} stepNumber={2} />
      <StepBarStep displayText={displayTexts[2]} stepNumber={3} />
    </View>
  );
};

export default StepBar;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: vh(10),
    top: vh(5),
  },
  activeStep: {
    backgroundColor: "white",
    borderColor: "rgba(110, 11, 211,0.36)",
    borderWidth: 2,
    borderRadius: vh(1),
  },
  activeStepText: {
    fontWeight: "700",
  },
  inactiveStep: {
    backgroundColor: "rgba(110, 11, 211,0.16)",
    borderRadius: vh(1),
    borderWidth: 2,
    borderColor: "rgba(110, 11, 211,0.36)",
  },
  stepText: {
    fontSize: 11,
    textAlign: "auto",
    color: "purple",
  },
  second: {
    width: vw(30),
    marginVertical: vh(0.5),
    padding: vh(0.3),
  },
});
