import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { View,  TouchableOpacity, Modal, StyleSheet } from "react-native";
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
          style={styles.recentChatsTab}
        >
          <View style={styles.tabLabelRow}>
            <Text
              style={
                selectedFunction === 1
                  ? styles.selectedTitle
                  : styles.nonSelectedTitle
              }
            >
              Chats
            </ParrotsStdText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedFunction(4);
          }}
          style={styles.groupsTab}
        >
          <View style={styles.tabLabelRow}>
            <Text
              style={
                selectedFunction === 4
                  ? styles.selectedTitle
                  : styles.nonSelectedTitle
              }
            >
              Groups
            </ParrotsStdText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedFunction(2);
          }}
          style={styles.findTab}
        >
          <View style={styles.tabLabelRow}>
            <Text
              style={
                selectedFunction === 2
                  ? styles.selectedTitle
                  : styles.nonSelectedTitle
              }
            >
              Find
            </ParrotsStdText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedFunction(3);
          }}
          style={styles.bookmarksTab}
        >
          <View style={styles.tabLabelRow}>
            <Text
              style={
                selectedFunction === 3
                  ? styles.selectedTitle
                  : styles.nonSelectedTitle
              }
            >
              Bookmarks
            </ParrotsStdText>
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
    width: vw(90),
    marginHorizontal: "auto",
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
  tabLabelRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  recentChatsTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: vh(0.4),
    // backgroundColor: "rgba(30, 111, 217, 0.1)",
  },
  findTab: {
    flex: 1,
    paddingVertical: vh(0.4),
    alignItems: "center",
    // backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  bookmarksTab: {
    flex: 1.5,
    paddingVertical: vh(0.4),
    alignItems: "center",
    // backgroundColor: "rgba(255, 152, 0, 0.1)",
  },
  groupsTab: {
    flex: 1,
    paddingVertical: vh(0.4),
    alignItems: "center",
    // backgroundColor: "pink"
  },
});
