/* eslint-disable react/prop-types */
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";

const AddNewVehicleScreen = ({ navigation }) => {
  const handleNavigateToCreateNewVehicle = () => {
    navigation.navigate("AddNewVoyage"); // Assuming the screen name is 'CreateNewVehicle'
  };

  return (
    <View style={styles.x}>
      {/* Your screen content here */}
      <Text>New Vehicle Screen</Text>
      {/* Button to navigate to CreateNewVehicleScreen */}
      <TouchableOpacity
        style={styles.btn}
        onPress={handleNavigateToCreateNewVehicle}
      >
        <Text style={{ color: "white" }}>
          Navigate to Create New Voyage Screen
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddNewVehicleScreen;

const styles = StyleSheet.create({
  x: {
    left: vw(10),
    top: vh(10),
    backgroundColor: "pink",
  },
  btn: {
    marginTop: vh(10),
    left: vw(20),
    padding: vh(2),
    width: "30%",
    backgroundColor: "purple",
  },
});
