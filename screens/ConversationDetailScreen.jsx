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
  Keyboard,
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

  // console.log("current user id.....->", currentUserId);
  // console.log("issuccessuser....->", isSuccessUser);
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
  const [message, setMessage] = useState("");
  const [userProfileImage, setUserProfileImage] = useState("");
  const [userName, setUserName] = useState("");
  const [receivedMessageData, setReceivedMessageData] = useState([]);
  const [transformedMessages, setTransformedMessages] = useState([]);
  ///////// KEYBOARD ///////////
  // const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [textInputBottomMargin, setTextInputBottomMargin] = useState(0); // Initial margin for TextInput

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
        console.log("oh !");
        if (receivedMessageData[0] === conversationUserId) {
          console.log("aaaaa....", receivedMessageData[0]);
          console.log("bbbbb....", conversationUserId);
          console.log("ccccc....", transformedMessages[0]);

          const newMessage = {
            dateTime: newTime,
            id: newTime,
            readByReceiver: "false",
            receiverId: currentUserId,
            receiverProfileUrl: null,
            receiverUsername: null,
            rendered: false,
            senderId: conversationUserId,
            senderProfileUrl: null,
            senderUsername: null,
            text: content,
          };

          setTransformedMessages((prevMessages) => {
            return [...prevMessages, newMessage];
          });
        }

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
    if (isSuccessMessages && isSuccessUser && receivedMessageData[0]) {
      console.log("x------>", receivedMessageData);

      setTransformedMessages((prevMessages) => {
        // return [...prevMessages, newMessage];
        return [...prevMessages];
      });
    }

    if (receivedMessageData[0]) {
      console.log("received a message...");
    }
  }, [receivedMessageData]);

  useEffect(() => {
    if (userData) {
      setUserName(userData.userName);
      setUserProfileImage(userData.profileImageUrl);
    }
  }, [isSuccessUser]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        // setKeyboardHeight(event.endCoordinates.height);
        setTextInputBottomMargin(event.endCoordinates.height);
        // console.log("--", event.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        // setKeyboardHeight(0);
        setTextInputBottomMargin(0); // Reset margin when keyboard hides
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSendMessage = () => {
    console.log("sending message", message);
    sendMessage(message);

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split(".")[0];

    const newMessage = {
      dateTime: formattedDate,
      id: formattedDate,
      readByReceiver: "false",
      receiverId: conversationUserId,
      receiverProfileUrl: null,
      receiverUsername: null,
      rendered: false,
      senderId: currentUserId,
      senderProfileUrl: null,
      senderUsername: null,
      text: message,
    };

    setTransformedMessages((prevMessages) => {
      return [...prevMessages, newMessage];
    });
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
        {/* // HEADER // */}
        <View
          style={textInputBottomMargin === 0 ? {} : { top: 0, zIndex: 100 }}
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
        </View>
        {/* // HEADER // */}

        {/* // MESSAGES COMPONENT // */}
        <View
          style={
            textInputBottomMargin === 0
              ? {}
              : {
                  zIndex: 50,
                  height: vh(66) - textInputBottomMargin,
                }
          }
        >
          <ScrollView style={styles.scrollViewMessages}>
            <MessagesComponent
              data={transformedMessages}
              currentUserId={currentUserId}
              userName={userName}
              userProfileImage={userProfileImage}
              otherUserProfileImg={profileImg}
              otherUserName={name}
            />
          </ScrollView>
        </View>
        {/* // MESSAGES COMPONENT // */}

        {/* // SEND MESSAGE COMPONENT // */}
        <View>
          <View style={styles.sendMessageContainer}>
            <View style={styles.messageTextContainer}>
              <View>
                <TextInput
                  onChangeText={(text) => setMessage(text)}
                  style={styles.textinputStyle}
                  numberOfLines={3}
                  multiline
                  placeholder="Write a message"
                  placeholderTextColor="#a3b4c5"
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
        {/* // SEND MESSAGE COMPONENT // */}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  textinputStyle: {
    paddingHorizontal: vh(1),
    backgroundColor: "#f9f5f1",
    width: vw(75),
    height: vh(8),
    padding: vh(1),
    borderRadius: vh(2),
  },
  messageTextContainer: {
    // backgroundColor: "yellow",
    flex: 1,
    padding: vh(0.3),
  },
  sendMessageContainer: {
    // backgroundColor: "lightblue",
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
    width: "100%",
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
    height: vh(66),
    backgroundColor: "white",
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
