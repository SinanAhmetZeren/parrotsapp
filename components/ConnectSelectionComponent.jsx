/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotBlueSemiTransparent3, parrotLightBlue } from "../assets/color";

export const ConnectSelectionComponent = ({
  selectedFunction,
  setSelectedFunction,
}) => {
  return (
    <>
      <View style={styles.selectionContainer}>
        <TouchableOpacity
          onPress={() => {
            setSelectedFunction(1);
          }}
          style={styles.mainBidsContainer3}
        >
          <View style={styles.currentBidsAndSeeAll}>
            <Text
              style={
                selectedFunction === 1
                  ? styles.selectedTitle
                  : styles.nonSelectedTitle
              }
            >
              Recent Chats
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedFunction(2);
          }}
          style={styles.mainBidsContainer4}
        >
          <View style={styles.currentBidsAndSeeAll}>
            <Text
              style={
                selectedFunction === 2
                  ? styles.selectedTitle
                  : styles.nonSelectedTitle
              }
            >
              Find
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  selectionContainer: {
    flexDirection: "row",
    marginTop: vh(2),
  },
  currentBidsTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: parrotLightBlue,
    paddingLeft: vw(5),
  },
  selectedTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: parrotLightBlue,
    paddingLeft: vw(5),
  },
  nonSelectedTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: parrotBlueSemiTransparent3,
    paddingLeft: vw(5),
  },
  currentBidsAndSeeAll: {
    // marginTop: vh(2),
    flexDirection: "row",
    paddingRight: vw(10),
  },
  mainBidsContainer: {
    borderRadius: vw(5),
  },
  mainBidsContainer3: {
    borderRadius: vw(5),
    width: vw(55),
    alignItems: "center",
  },
  mainBidsContainer4: {
    borderRadius: vw(5),
    width: vw(40),
  },
  container: {
    marginTop: vh(5),
    backgroundColor: "white",
    width: vw(100),
    alignSelf: "center",
    height: vh(100),
  },
});
