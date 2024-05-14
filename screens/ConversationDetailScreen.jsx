/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useGetMessagesBetweenUsersQuery } from "../slices/MessageSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import MessagesComponent from "../components/MessagesComponent";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export const ConversationDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const currentUserId = useSelector((state) => state.users.userId);
  const currentUserName = useSelector((state) => state.users.userName);
  const currentUserProfileImage = useSelector(
    (state) => state.users.userProfileImage
  );

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
  const [messagesToDisplay, setMessagesToDisplay] = useState([]);
  const [textInputBottomMargin, setTextInputBottomMargin] = useState(0);

  const hubConnection = useMemo(() => {
    return new HubConnectionBuilder()
      .withUrl(
        `https://measured-wolf-grossly.ngrok-free.app/chathub/11?userId=${currentUserId}`
      )
      .build();
  }, [currentUserId]);

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
      async (senderId, content, newTime, senderProfileUrl, senderUsername) => {}
    );

    hubConnection.on("ReceiveMessageRefetch", () => {
      refetch();
    });

    return () => {};
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setTextInputBottomMargin(event.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setTextInputBottomMargin(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (messagesData) setMessagesToDisplay(messagesData.data);
  }, [messagesData]);

  const handleSendMessage = () => {
    hubConnection.invoke(
      "SendMessage",
      currentUserId,
      conversationUserId,
      message
    );
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, "0");
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;

    const sentMessage = {
      dateTime: formattedDateTime,
      receiverId: conversationUserId,
      senderId: currentUserId,
      text: message,
    };

    setMessagesToDisplay((prevMessages) => {
      return [...(prevMessages ?? []), sentMessage];
    });

    setMessage("");
  };

  if (isLoadingMessages) {
    return <ActivityIndicator size="large" style={{ top: vh(30) }} />;
  }

  if (isSuccessMessages) {
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
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Create", {
                screen: "ProfileScreenPublic",
                params: { userId: conversationUserId },
              });
            }}
            style={styles.headerContainer}
          >
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
          </TouchableOpacity>
        </View>
        {/* // HEADER // */}

        {/* // MESSAGES COMPONENT // */}
        <View
        // style={
        //   textInputBottomMargin === 0
        //     ? {}
        //     : {
        //         zIndex: 50,
        //         height: vh(66) - textInputBottomMargin,
        //       }
        // }
        >
          <View style={styles.scrollViewMessages}>
            <MessagesComponent
              data={messagesToDisplay}
              currentUserId={currentUserId}
              userName={currentUserName}
              userProfileImage={currentUserProfileImage}
              otherUserProfileImg={profileImg}
              otherUserName={name}
            />
          </View>
        </View>
        {/* // MESSAGES COMPONENT // */}

        {/* // SEND MESSAGE COMPONENT // */}
        <View
          style={
            textInputBottomMargin === 0
              ? {
                  zIndex: 100,
                  backgroundColor: "white",
                }
              : {
                  top: vh(0) - textInputBottomMargin,
                  zIndex: 100,
                  backgroundColor: "white",
                }
          }
        >
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
                disabled={message ? false : true}
                onPress={() => handleSendMessage()}
                style={styles.buttonCancelContainer}
              >
                <View
                  style={
                    message ? styles.buttonClear : styles.buttonClearDisabled
                  }
                >
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
  buttonClearDisabled: {
    color: "white",
    textAlign: "center",
    backgroundColor: "rgba(60,157,222,.3)",
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
