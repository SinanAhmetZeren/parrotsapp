/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { vh } from "react-native-expo-viewport-units";

const data2 = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
  { label: "Item 4", value: "4" },
  { label: "Item 5", value: "5" },
  { label: "Item 6", value: "6" },
  { label: "Item 7", value: "7" },
  { label: "Item 8", value: "8" },
];

const DropdownComponent = ({ data, label, setVehicleId }) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          {label}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemTextStyle={{ fontSize: 13, color: "rgba(0, 119, 234,0.9)" }}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Select Vehicle" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
          setVehicleId(item.value);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={"rgba(0, 119, 234,0.9)"}
            name="Safety"
            size={20}
          />
        )}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "pink",
    borderRadius: 30,
    marginVertical: 2,
  },
  dropdown: {
    height: vh(5),
    borderWidth: 1,
    borderRadius: vh(3),
    backgroundColor: "white",
    borderColor: "rgba(190, 119, 234,0.4)",
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
    color: "rgba(0, 119, 234,0.9)",
  },
  placeholderStyle: {
    fontSize: 12,
    color: "rgba(0, 119, 234,0.9)",
  },
  selectedTextStyle: {
    fontSize: 12,
    color: "rgba(0, 119, 234,0.9)",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 30,
    fontSize: 12,
    color: "rgba(0, 119, 234,0.9)",
  },
});
