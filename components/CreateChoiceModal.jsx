import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Modal, StyleSheet, Animated } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";
import { parrotBlue, parrotCream, parrotWalkTurquoise } from "../assets/color";
import { Shadow } from "react-native-shadow-2";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const CreateChoiceModal = ({ modalVisible, setModalVisible }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [opacityAnim] = useState(new Animated.Value(0));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (modalVisible) {
      setIsVisible(true);
      opacityAnim.setValue(0);
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (isVisible) {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
      });
    }
  }, [modalVisible]);

  const handlePressOut = () => setModalVisible(false);

  const handleAddVehicle = () => {
    setModalVisible(false);
    navigation.navigate("Create", { screen: "CreateVehicleScreen" });
  };

  const handleAddVoyage = () => {
    setModalVisible(false);
    navigation.navigate("Create", { screen: "CreateVoyageScreen" });
  };

  const handleAskParrots = () => {
    setModalVisible(false);
    navigation.navigate("Create", { screen: "AskParrotsScreen", initial: false });
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPressOut={handlePressOut}>
        <Animated.View style={[styles.centeredView, { opacity: opacityAnim, bottom: insets.bottom + 60 }]}>

          {/* All three side by side */}
          <View style={styles.bottomRow}>
            <Shadow distance={8} offset={[0, 0]} startColor="rgba(0,0,0,0.1)" finalColor="rgba(0,0,0,0.00)" radius={12} style={{ borderRadius: vh(2) }}>
              <View style={styles.modalView}>
                <TouchableOpacity style={styles.selection} onPress={handleAddVehicle}>
                  <ParrotsStdText style={styles.choiceText}>New Vehicle</ParrotsStdText>
                </TouchableOpacity>
              </View>
            </Shadow>
            <Shadow distance={8} offset={[0, 0]} startColor="rgba(0,0,0,0.1)" finalColor="rgba(0,0,0,0.00)" radius={12} style={{ borderRadius: vh(2) }}>
              <View style={[styles.modalView, { backgroundColor: "#089ADE" }]}>
                <TouchableOpacity style={styles.selection} onPress={handleAddVoyage}>
                  <ParrotsStdText style={styles.choiceText}>New Voyage</ParrotsStdText>
                </TouchableOpacity>
              </View>
            </Shadow>
            <Shadow distance={8} offset={[0, 0]} startColor="rgba(0,0,0,0.1)" finalColor="rgba(0,0,0,0.00)" radius={12} style={{ borderRadius: vh(2) }}>
              <View style={styles.askView}>
                <TouchableOpacity style={styles.selection} onPress={handleAskParrots}>
                  <ParrotsStdText style={styles.choiceText}>Ask Parrots</ParrotsStdText>
                </TouchableOpacity>
              </View>
            </Shadow>
          </View>

        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    width: vw(95),
    paddingHorizontal: vh(0.2),
    paddingVertical: vh(0.4),
    backgroundColor: "transparent",
    borderRadius: vh(4),
    flexDirection: "column",
    alignItems: "center",
    gap: vh(0.5),
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "transparent",
  },
  modalView: {
    backgroundColor: parrotBlue,
    borderRadius: vh(3),
    alignSelf: "center",
  },
  askView: {
    backgroundColor: parrotWalkTurquoise,
    borderRadius: vh(3),
    alignSelf: "center",
  },
  choiceText: {
    fontSize: 15,
    fontFamily: "Nunito_800ExtraBold",
    color: "white",
  },
  selection: {
    marginHorizontal: vh(0.4),
    marginVertical: vh(0.4),
    paddingHorizontal: vh(1.2),
    paddingVertical: vh(0.5),
    borderRadius: vh(2.5),
  },
});
