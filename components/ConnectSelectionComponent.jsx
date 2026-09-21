import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";

const TABS = [
  { id: 1, label: "Chats" },
  { id: 2, label: "Find" },
  { id: 3, label: "Bids" },
];

export const ConnectSelectionComponent = ({ selectedFunction, setSelectedFunction }) => {
  return (
    <View style={styles.row}>
      <View style={styles.seg}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.segBtn, selectedFunction === tab.id && styles.segBtnOn]}
            onPress={() => setSelectedFunction(tab.id)}
            activeOpacity={0.8}
          >
            <ParrotsStdText style={[styles.segLabel, selectedFunction === tab.id && styles.segLabelOn]}>
              {tab.label}
            </ParrotsStdText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: vh(1.5),
    paddingHorizontal: vw(4),
  },
  seg: {
    flex: 1,
    flexDirection: "row",
    padding: 3,
    gap: 2,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
  },
  segBtnOn: {
    backgroundColor: "#0A77EA",
    shadowColor: "#0A77EA",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  segLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13,
    color: "#0A77EA",
  },
  segLabelOn: {
    color: "#fff",
  },
});
