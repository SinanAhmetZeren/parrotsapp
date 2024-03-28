/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import ConversationList from "../components/ConversationList";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useGetMessagesByUserIdQuery } from "../slices/MessageSlice";

export default function MessagesScreen({ navigation }) {
  const userId = "1bf7d55e-7be2-49fb-99aa-93d947711e32";

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError,
    error,
    isSuccess: isSuccessMessages,
    refetch,
  } = useGetMessagesByUserIdQuery(userId);

  const [message, setMessage] = useState("hi there");
  const [receivedMessage, setReceivedMessage] = useState("");
  const [receivedMessageData, setReceivedMessageData] = useState("");
  const [connectionState, setConnectionState] = useState("");
  const [messageSenderId, setMessageSenderId] = useState("");
  const [transformedMessages, setTransformedMessages] = useState([]);

  const recipientId = userId;
  const hubConnection = useMemo(() => {
    return new HubConnectionBuilder()
      .withUrl(
        `https://measured-wolf-grossly.ngrok-free.app/chathub/11?userId=${userId}`
      )
      .build();
  }, [userId]);

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
    // console.log("...messages data from useeffect ", messagesData);

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
    console.log("index...", index);
    console.log("msg with index", transformedMessages[index]);

    if (!receivedMessageData) return;

    if (index !== -1) {
      console.log("---->> ---->>");

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
      console.log("hello from -1");

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
