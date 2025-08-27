/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from "react";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
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
import { API_URL } from "@env";
import { ScrollView } from "react-native-web";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";

export const ConversationDetailScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

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
    isError: isErrorMessages,
    error,
    isSuccess: isSuccessMessages,
    refetch,
  } = useGetMessagesBetweenUsersQuery(users);
  const [message, setMessage] = useState("");
  const [messagesToDisplay, setMessagesToDisplay] = useState([]);
  const [textInputBottomMargin, setTextInputBottomMargin] = useState(0);
  const scrollViewRef = useRef();

  const hubConnection = useMemo(() => {
    return new HubConnectionBuilder()
      .withUrl(`${API_URL}/chathub/11?userId=${currentUserId}`)
      .build();
  }, [currentUserId]);

  useEffect(() => {
    if (isErrorMessages) {
      setHasError(true);
    }
    if (!isErrorMessages) {
      setHasError(false);
    }
  }, [isErrorMessages]);

  const onRefresh = () => {
    setRefreshing(true);
    setHasError(false);
    try {
      refetch();
    } catch (error) {
      console.log(error);
      setHasError(true);
    }
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const refetchedMessages = await refetch().unwrap();
          setMessagesToDisplay(refetchedMessages.data);
        } catch (error) {
          console.error("Error refetching messages data:", error);
        }
      };

      fetchData();
      return () => {
        console.log("Cleaning up in ConversationDetailScreen");
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
      async (senderId, content, newTime, senderProfileUrl, senderUsername) => { }
    );

    hubConnection.on("ReceiveMessageRefetch", () => {
      refetch();
    });

    return () => { };
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setTextInputBottomMargin(event.endCoordinates.height);
        console.log("height: ", event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      (event) => {
        setTextInputBottomMargin(0);
        console.log("height: ", event.endCoordinates.height);
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

  const handleSendMessage = async () => {
    scrollViewRef.current.scrollToEnd({ animated: true });

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

    // Optimistic UI Update
    setMessagesToDisplay((prevMessages) => {
      return [...(prevMessages ?? []), sentMessage];
    });

    setMessage("");

    try {
      await hubConnection.invoke(
        "SendMessage",
        currentUserId,
        conversationUserId,
        message
      );
      console.log("Message sent successfully.");
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessagesToDisplay((prevMessages) => {
        return prevMessages.filter(
          (msg) => msg.dateTime !== sentMessage.dateTime
        );
      });
      alert(
        "Failed to send message. Please check your connection and try again."
      );
    }
  };

  if (hasError) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#9Bd35A", "#689F38"]} // Android
            tintColor="#689F38" // iOS
          />
        }
      >
        <View>
          <Image
            source={require("../assets/ParrotsWhiteBg.png")}
            style={styles.logoImage}
          />
          <Text style={styles.currentBidsTitle2}>Connection Error</Text>
          <Text style={styles.currentBidsTitle3}>Swipe Down to Retry</Text>
        </View>
      </ScrollView>
    );
  }

  if (isLoadingMessages) {
    return <ActivityIndicator size="large" style={{ top: vh(30) }} />;
  }

  if (isSuccessMessages) {
    return (
      <>
        <TokenExpiryGuard />

        <View style={styles.mainContainer}>
          {/* // HEADER // */}
          <View
            style={[
              styles.headerStyle,
              textInputBottomMargin !== 0
            ]}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Messages", {
                  screen: "ProfileScreenPublic",
                  params: { userId: conversationUserId },
                });
              }}
              style={styles.headerContainer}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: `${API_URL}/Uploads/UserImages/${profileImg}`,
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
            style={
              textInputBottomMargin === 0
                ? {
                  zIndex: 100,
                  backgroundColor: "white",
                }
                : {
                  top: vh(8) - textInputBottomMargin,
                  zIndex: 100,
                  backgroundColor: "white",
                }
            }
          >
            <View style={styles.scrollViewMessages}>
              <MessagesComponent
                data={messagesToDisplay}
                currentUserId={currentUserId}
                userName={currentUserName}
                userProfileImage={currentUserProfileImage}
                otherUserProfileImg={profileImg}
                otherUserName={name}
                scrollViewRef={scrollViewRef}
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
                  top: vh(15) - textInputBottomMargin,
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
                    multiline
                    placeholder="Write a message"
                    placeholderTextColor="#a3b4c5"
                    value={message}
                    numberOfLines={1}
                    maxLength={500}
                  />
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
      </>


    );
  }
};

const styles = StyleSheet.create({
  headerStyle: {
    position: "absolute",
    top: 0,
    zIndex: 110,
    paddingLeft: vh(2),
    paddingTop: vh(2),
    backgroundColor: "white",
  },
  mainContainer:
  {
    backgroundColor: "white",
    padding: vh(2),
  },
  textinputStyle: {
    backgroundColor: "#f9f5f1",
    width: vw(75),
    maxHeight: vh(12),
    paddingLeft: vh(1.5),
    paddingVertical: vh(0.5),
    borderRadius: vh(2),
  },
  messageTextContainer: {
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
    width: vw(100),
    height: vh(6),
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
    height: vh(74),
    backgroundColor: "white",
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
