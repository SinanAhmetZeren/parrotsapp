/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";
import { parrotBlue, parrotCream } from "../assets/color";
import { Shadow } from "react-native-shadow-2";

export const CreateChoiceModal = ({ modalVisible, setModalVisible }) => {
  const navigation = useNavigation();
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

  const handlePressOut = () => {
    setModalVisible(false);
  };

  const handleAddVehicle = () => {
    setModalVisible(false);
    navigation.navigate("Create", { screen: "CreateVehicleScreen" });
  };

  const handleAddVoyage = () => {
    setModalVisible(false);
    navigation.navigate("Create", { screen: "CreateVoyageScreen" });
  };

  return (
    <Modal
      animationType="none"
      transparent
      visible={isVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPressOut={handlePressOut}>
        <Animated.View style={[styles.centeredView, { opacity: opacityAnim }]}>
          <View style={styles.modalView}>
            <Shadow
              distance={8}
              offset={[0, 0]}
              startColor="rgba(0,0,0,0.18)"
              finalColor="rgba(0,0,0,0.23)"
              radius={12}
              style={{ borderRadius: vh(2) }}
            >
              <View style={styles.modalView}>
                <TouchableOpacity style={styles.selection} onPress={handleAddVehicle}>
                  <Text style={styles.choiceText}>New Vehicle</Text>
                </TouchableOpacity>
              </View>
            </Shadow>
          </View>
          <View style={styles.modalView2}>
            <Shadow
              distance={8}
              offset={[0, 0]}
              startColor="rgba(0,0,0,0.18)"
              finalColor="rgba(0,0,0,0.23)"
              radius={12}
              style={{ borderRadius: vh(2) }}
            >
              <View style={styles.modalView2}>
                <TouchableOpacity style={styles.selection2} onPress={handleAddVoyage}>
                  <Text style={styles.choiceText}>New Voyage</Text>
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
    bottom: vh(8), // stays fixed above the bottom
    alignSelf: "center",
    width: vw(75),
    height: vh(6.5),
    paddingHorizontal: vh(0.2),
    paddingVertical: vh(0.2),
    backgroundColor: parrotCream,
    borderRadius: vh(4),
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalView: {
    backgroundColor: parrotBlue,
    borderRadius: vh(3),
    alignSelf: "center",
  },
  modalView2: {
    backgroundColor: parrotBlue,
    borderRadius: vh(3),
    alignSelf: "center",
  },
  choiceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  selection: {
    marginHorizontal: vh(0.5),
    marginVertical: vh(0.5),
    paddingHorizontal: vh(2),
    paddingVertical: vh(0.5),
    borderRadius: vh(2.5),
  },
  selection2: {
    marginHorizontal: vh(0.5),
    marginVertical: vh(0.5),
    paddingHorizontal: vh(2),
    paddingVertical: vh(0.5),
    borderRadius: vh(2.5),
  },
});
