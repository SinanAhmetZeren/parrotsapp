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
    hubConnection.start();
    hubConnection.on("ReceiveMessage", async (senderId, content, newTime) => {
      setReceivedMessageData([senderId, content, newTime]);
      // setTransformedMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => {
      hubConnection.stop();
    };
  }, []);

  useEffect(() => {
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
  }, [isSuccessMessages]);

  useEffect(() => {
    // console.log("receivedMessageData... ", receivedMessageData);
    console.log("received msg senderId:", receivedMessageData[0]);
    console.log("received msg text:", receivedMessageData[1]);
    console.log("received msg time:", receivedMessageData[2]);
    const newSenderId = receivedMessageData[0];
    const text = receivedMessageData[1];
    const dateTime = receivedMessageData[2];
    const index = transformedMessages.findIndex(
      (msg) => msg.user === newSenderId
    );
    console.log("index...", index);
    console.log("msg with index", transformedMessages[index]);

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

  const handlePrintState = () => {
    console.log("connetction state:", hubConnection.state);
    setConnectionState(hubConnection.state);
  };

  const handlePrintReceived = () => {
    console.log("received msg senderId:", receivedMessageData[0]);
    console.log("received msg text:", receivedMessageData[1]);
    console.log("received msg time:", receivedMessageData[2]);
  };

  const handlePrintMessages = () => {
    console.log("");
    console.log("");
    transformedMessages.forEach((x, index) => console.log(index, ": ", x));
    console.log("");
    console.log("");
  };

  if (isSuccessMessages) {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.recentChats}>Recent Chats</Text>
        </View>
        <View style={{ padding: vh(4), backgroundColor: "lightblue" }}>
          <TextInput
            onChangeText={(text) => setMessage(text)}
            style={{ paddingHorizontal: vh(2), backgroundColor: "white" }}
          >
            {message}
          </TextInput>
          <TouchableOpacity
            onPress={() => handleSendMessage()}
            style={styles.buttonSendBidContainer}
          >
            <Text style={styles.buttonSave}>Send Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handlePrintState()}
            style={styles.buttonSendBidContainer}
          >
            <Text style={styles.buttonSave}>How is connection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handlePrintMessages(transformedMessages)}
            style={styles.buttonSendBidContainer}
          >
            <Text style={styles.buttonSave}>Print Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePrintReceived()}
            style={styles.buttonSendBidContainer}
          >
            <Text style={styles.buttonSave}>Print Received</Text>
          </TouchableOpacity>

          <View>
            <Text>{connectionState} </Text>
          </View>

          <Text
            style={{
              paddingHorizontal: vh(2),
              backgroundColor: "white",
              marginTop: vh(1),
            }}
          >
            {receivedMessage}
          </Text>

          <Text
            style={{
              paddingHorizontal: vh(2),
              backgroundColor: "white",
              marginTop: vh(1),
            }}
          >
            {messageSenderId}
          </Text>
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
    justifyContent: "center",
    alignSelf: "center",
  },
  recentChats: {
    fontWeight: "700",
    fontSize: 26,
    justifyContent: "center",
    alignSelf: "center",
  },
  flatlist: {
    width: vw(94),
    justifyContent: "center",
    alignSelf: "center",
  },
});
