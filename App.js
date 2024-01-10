/* eslint-disable no-undef */
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Welcome to parrots App</Text>
      <Image
        style={styles.logo}
        source={require("./assets/parrots-logo.jpg")}
      />

      <StatusBar style="auto" />
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
    height: 150,
    width: 150,
  },
});
