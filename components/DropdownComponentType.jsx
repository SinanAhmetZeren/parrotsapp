/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { vh, vw } from "react-native-expo-viewport-units";
import { parrotInputTextColor, parrotPlaceholderGrey } from "../assets/color";

const DropdownComponentType = ({ data, setVehicleType, selected }) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={{ ...styles.placeholderStyle, color: parrotPlaceholderGrey }}
        selectedTextStyle={{ ...styles.selectedTextStyle, color: parrotInputTextColor }}
        inputSearchStyle={{ ...styles.inputSearchStyle, color: parrotInputTextColor }}
        iconStyle={styles.iconStyle}
        itemTextStyle={{ ...styles.itemTextStyle, color: parrotInputTextColor }}
        data={data}
        value={selected}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={"Select vehicle type"}
        searchPlaceholder="Search..."
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setIsFocus(false);
          setVehicleType(item.value);
        }}
      />
    </View>
  );
};

export default DropdownComponentType;

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
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 12,
    fontWeight: "500",
    width: vw(25),
    left: vw(-1),
  },
  selectedTextStyle: {
    fontSize: 12,
    fontWeight: "500",
    width: vw(25),
  },
  itemTextStyle: {
    fontSize: 12,
    fontWeight: "500",
    width: vw(25),
  },

  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 30,
    fontSize: 12,
    fontWeight: "500",
    width: vw(25),
    textAlign: "center",
  },
});
