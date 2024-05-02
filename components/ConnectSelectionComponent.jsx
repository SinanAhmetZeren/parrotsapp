/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";

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
  },
  currentBidsTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3c9dde",
    paddingLeft: vw(5),
  },
  selectedTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3c9dde",
    paddingLeft: vw(5),
  },
  nonSelectedTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "rgba(118, 186, 232,0.5)",
    paddingLeft: vw(5),
  },
  currentBidsAndSeeAll: {
    marginTop: vh(2),
    flexDirection: "row",
    paddingRight: vw(10),
  },
  mainBidsContainer: {
    borderRadius: vw(5),
    borderColor: "#93c9ed",
  },
  mainBidsContainer3: {
    borderRadius: vw(5),
    borderColor: "#93c9ed",
    width: vw(55),
    alignItems: "center",
  },
  mainBidsContainer4: {
    borderRadius: vw(5),
    borderColor: "#93c9ed",
    width: vw(40),
  },
  currentBidsTitle2: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3c9dde",
    paddingTop: vh(3),
  },
  logoImage: {
    height: vh(20),
    width: vh(20),
    borderRadius: vh(10),
  },
  currentBidsAndSeeAll2: {
    marginTop: vh(2),
    alignItems: "center",
    alignSelf: "center",
  },
  mainBidsContainer2: {
    marginTop: vh(7.5),
    borderRadius: vw(5),
  },
  buttonSave: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    backgroundColor: "#186ff1",
    marginTop: vh(1),
    paddingVertical: vh(0.5),
  },
  container: {
    marginTop: vh(5),
    backgroundColor: "white",
    width: vw(100),
    alignSelf: "center",
    height: vh(95),
  },
  recentChats: {
    fontWeight: "700",
    fontSize: 26,
    justifyContent: "center",
    alignSelf: "center",
  },
  flatlist: {
    backgroundColor: "yellow",
    marginTop: vh(2),
    width: vw(94),
    justifyContent: "center",
    alignSelf: "center",
  },
});
