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
        <TouchableOpacity
          onPress={() => {
            setSelectedFunction(3);
          }}
          style={styles.mainBidsContainer5}
        >
          <View style={styles.currentBidsAndSeeAll}>
            <Text
              style={
                selectedFunction === 3
                  ? styles.selectedTitle
                  : styles.nonSelectedTitle
              }
            >
              Bookmarks
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
    width: vw(100),
  },
  currentBidsTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 22,
    color: parrotLightBlue,
    paddingLeft: vw(5),
  },
  selectedTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: parrotLightBlue,
  },
  nonSelectedTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: parrotBlueSemiTransparent3,
  },
  currentBidsAndSeeAll: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  mainBidsContainer: {
    borderRadius: vw(5),
  },
  mainBidsContainer3: {
    flex: 3,
    alignItems: "center",
    paddingVertical: vh(0.4),
  },
  mainBidsContainer4: {
    flex: 1,
    paddingVertical: vh(0.4),
    alignItems: "center",
  },
  mainBidsContainer5: {
    flex: 2,
    paddingVertical: vh(0.4),
    alignItems: "center",
  },
  container: {
    marginTop: vh(5),
    backgroundColor: "white",
    width: vw(100),
    alignSelf: "center",
    height: vh(100),
  },
});
