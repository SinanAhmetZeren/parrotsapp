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
import { parrotBlueMediumTransparent, parrotTextDarkBlue } from "../assets/color";

const FilterCountModal = ({
  isVisible,
  setIsVisible,
  onClose,
  setIsCountFiltered,
  count,
  setCount,
}) => {

  // console.log("FilterCountModal count:", count);
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
            <Text style={[styles.title, { color: parrotTextDarkBlue }]}>
              Vacancy
            </Text>
            <View style={styles.inputMainContainer}>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  onPress={handleDecrement}
                  style={{ ...styles.changeButtonContainer, ...styles.rightFlatBorders }}
                >
                  <Text style={styles.buttonCount}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.bidInput}
                  keyboardType="numeric"
                  value={count.toString()}
                  onChangeText={(text) => setCount(parseInt(text) || 0)}
                />
                <TouchableOpacity
                  onPress={handleIncrement}
                  style={{ ...styles.changeButtonContainer, ...styles.leftFlatBorders }}
                >
                  <Text style={styles.buttonCount}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.buttonCancelContainer}
                onPress={handleClear}
              >
                <Text style={styles.buttonClear}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonSendBidContainer}
                onPress={handleSave}
              >
                <Text style={styles.buttonSave}>Ok</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    left: 0,
    right: 0,
    paddingTop: vh(17),
    paddingBottom: vh(70),
  },
  count: {
    fontSize: 18,
    fontWeight: "bold",
  },
  changeButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: parrotTextDarkBlue,
    borderRadius: vh(20),
    height: vh(4.5),
  },
  rightFlatBorders: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  leftFlatBorders: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  inputMainContainer: {
    padding: vh(1),
    marginBottom: vh(1),
    borderRadius: vh(2),
    borderColor: "#d8f7ee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "orange",
    width: vw(55),
  },
  bidInput: {
    color: parrotTextDarkBlue,
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "white",
    width: vw(32),
    textAlign: "center",
    borderWidth: 1,
    borderColor: parrotTextDarkBlue,
    height: vh(4.5) - 1.5,
    backgroundColor: parrotBlueMediumTransparent,
    lineHeight: 20,  // keep line height close to font size
    paddingBottom: 6,   // fine tune

  },
  innerContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: vw(70),
    // backgroundColor: "pink",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: vh(2),
    textAlign: "center",
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: vw(60),
    paddingHorizontal: vw(2),
    borderRadius: vh(2),
  },
  buttonsContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    // backgroundColor: "yellow",
    width: vw(55),
  },
  buttonSave: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    backgroundColor: "#186ff1",
    padding: vw(1),
    width: vw(25),
    borderRadius: vh(4),
    fontWeight: "bold",
    marginLeft: vw(2.5),
  },
  buttonClear: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    backgroundColor: "#2ac898",
    padding: vw(1),
    width: vw(25),
    borderRadius: vh(4),
    marginRight: vw(2.5),

  },
  buttonCount: {
    fontSize: 22,
    borderColor: "#3498db",
    borderRadius: 10,
    width: vh(6),
    textAlign: "center",
    fontWeight: "800",
    color: "white",
  },
});

export default FilterCountModal;
