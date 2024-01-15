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

const FilterCountModal = ({ isVisible, onClose }) => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((count) => {
      const newCount = count + 1;
      console.log(`New count: ${newCount}`);
      return newCount;
    });
  };

  const handleDecrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const handleSave = () => {
    onClose();
    console.log("saved with a count of: " + count);
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

            <TouchableOpacity
              onPress={handleSave}
              style={styles.buttonSaveContainer}
            >
              <Text style={styles.buttonSave}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.floatingIcon}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="human"
              size={24}
              color="black"
            />
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
    paddingTop: vh(15),
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
  buttonSaveContainer: {
    alignItems: "center",
  },

  buttonSave: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    backgroundColor: "#0275d8",
    padding: 6,
    width: vh(33),
    borderRadius: 10,
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
  floatingIcon: {
    backgroundColor: "white",
    height: 40,
    width: 40,
    borderRadius: 15,
    position: "absolute",
    top: vh(8),
    right: vw(35),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FilterCountModal;
