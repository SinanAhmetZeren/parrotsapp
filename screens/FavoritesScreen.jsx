/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Text, Image, StyleSheet, Button } from "react-native";
import { vh } from "react-native-expo-viewport-units";

export default function FavoritesScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.spacer}>Favorites</Text>
      <Image style={styles.logo} source={require("../assets/catamaran.jpeg")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: vh(30),
    width: vh(30),
    borderRadius: vh(5),
  },
  spacer: {
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "800",
    color: "red",
  },
});
