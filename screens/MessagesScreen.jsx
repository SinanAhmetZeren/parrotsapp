/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import ConversationList from "../components/ConversationList";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useGetMessagesByUserIdQuery } from "../slices/MessageSlice";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

export default function MessagesScreen({ navigation }) {
  const userId = useSelector((state) => state.users.userId);
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError,
    error,
    isSuccess: isSuccessMessages,
    refetch,
  } = useGetMessagesByUserIdQuery(userId);
  const [receivedMessageData, setReceivedMessageData] = useState("");
  const [transformedMessages, setTransformedMessages] = useState([]);

  const recipientId = userId;
  const hubConnection = useMemo(() => {
    return new HubConnectionBuilder()
      .withUrl(
        `https://measured-wolf-grossly.ngrok-free.app/chathub/11?userId=${userId}`
      )
      .build();
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await refetch();
        } catch (error) {
          console.error("Error refetching messages data:", error);
        }
      };
      fetchData();
      return () => {
        // Cleanup function if needed
      };
    }, [refetch, navigation])
  );

  useEffect(() => {
    // hubConnection.start();

    const startHubConnection = async () => {
      try {
        await hubConnection.start();
        console.log("SignalR connection started successfully.");
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
    if (isSuccessMessages) {
      setTransformedMessages(
        messagesData.map((message) => {
          const user =
            message.senderId !== userId ? message.senderId : message.receiverId;
          const userProfileImage =
            message.senderId !== userId
              ? message.senderProfileUrl
              : message.receiverProfileUrl;
          const userName =
            message.senderId !== userId
              ? message.senderUsername
              : message.receiverUsername;
          const text = message.text;
          const dateTime = message.dateTime;
          return { user, userName, userProfileImage, text, dateTime };
        })
      );
    }
  }, [isSuccessMessages]);

  useEffect(() => {
    const newSenderId = receivedMessageData[0];
    const text = receivedMessageData[1];
    const dateTime = receivedMessageData[2];
    const senderProfileUrl = receivedMessageData[3];
    const senderUsername = receivedMessageData[4];

    const index = transformedMessages.findIndex(
      (msg) => msg.user === newSenderId
    );

    if (!receivedMessageData) return;

    if (index !== -1) {
      setTransformedMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[index] = {
          ...updatedMessages[index],
          text,
          dateTime,
        };
        return updatedMessages;
      });
    }

    if (index == -1) {
      const newMessageFromNewUser = {
        dateTime: dateTime,
        text: text,
        user: newSenderId,
        userName: senderUsername,
        userProfileImage: senderProfileUrl,
      };

      setTransformedMessages((prevMessages) => {
        return [...prevMessages, newMessageFromNewUser];
      });
    }
  }, [receivedMessageData]);

  const sendMessage = (messageToSend) => {
    const messageWithTimeStamp =
      messageToSend + " - " + new Date().toLocaleString();
    hubConnection.invoke(
      "SendMessage",
      userId,
      recipientId,
      messageWithTimeStamp
    );
  };

  const handleSendMessage = () => {
    sendMessage(message);
  };

  if (isSuccessMessages) {
    console.log("success......");

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.recentChats}>Recent Chats</Text>
        </View>

        <View style={styles.flatlist}>
          <ConversationList data={transformedMessages} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonSave: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    backgroundColor: "#186ff1",
    marginTop: vh(1),
    paddingVertical: vh(0.5),
  },
  container: {
    marginTop: vh(5),
    backgroundColor: "white",
    width: vw(100),
    alignSelf: "center",
    height: vh(95),
  },
  recentChats: {
    fontWeight: "700",
    fontSize: 26,
    justifyContent: "center",
    alignSelf: "center",
  },
  flatlist: {
    backgroundColor: "yellow",
    marginTop: vh(2),
    width: vw(94),
    justifyContent: "center",
    alignSelf: "center",
  },
});
