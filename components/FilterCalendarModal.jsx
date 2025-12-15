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
    console.log("printing dates...");
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
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
            {/* <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={true}
              selectedStartDate={startDate}
              selectedEndDate={endDate}
              onDateChange={handleDateChange}
              selectedDayColor="#2ac898bb"
              selectedDayTextColor="white"
              textStyle={{ fontWeight: "700", color: "#333333" }}
              previousTitle="⬅️"
              nextTitle="➡️"
              width={300}
            /> */}


            <CalendarPicker
              selectedRangeStartTextStyle={styles.startEndText}
              selectedRangeEndTextStyle={styles.startEndText}
              selectedRangeStyle={styles.calendarSelected}
              selectedRangeStartStyle={styles.calendarEndStart}
              selectedRangeEndStyle={styles.calendarEndStart}
              selectedDayStyle={styles.calendarEndStart}
              selectedColor={"blue"}
              selectedDayColor="#2ac898bb"
              selectedDayTextColor="white"
              textStyle={{ fontWeight: "700", color: "#333333" }}
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

                {/* <TouchableOpacity
                  onPress={handlePrintDates}
                  style={styles.buttonSaveContainer}
                >
                  <Text style={styles.buttonClose}>print dates</Text>
                </TouchableOpacity> */}
              </View>
            ) : (
              <>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.buttonSaveContainer}
                >
                  <Text style={styles.buttonClose}>Close</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  onPress={handlePrintDates}
                  style={styles.buttonSaveContainer}
                >
                  <Text style={styles.buttonClose}>print dates</Text>
                </TouchableOpacity> */}
              </>

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
