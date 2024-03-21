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
  const [connectionState, setConnectionState] = useState("");

  const senderId = "1bf7d55e-7be2-49fb-99aa-93d947711e32";
  const recipientId = senderId;
  const hubConnection = useMemo(() => {
    return new HubConnectionBuilder()
      .withUrl(
        `https://measured-wolf-grossly.ngrok-free.app/chathub/11?userId=${senderId}`
      )
      .build();
  }, [senderId]);

  useEffect(() => {
    hubConnection.start();
    hubConnection.on("ReceiveMessage", (receivedMessage) => {
      // setReceivedMessage(receivedMessage);
      console.log("received message: ", receivedMessage);
    });

    return () => {
      hubConnection.stop();
    };
  }, []);

  const sendMessage = (messageToSend) => {
    const messageWithTimeStamp =
      messageToSend + " - " + new Date().toLocaleString();
    console.log("sendMessage function: ", messageWithTimeStamp);
    hubConnection.invoke(
      "SendMessage",
      senderId,
      recipientId,
      messageWithTimeStamp
    );
  };

  const handleSendMessage = () => {
    sendMessage(message);
  };

  const handlePrintState = () => {
    console.log("connetction state:", hubConnection.state);
    // setConnectionState(hubConnection.state);
  };

  if (isSuccessMessages) {
    const transformedMessages = messagesData.map((message) => {
      const currentUser = "1bf7d55e-7be2-49fb-99aa-93d947711e32";
      const user =
        message.senderId !== currentUser
          ? message.senderId
          : message.receiverId;
      const userProfileImage =
        message.senderId !== currentUser
          ? message.senderProfileUrl
          : message.receiverProfileUrl;
      const userName =
        message.senderId !== currentUser
          ? message.senderUsername
          : message.receiverUsername;
      const text = message.text;
      const dateTime = message.dateTime;

      return { user, userName, userProfileImage, text, dateTime };
    });

    console.log("transformedMessages: ", transformedMessages);

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.recentChats}>Recent Chats</Text>
        </View>
        <View style={{ padding: vh(4), backgroundColor: "lightblue" }}>
          <TextInput
            onChangeText={(text) => setMessage(text)}
            style={{ padding: vh(2), backgroundColor: "white" }}
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
          <View>
            <Text>{connectionState} </Text>
          </View>

          <Text
            style={{
              padding: vh(2),
              backgroundColor: "white",
              marginTop: vh(1),
            }}
          >
            {receivedMessage}
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
    marginTop: 100,
    //  backgroundColor: "#e9e9e9",
    backgroundColor: "white",
    width: vw(100),
    justifyContent: "center",
    alignSelf: "center",
  },
  recentChats: {
    fontWeight: "700",
    fontSize: 26,
    paddingBottom: 30,
    justifyContent: "center",
    alignSelf: "center",
  },
  flatlist: {
    width: vw(94),
    justifyContent: "center",
    alignSelf: "center",
  },
});
