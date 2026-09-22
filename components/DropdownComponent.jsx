import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { StyleSheet,  View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { vh, vw } from "react-native-expo-viewport-units";
import { parrotCream, parrotInputTextColor, parrotPlaceholderGrey } from "../assets/color";

const DropdownComponent = ({ data, setVehicleId, vehicleId }) => {
  const [value, setValue] = useState(vehicleId || null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemTextStyle={styles.itemTextStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={"Select vehicle"}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        dropdownPosition="auto"
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
          setVehicleId(item.value);
        }}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    height: 42,
    backgroundColor: "#F7F9FB",
    borderWidth: 1.5,
    borderColor: "#D8E0E8",
    borderRadius: 8,
    paddingHorizontal: 9,
  },
  placeholderStyle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: parrotPlaceholderGrey,
  },
  selectedTextStyle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: parrotInputTextColor,
  },
  itemTextStyle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: parrotInputTextColor,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    fontFamily: "Nunito_700Bold",
    height: 30,
    fontSize: 13,
    color: parrotInputTextColor,
  },
});
