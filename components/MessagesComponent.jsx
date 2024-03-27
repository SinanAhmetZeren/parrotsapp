/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { vh } from "react-native-expo-viewport-units";

export default function MessagesComponent({ data }) {
  const renderMessages = () => {
    return data.map((item) => {
      console.log("-->", item);
      return (
        <View
          style={{
            marginTop: vh(1),
            padding: vh(1),
            backgroundColor: "#abcdef",
          }}
        >
          <Text>sender: {item.senderId}</Text>
          <Text>text: {item.text}</Text>
          <Text>dateTime: {item.dateTime}</Text>
          <Text>receiver: {item.receiverId}</Text>
        </View>
      );
    });
  };

  return <View style={styles.container}>{renderMessages()}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom: 50,
  },
});
