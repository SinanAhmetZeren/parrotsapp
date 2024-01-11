/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Text, Image, StyleSheet, Button } from "react-native";

export default function MainScreen({ navigation }) {
  //   const { message } = route.params;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.spacer}>Main Screen</Text>

      <Image
        style={styles.logo}
        source={require("../assets/parrots-logo.jpg")}
      />
      <Button
        title="Go to Profile"
        onPress={() =>
          navigation.navigate("Profile", {
            title: "Came from Main",
          })
        }
      />
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
  spacer: {
    marginTop: 10,
    marginBottom: 10,
  },
});
