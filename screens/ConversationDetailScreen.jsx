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
  const [receivedMessageData, setReceivedMessageData] = useState([]);
  const [transformedMessages, setTransformedMessages] = useState([]);

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
        console.log("oh!");
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
    setTransformedMessages(messagesData.data);
  }, [isSuccessMessages]);

  useEffect(() => {
    console.log("1", isSuccessMessages);
    console.log("2", isSuccessUser);
    console.log("3", receivedMessageData);
    if (isSuccessMessages && isSuccessUser && receivedMessageData[0]) {
      console.log("x------>", receivedMessageData);
      /*
      const newMessage = {
        user: message.senderId,
        userName: message.senderUsername || 'Unknown',
        userProfileImage: message.senderProfileUrl || 'Default Image URL',
        text: message.text,
        dateTime: formatDate(message.dateTime), // Assuming formatDate function is defined
      };
      */

      setTransformedMessages((prevMessages) => {
        // return [...prevMessages, newMessage];
        return [...prevMessages];
      });
    }

    if (receivedMessageData[0]) {
      console.log("received a message ...");
    }
    console.log("?");

    // dateTime	:	2024-03-26T20:43:39.9403949
    // id	:	198
    // readByReceiver	:	false
    // receiverId	:	1bf7d55e-7be2-49fb-99aa-93d947711e32
    // receiverProfileUrl	:	null
    // receiverUsername	:	null
    // rendered	:	false
    // senderId	:	43242342432342342342
    // senderProfileUrl	:	null
    // senderUsername	:	null
    // text	:	hi dude from postman
  }, [receivedMessageData]);

  useEffect(() => {
    if (userData) {
      setUserName(userData.userName);
      setUserProfileImage(userData.profileImageUrl);
    }
  }, [isSuccessUser]);

  const handleSendMessage = () => {
    console.log("sending message");
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
    console.log("-- -->>", messagesData.data);
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
            {/* <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={() => handlePrintState()}
                style={styles.buttonCancelContainer}
              >
                <Text style={styles.buttonClear}>Print State</Text>
              </TouchableOpacity>
            </View> */}
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
            // data={messagesData.data}
            data={transformedMessages}
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
