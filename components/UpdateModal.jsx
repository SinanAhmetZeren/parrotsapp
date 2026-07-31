import React, { useState } from "react";
import { View, Modal, TouchableOpacity, StyleSheet, Linking, Image } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { parrotBlue, parrotCream, parrotDarkBlue } from "../assets/color.jsx";
import { ParrotsStdText } from "./ParrotsStdText";
import { Shadow } from "react-native-shadow-2";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.zenforest.parrots";

export const UpdateModal = ({ visible, onDismiss }) => {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <Shadow distance={16} startColor="rgba(0,0,0,0.25)" finalColor="rgba(0,0,0,0.0)" radius={20}>
          <View style={styles.card}>
            <Image source={require("../assets/parrotslogo.png")} style={styles.logo} />
            <ParrotsStdText style={styles.title}>New Version Available</ParrotsStdText>
            <ParrotsStdText style={styles.subtitle}>
              A newer version of Parrots is available. Update for the latest features and fixes.
            </ParrotsStdText>
            <TouchableOpacity style={styles.updateBtn} onPress={() => Linking.openURL(PLAY_STORE_URL)}>
              <ParrotsStdText style={styles.updateBtnText}>Update</ParrotsStdText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
              <ParrotsStdText style={styles.dismissText}>Not now</ParrotsStdText>
            </TouchableOpacity>
          </View>
        </Shadow>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: parrotCream,
    borderRadius: vh(3),
    padding: vh(3),
    width: vw(80),
    alignItems: "center",
  },
  logo: {
    width: vw(20),
    height: vw(20),
    borderRadius: vw(10),
    marginBottom: vh(1.5),
  },
  title: {
    fontSize: 20,
    fontFamily: "Nunito_800ExtraBold",
    color: parrotDarkBlue,
    marginBottom: vh(1),
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#555",
    textAlign: "center",
    marginBottom: vh(2.5),
    lineHeight: 20,
  },
  updateBtn: {
    backgroundColor: parrotBlue,
    borderRadius: vh(3),
    paddingVertical: vh(1.2),
    paddingHorizontal: vw(12),
    marginBottom: vh(1),
  },
  updateBtnText: {
    color: "white",
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
  },
  dismissBtn: {
    paddingVertical: vh(0.8),
  },
  dismissText: {
    color: "#999",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 13,
  },
});
