/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Button,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useGetMessagesBetweenUsersQuery } from "../slices/MessageSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import { MaterialIcons, AntDesign, Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import DropdownComponent from "../components/DropdownComponent";
import { useRoute } from "@react-navigation/native";
import MessagesComponent from "../components/MessagesComponent";

export const ConversationDetailScreen = () => {
  const route = useRoute();
  const currentUserId = useSelector((state) => state.users.userId);
  const { conversationUserId } = route.params;
  const users = { currentUserId, conversationUserId };
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError,
    error,
    isSuccess: isSuccessMessages,
    refetch,
  } = useGetMessagesBetweenUsersQuery(users);

  const printState = () => {
    console.log("conversationUserId: ", conversationUserId);
    console.log("currentUserId: ", currentUserId);
  };

  if (isLoadingMessages) {
    return <ActivityIndicator size="large" style={{ top: vh(30) }} />;
  }

  if (isSuccessMessages) {
    return (
      <View
        style={{
          marginTop: vh(5),
          padding: vh(2),
          backgroundColor: "lightgreen",
        }}
      >
        <Text style={styles.text1}>current userId: {currentUserId}</Text>
        <Text style={styles.text1}>
          conversation userId: {conversationUserId}
        </Text>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={printState}
            style={styles.buttonCancelContainer}
          >
            <Text style={styles.buttonClear}>Print</Text>
          </TouchableOpacity>
        </View>

        <MessagesComponent data={messagesData.data} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  text1: {
    justifyContent: "center",
    margin: vh(3),
    backgroundColor: "white",
    padding: vh(1),
    borderRadius: vh(2),
  },
  buttonsContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around",
  },
  buttonClear: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    backgroundColor: "#2ac898",
    padding: 5,
    width: vw(30),
    borderRadius: 10,
    marginTop: 5,
  },
});
