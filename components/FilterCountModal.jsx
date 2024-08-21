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
} from "react-native";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
            <Text style={styles.title}>Vacancy</Text>

            <View style={styles.counterContainer}>
              <TouchableOpacity onPress={handleDecrement}>
                <Text style={styles.buttonCount}>-</Text>
              </TouchableOpacity>

              <Text style={styles.count}>{count}</Text>

              <TouchableOpacity onPress={handleIncrement}>
                <Text style={styles.buttonCount}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={handleClear}
                style={styles.buttonClearContainer}
              >
                <Text style={styles.buttonClear}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={styles.buttonSaveContainer}
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
  innerContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  buttonsContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around",
  },

  buttonSaveContainer: {
    alignItems: "center",
  },
  buttonClearContainer: {
    alignItems: "center",
  },
  buttonSave: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    backgroundColor: "#186ff1",
    padding: 5,
    width: vw(30),
    borderRadius: 10,
    marginTop: 5,
  },
  buttonClear: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    backgroundColor: "#2ac898",
    padding: 5,
    width: vw(30),
    borderRadius: 10,
    marginTop: 5,
  },
  buttonCount: {
    fontSize: 24,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#3498db",
    borderRadius: 10,
    backgroundColor: "#fff",
    width: vh(6),
    textAlign: "center", // Center the text horizontally
    color: "green",
  },
  count: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default FilterCountModal;
