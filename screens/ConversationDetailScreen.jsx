/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
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
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import MessagesComponent from "../components/MessagesComponent";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useGetUserByIdQuery } from "../slices/UserSlice";
import { current } from "@reduxjs/toolkit";
export const ConversationDetailScreen = () => {
  const route = useRoute();
  const currentUserId = useSelector((state) => state.users.userId);
  const {
    data: userData,
    isLoading: isLoadingUser,
    isSuccess: isSuccessUser,
  } = useGetUserByIdQuery(currentUserId);
  const { conversationUserId, profileImg, name } = route.params;
  const users = { currentUserId, conversationUserId };
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError,
    error,
    isSuccess: isSuccessMessages,
    refetch,
  } = useGetMessagesBetweenUsersQuery(users);
  const [message, setMessage] = useState("hi there");
  const [userProfileImage, setUserProfileImage] = useState("");
  const [userName, setUserName] = useState("");

  const hubConnection = useMemo(() => {
    return new HubConnectionBuilder()
      .withUrl(
        `https://measured-wolf-grossly.ngrok-free.app/chathub/11?userId=${currentUserId}`
      )
      .build();
  }, [currentUserId]);

  useEffect(() => {
    const startHubConnection = async () => {
      try {
        await hubConnection.start();
        console.log("SignalR connection  started successfully.");
      } catch (error) {
        console.error("Failed to start SignalR connection:", error);
      }
    };
    startHubConnection();
    hubConnection.on(
      "ReceiveMessage",
      async (senderId, content, newTime, senderProfileUrl, senderUsername) => {
        setReceivedMessageData([
          senderId,
          content,
          newTime,
          senderProfileUrl,
          senderUsername,
        ]);
      }
    );
    return () => {
      hubConnection.stop();
    };
  }, []);

  useEffect(() => {
    if (userData) {
      setUserName(userData.userName);
      setUserProfileImage(userData.profileImageUrl);
    }
  }, [isSuccessUser]);

  const handleSendMessage = () => {
    sendMessage(message);
  };

  const sendMessage = (messageToSend) => {
    const messageWithTimeStamp =
      messageToSend + " - " + new Date().toLocaleString();
    hubConnection.invoke(
      "SendMessage",
      currentUserId,
      conversationUserId,
      messageWithTimeStamp
    );
  };

  const handlePrintState = () => {
    console.log("user profile img: ", userProfileImage);
    console.log("user name: ", userName);
  };

  if (isLoadingMessages) {
    return <ActivityIndicator size="large" style={{ top: vh(30) }} />;
  }

  if (isSuccessMessages && isSuccessUser) {
    return (
      <View
        style={{
          marginTop: vh(5),
          backgroundColor: "white",
          padding: vh(2),
        }}
      >
        <ScrollView style={styles.scrollViewMessages}>
          <View style={{ padding: vh(1), backgroundColor: "lightblue" }}>
            <TextInput
              onChangeText={(text) => setMessage(text)}
              style={{ paddingHorizontal: vh(2), backgroundColor: "white" }}
            >
              {message}
            </TextInput>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={() => handlePrintState()}
                style={styles.buttonCancelContainer}
              >
                <Text style={styles.buttonClear}>Print State</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={() => handleSendMessage()}
                style={styles.buttonCancelContainer}
              >
                <Text style={styles.buttonClear}>Send Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          <MessagesComponent
            data={messagesData.data}
            currentUserId={currentUserId}
            userName={userName}
            userProfileImage={userProfileImage}
            otherUserProfileImg={profileImg}
            otherUserName={name}
          />
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  scrollViewMessages: {
    backgroundColor: "white",
    marginBottom: vh(5),
  },
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
    padding: 2,
    width: vw(40),
    borderRadius: 10,
    marginTop: 5,
  },
});
