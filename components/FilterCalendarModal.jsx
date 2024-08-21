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
import { vw, vh } from "react-native-expo-viewport-units";
import { AntDesign } from "@expo/vector-icons";
import CalendarPicker from "react-native-calendar-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const FilterCalendarModal = ({
  isVisible,
  onClose,
  setIsDatesFiltered,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const handleDateChange = (date, type) => {
    if (type === "END_DATE") {
      setEndDate(date);
    } else {
      setStartDate(date);
      setEndDate(null); // Reset end date if start date changes
    }
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onClose();
    setIsDatesFiltered(false);
  };

  const handleSave = () => {
    // Perform actions with selected date range
    const inputTimestampStart = startDate;
    const dateObjectStart = new Date(inputTimestampStart);
    const monthStart = (dateObjectStart.getMonth() + 1)
      .toString()
      .padStart(2, "0"); // Months are zero-based
    const dayStart = dateObjectStart.getDate().toString().padStart(2, "0");
    const yearStart = dateObjectStart.getFullYear();
    const formattedStartDate = `${monthStart}-${dayStart}-${yearStart}`;

    const inputTimestampEnd = endDate;
    const dateObjectEnd = new Date(inputTimestampEnd);
    const monthEnd = (dateObjectEnd.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const dayEnd = dateObjectEnd.getDate().toString().padStart(2, "0");
    const yearEnd = dateObjectEnd.getFullYear();
    const formattedEndDate = `${monthEnd}-${dayEnd}-${yearEnd}`;

    if (endDate && startDate) {
      setIsDatesFiltered(true);
    } else {
      setIsDatesFiltered(false);
    }
    onClose();
  };

  const handleClose = () => {
    onClose();
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
            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={true}
              selectedStartDate={startDate}
              selectedEndDate={endDate}
              onDateChange={handleDateChange}
              selectedDayColor="#2ac898"
              selectedDayTextColor="white"
              textStyle={{ fontWeight: "700", color: "#333333" }}
              previousTitle="⬅️"
              nextTitle="➡️"
              width={300}
            />

            {startDate || endDate ? (
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
            ) : (
              <TouchableOpacity
                onPress={handleClose}
                style={styles.buttonSaveContainer}
              >
                <Text style={styles.buttonClose}>Close</Text>
              </TouchableOpacity>
            )}
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
    width: vw(90),
    height: vh(40),
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
  buttonClose: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    backgroundColor: "#186ff1",
    padding: 5,
    width: vw(60),
    borderRadius: 10,
    marginTop: 5,
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
});

export default FilterCalendarModal;
