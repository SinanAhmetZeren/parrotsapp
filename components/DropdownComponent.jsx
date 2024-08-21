/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { vh, vw } from "react-native-expo-viewport-units";

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
  latorLng: {
    flexDirection: "row",
    backgroundColor: "#fafbfc",
    marginVertical: vh(0.3),
    padding: vh(0.4),
    borderTopRightRadius: vh(3),
    borderBottomRightRadius: vh(3),
    borderColor: "#babbbc",
    width: vw(64),
  },

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
  label: {
    position: "absolute",
    left: 22,
    zIndex: 0,
    paddingHorizontal: 8,
    fontSize: 12,
    color: "#6b7f9d",
    fontWeight: "500",
    width: vw(25),
    textAlign: "center",
  },
  placeholderStyle: {
    fontSize: 12,
    color: "#c3c3c3",
    fontWeight: "500",
    width: vw(25),
  },
  selectedTextStyle: {
    fontSize: 12,
    color: "#6b7f9d",
    fontWeight: "500",
    width: vw(25),
  },
  itemTextStyle: {
    fontSize: 12,
    color: "#6b7f9d",
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
    color: "#6b7f9d",
    fontWeight: "500",
    width: vw(25),
    textAlign: "center",
  },
});
