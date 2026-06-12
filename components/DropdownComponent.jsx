import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { StyleSheet,  View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { vh, vw } from "react-native-expo-viewport-units";
import { parrotCream, parrotInputTextColor, parrotPlaceholderGrey } from "../assets/color";

const DropdownComponent = ({ data, setVehicleId }) => {
  const [value, setValue] = useState(null);
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
    width: vw(62),
    height: vh(5),
    borderRadius: vh(3),
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingHorizontal: 8,
    fontSize: 12,
  },
  placeholderStyle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: parrotInputTextColor,
    width: vw(25),
  },
  selectedTextStyle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: parrotInputTextColor,
    width: vw(25),
  },
  itemTextStyle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: parrotInputTextColor,
    width: vw(25),
  },

  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    fontFamily: "Nunito_700Bold",
    height: 30,
    fontSize: 12,
    color: parrotInputTextColor,
    width: vw(25),
    textAlign: "center",
  },
});
