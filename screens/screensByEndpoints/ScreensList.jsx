/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";

export default function AllUsersScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>hello</Text>
      <Button
        title="Go to Register Screen"
        onPress={() =>
          navigation.navigate("FncScreensStack", { screen: "Register" })
        }
      />
    </View>
  );
}
