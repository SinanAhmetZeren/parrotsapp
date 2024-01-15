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

const FilterCalendarModal = ({ isVisible, onClose }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (date, type) => {
    if (type === "END_DATE") {
      setEndDate(date);
    } else {
      setStartDate(date);
      setEndDate(null); // Reset end date if start date changes
    }
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

    console.log(
      "Selected date range: From",
      formattedStartDate,
      "to",
      formattedEndDate
    );
    onClose();
  };

  const renderCustomPrev = ({ onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.customPrevContainer}>
        <MaterialCommunityIcons name="chevron-left" size={24} color="#0275d8" />
      </TouchableOpacity>
    );
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
              selectedDayColor="#70fe0e"
              selectedDayTextColor="#333333"
              textStyle={{ fontWeight: "700", color: "#333333" }}
              previousTitle={
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color="#0275d8"
                />
              }
              nextTitle={
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="#0275d8"
                />
              }
              width={300}
              // height={500}
            />

            <TouchableOpacity
              onPress={handleSave}
              style={styles.buttonSaveContainer}
            >
              <Text style={styles.buttonSave}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.floatingIcon}>
            <AntDesign
              style={styles.icon}
              name="calendar"
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
    width: vw(90),
    height: vh(40),
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
    width: vw(60),
    borderRadius: 10,
  },
  floatingIcon: {
    backgroundColor: "white",
    height: 40,
    width: 40,
    borderRadius: 15,
    position: "absolute",
    top: vh(8),
    right: vw(24),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FilterCalendarModal;
