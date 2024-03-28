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
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
} from "react-native";
import { useGetMessagesBetweenUsersQuery } from "../slices/MessageSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import MessagesComponent from "../components/MessagesComponent";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useGetUserByIdQuery } from "../slices/UserSlice";
import { Feather } from "@expo/vector-icons";

export const ConversationDetailScreen = () => {
  const route = useRoute();
  const currentUserId = useSelector((state) => state.users.userId);
  const {
    data: userData,
    isLoading: isLoadingUser,
    isSuccess: isSuccessUser,
  } = useGetUserByIdQuery(currentUserId);

  console.log("current user id.....->", currentUserId);
  console.log("issuccessuser....->", isSuccessUser);
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
  const [message, setMessage] = useState(
    "hi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehimultilinemul tiline multiline therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehimultilinemul tiline multiline"
  );
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
    if (isSuccessMessages) {
      setTransformedMessages(messagesData.data);
    }
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

  if (isLoadingMessages || isLoadingUser) {
    return <ActivityIndicator size="large" style={{ top: vh(30) }} />;
  }

  if (isSuccessMessages && isSuccessUser) {
    // console.log("-- -->>", messagesData.data);
    return (
      <View
        style={{
          marginTop: vh(5),
          backgroundColor: "white",
          padding: vh(2),
        }}
      >
        <View style={styles.headerContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/${profileImg}`,
              }}
              style={styles.profileImage}
            />
          </View>
          <View>
            <Text style={styles.nameStyle}>{name}</Text>
          </View>
        </View>
        <ScrollView style={styles.scrollViewMessages}>
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

        <View style={styles.sendMessageContainer}>
          <View style={styles.messageTextContainer}>
            <View>
              <TextInput
                onChangeText={(text) => setMessage(text)}
                style={styles.textinputStyle}
                numberOfLines={3}
                multiline
              >
                {message}
              </TextInput>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => handleSendMessage()}
              style={styles.buttonCancelContainer}
            >
              <View style={styles.buttonClear}>
                <Text style={styles.buttonText}>
                  <Feather name="send" size={24} color="white" />
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  textinputStyle: {
    paddingHorizontal: vh(1),
    backgroundColor: "white",
    width: vw(75),
    height: vh(8),
  },
  messageTextContainer: {
    backgroundColor: "yellow",
    flex: 1,
    padding: vh(0.3),
  },
  sendMessageContainer: {
    padding: vh(1),
    flexDirection: "row",
  },
  nameStyle: {
    fontWeight: "800",
    color: "#3c9dde",
    fontSize: 22,
    marginTop: vh(1),
  },
  headerContainer: {
    flexDirection: "row",
  },
  profileImage: {
    height: vh(6),
    width: vh(6),
    borderRadius: vh(8),
  },
  imageContainer: {
    height: vh(8),
    width: vh(8),
  },
  scrollViewMessages: {
    backgroundColor: "white",
    marginBottom: vh(5),
    height: vh(60),
  },
  text1: {
    justifyContent: "center",
    margin: vh(3),
    backgroundColor: "white",
    padding: vh(1),
    borderRadius: vh(2),
  },
  buttonsContainer: {
    justifyContent: "center",
  },
  buttonClear: {
    color: "white",
    textAlign: "center",
    backgroundColor: "#3c9dde",
    padding: vh(1),
    borderRadius: vh(3),
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    top: vh(0.1),
    right: vh(0.1),
  },
});
