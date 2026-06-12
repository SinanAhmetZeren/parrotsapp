import { ParrotsStdText } from "./ParrotsStdText";
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
import CalendarPicker from "react-native-calendar-picker";
import { parrotBlue, parrotCream, parrotGreen, parrotInputTextColor, parrotTextDarkBlue } from "../assets/color";

const FilterCalendarModal = ({
  isVisible,
  onClose,
  setIsDatesFiltered,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const [calendarRangeAllowed, setCalendarRangeAllowed] = useState(false);

  const handleDateChange = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      setCalendarRangeAllowed(false);
    } else {
      if (date >= startDate) {
        setCalendarRangeAllowed(true);
        setEndDate(date);
      } else {
        setStartDate(date);
        setEndDate(null);
      }
    }
  };

  const handlePrintDates = () => {
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
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={onClose}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.innerContainer}>
            <ParrotsStdText style={styles.title}>Date Range</ParrotsStdText>
            <ParrotsStdText style={styles.subtitle}>Show voyages within your selected dates</ParrotsStdText>
            <CalendarPicker
              selectedRangeStartTextStyle={styles.startEndText}
              selectedRangeEndTextStyle={styles.startEndText}
              selectedRangeStyle={styles.calendarSelected}
              selectedRangeStartStyle={styles.calendarEndStart}
              selectedRangeEndStyle={styles.calendarEndStart}
              selectedDayStyle={styles.calendarEndStart}
              selectedColor={"blue"}
              selectedDayColor={parrotGreen}
              selectedDayTextColor="white"
              textStyle={{ fontFamily: "Nunito_700Bold", color: parrotInputTextColor }}
              startFromMonday={true}
              allowRangeSelection={calendarRangeAllowed}
              minDate={new Date()}
              selectedStartDate={startDate}
              selectedEndDate={endDate}
              onDateChange={handleDateChange}
              width={300}
            />

            {startDate || endDate ? (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={handleClear} style={styles.buttonCancelContainer}>
                  <ParrotsStdText style={styles.buttonClearText}>Clear</ParrotsStdText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={styles.buttonSendBidContainer}>
                  <ParrotsStdText style={styles.buttonSaveText}>Ok</ParrotsStdText>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={handleClose} style={styles.buttonSendBidContainer}>
                  <ParrotsStdText style={styles.buttonSaveText}>Close</ParrotsStdText>
                </TouchableOpacity>
              </View>
            )}
          </View>
          </TouchableOpacity>
        </TouchableOpacity>
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
    left: 0, right: 0, top: 0, bottom: 0,
  },
  innerContainer: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 24,
    width: vw(88),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: "Nunito_800ExtraBold",
    color: parrotTextDarkBlue,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "#9aa0aa",
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  buttonSendBidContainer: {
    flex: 2,
    backgroundColor: parrotBlue,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  buttonSaveText: {
    fontSize: 16,
    color: "white",
    fontFamily: "Nunito_700Bold",
    textAlign: "center",
  },
  buttonCancelContainer: {
    flex: 1,
    backgroundColor: "#f2f4f7",
    borderRadius: 50,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonClearText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#9aa0aa",
    textAlign: "center",
  },
});

export default FilterCalendarModal;
