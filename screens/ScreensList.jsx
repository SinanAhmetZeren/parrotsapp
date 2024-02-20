/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { View, TouchableOpacity, Button, StyleSheet, Text } from "react-native";

export default function AllUsersScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity
        style={[styles.button]}
        onPress={() =>
          navigation.navigate("DevScreens", { screen: "Register" })
        }
      >
        <Text style={styles.buttonText}>Go to Register Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button]}
        onPress={() => navigation.navigate("DevScreens", { screen: "Login" })}
      >
        <Text style={styles.buttonText}>Go to Login Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button]}
        onPress={() => navigation.navigate("Main", { screen: "Home" })}
      >
        <Text style={styles.buttonText}>Go to Home Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 5,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 16,
  },
  buttonText: {
    color: "white",
  },
});
