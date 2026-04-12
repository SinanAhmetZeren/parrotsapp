/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Button,
  TextInput
} from "react-native";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotLightBlue, parrotGreen, parrotTextDarkBlue, parrotBlueTransparent, parrotCream, parrotInputTextColor } from "../assets/color";

const FilterCountModal = ({
  isVisible,
  setIsVisible,
  onClose,
  setIsCountFiltered,
  count,
  setCount,
}) => {

  const handleIncrement = () => {
    setCount((count) => {
      const newCount = count + 1;
      return newCount;
    });
  };

  const handleDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleClear = () => {
    setCount(1);
    setIsCountFiltered(false);
    onClose();
  };

  const handleSave = () => {
    onClose();
    if (count == 1) {
      setIsCountFiltered(false);
    } else {
      setIsCountFiltered(true);
    }
  };

  return (
    <>
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>
              Vacancy
            </Text>

            <View style={styles.inputMainContainer}>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  onPress={handleDecrement}
                  style={[styles.changeButtonContainer, styles.rightFlatBorders]}
                >
                  <Text style={styles.buttonCount}>−</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.bidInput}
                  keyboardType="numeric"
                  value={count.toString()}
                  onChangeText={(text) => setCount(parseInt(text) || 0)}
                />
                <TouchableOpacity
                  onPress={handleIncrement}
                  style={[styles.changeButtonContainer, styles.leftFlatBorders]}
                >
                  <Text style={styles.buttonCount}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.buttonClearContainer}
                onPress={handleClear}
              >
                <Text style={styles.buttonClearText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonOkContainer}
                onPress={handleSave}
              >
                <Text style={styles.buttonOkText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    position: "absolute",
    left: 0,
    right: 0,
    paddingTop: vh(17),
    paddingBottom: vh(70),
  },
  innerContainer: {
    backgroundColor: "#fdf9f5",
    paddingTop: vh(2.5),
    paddingBottom: vh(1.5),
    paddingHorizontal: vw(6),
    borderRadius: vh(3),
    width: vw(75),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: "Nunito_800ExtraBold",
    marginBottom: vh(2),
    textAlign: "center",
    color: parrotLightBlue,
    letterSpacing: 0.5,
  },
  inputMainContainer: {
    marginBottom: vh(1.5),
    borderRadius: vh(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: parrotCream,
    overflow: "hidden",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: vh(5.5),
    width: vh(7),
    backgroundColor: "#ede8e2",
  },
  rightFlatBorders: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  leftFlatBorders: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  bidInput: {
    color: parrotInputTextColor,
    fontSize: 20,
    fontFamily: "Nunito_800ExtraBold",
    width: vw(22),
    textAlign: "center",
    height: vh(5.5),
    backgroundColor: parrotCream,
    paddingBottom: 10,
  },
  buttonCount: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: parrotLightBlue,
    textAlign: "center",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(10, 119, 234, 0.1)",
    marginVertical: vh(1.5),
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: vw(3),
    width: "100%",
  },
  buttonClearContainer: {
    alignItems: "center",
  },
  buttonClearText: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: "white",
    textAlign: "center",
    backgroundColor: parrotGreen,
    padding: 5,
    width: vw(25),
    borderRadius: 30,
    marginTop: 5,
  },
  buttonOkContainer: {
    alignItems: "center",
  },
  buttonOkText: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: "white",
    textAlign: "center",
    backgroundColor: parrotBlue,
    padding: 5,
    width: vw(25),
    borderRadius: 30,
    marginTop: 5,
  },
});

export default FilterCountModal;
