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
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL } from "@env";
import { ScrollView } from "react-native";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { parrotBananaLeafGreen, parrotBlue, parrotBlueSemiTransparent, parrotCream, parrotLightBlue, parrotPistachioGreen, parrotPlaceholderGrey, parrotTextDarkBlue } from "../assets/color";
import {
  register_ReceiveMessage,
  unregister_ReceiveMessage,
  register_ReceiveMessageRefetch,
  unregister_ReceiveMessageRefetch,
  register_OnReconnecting,
  unregister_OnReconnecting,
  register_OnReconnected,
  unregister_OnReconnected,
  invokeHub,
  isHubReady
} from "../signalr/signalRHub"

export const ConversationDetailScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };
  const route = useRoute();
  const currentUserId = useSelector((state) => state.users.userId);
  const currentUserName = useSelector((state) => state.users.userName);
  const currentUserProfileImage = useSelector((state) => state.users.userProfileImage);
  const { conversationUserId, profileImg, name, publicId } = route.params;
  // console.log("-->>", conversationUserId, profileImg, name, publicId);
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
        // console.log("Cleaning up in ConversationDetailScreen");
      };
    }, [refetch, navigation])
  );

  useFocusEffect(
    useCallback(() => {

      if (!currentUserId || !conversationUserId) return;

      // Enter conversation
      if (isHubReady()) {
        invokeHub("EnterConversationPage", currentUserId, conversationUserId);
        console.log("--> entered conversation page");
      }

      // Message handler
      const handleReceiveMessage = (
        senderId,
        content,
        newTime,
        senderProfileUrl,
        senderUsername
      ) => {

        setReceivedMessageData([
          senderId,
          content,
          newTime,
          senderProfileUrl,
          senderUsername
        ]);

      };

      // Refetch handler
      const handleRefetch = async () => {

        try {
          await refetch();
        } catch (err) {
          console.error("Failed to refetch messages:", err);
        }

      };

      // Register handlers
      register_ReceiveMessage(handleReceiveMessage);
      register_ReceiveMessageRefetch(handleRefetch);


      // Cleanup
      return () => {

        invokeHub("LeaveConversationPage", currentUserId);

        unregister_ReceiveMessage(handleReceiveMessage);
        unregister_ReceiveMessageRefetch(handleRefetch);

        console.log("<-- left conversation page");

      };

    }, [currentUserId, conversationUserId, refetch])
  );


  // ---------------- SIGNALR CODE ---------------------//
  // ---------------------------------------------------//

  useFocusEffect(
    useCallback(() => {
      const handleReconnecting = () => {
        showToast("Connection lost - Reconnecting...");
      };
      const handleReconnected = () => {
        setToastVisible(false);
        showToast("Reconnected");
      };
      register_OnReconnecting(handleReconnecting);
      register_OnReconnected(handleReconnected);
      return () => {
        setToastVisible(false);
        unregister_OnReconnecting(handleReconnecting);
        unregister_OnReconnected(handleReconnected);
      };
    }, [])
  );

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

  /*
    const handleSendMessage = async () => {
      console.log("1");
      if (!message.trim()) return; // Don't send empty messages
  
      // Scroll to bottom immediately
      scrollViewRef.current.scrollToEnd({ animated: true });
      console.log("2");
  
      // Prepare message object
      const currentDate = new Date();
      const formattedDateTime = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}T${String(currentDate.getHours()).padStart(2, "0")}:${String(currentDate.getMinutes()).padStart(2, "0")}:${String(currentDate.getSeconds()).padStart(2, "0")}.${String(currentDate.getMilliseconds()).padStart(3, "0")}`;
      console.log("3");
  
      const sentMessage = {
        dateTime: formattedDateTime,
        receiverId: conversationUserId,
        senderId: currentUserId,
        text: message,
      };
      console.log("4");
  
      // Optimistic UI update
      setMessagesToDisplay((prev) => [...(prev ?? []), sentMessage]);
      setMessage("");
      setTextInputBottomMargin(0);
      Keyboard.dismiss();
      console.log("5");
  
      // Retry function
      const sendWithRetry = async (msg, retries = 3, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
          console.log("6");
          console.log("hc: ", hubConnection.current.state);
  
          if (
            hubConnection.current.state === "Connected" &&
            chatReadyRef.current === true
          ) {
            try {
              console.log("7");
  
              await hubConnection.current.invoke(
                "SendMessage",
                currentUserId,
                conversationUserId,
                msg.text
              );
              console.log("8");
  
              console.log("Message sent successfully.");
              return true;
            } catch (err) {
              console.error("Send attempt failed:", err);
            }
          }
          console.log("9");
  
          console.log(`Retrying send in ${delay}ms... (${i + 1}/${retries})`);
          await new Promise((res) => setTimeout(res, delay));
        }
        return false;
      };
  
      const success = await sendWithRetry(sentMessage);
      if (!success) {
        console.error("Failed to send message after retries.");
        setMessagesToDisplay((prev) =>
          prev.filter((msg) => msg.dateTime !== sentMessage.dateTime)
        );
        alert("Failed to send message. Please check your connection and try again.");
      }
    };
  */


  const handleSendMessage = async () => {
    if (!message.trim()) return;

    scrollViewRef.current.scrollToEnd({ animated: true });

    const currentDate = new Date();
    const formattedDateTime = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}T${String(currentDate.getHours()).padStart(2, "0")}:${String(currentDate.getMinutes()).padStart(2, "0")}:${String(currentDate.getSeconds()).padStart(2, "0")}.${String(currentDate.getMilliseconds()).padStart(3, "0")}`;

    const sentMessage = {
      dateTime: formattedDateTime,
      receiverId: conversationUserId,
      senderId: currentUserId,
      text: message,
    };

    // Optimistic UI
    setMessagesToDisplay((prev) => [...(prev ?? []), sentMessage]);
    setMessage("");
    setTextInputBottomMargin(0);
    Keyboard.dismiss();

    // ✅ NEW: use your signalr wrapper
    const sendWithRetry = async (msg, retries = 3, delay = 1000) => {
      for (let i = 0; i < retries; i++) {

        if (isHubReady()) {
          try {
            await invokeHub(
              "SendMessage",
              currentUserId,
              conversationUserId,
              msg.text
            );

            console.log("Message sent successfully.");
            return true;
          } catch (err) {
            console.error("Send attempt failed:", err);
          }
        }

        console.log(`Retrying send in ${delay}ms... (${i + 1}/${retries})`);
        await new Promise((res) => setTimeout(res, delay));
      }
      return false;
    };

    const success = await sendWithRetry(sentMessage);

    if (!success) {
      console.error("Failed to send message after retries.");

      // rollback optimistic message
      setMessagesToDisplay((prev) =>
        prev.filter((msg) => msg.dateTime !== sentMessage.dateTime)
      );

      showToast("Message not sent - Please check your connection.");
    }
  };


  if (hasError) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[parrotPistachioGreen, parrotBananaLeafGreen]} // Android
            tintColor={parrotBananaLeafGreen} // iOS
          />
        }
      >
        <View>
          <Image
            source={require("../assets/parrotslogo.png")}
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
      <View style={{ flex: 1, backgroundColor: "white" }} >
        <TokenExpiryGuard />

        <View
          style={[
            styles.mainContainer, // 🟢 base styles
            textInputBottomMargin !== 0 ? { paddingTop: vh(1) } : { paddingTop: vh(6) } // 🟢 conditional paddingTop
          ]}
        >
          {/* // HEADER // */}
          <View
            style={styles.headerStyle}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Messages", {
                  screen: "ProfileScreenPublic",
                  params: { publicId: publicId, userName: name, userId: conversationUserId },
                });
              }}
              style={styles.headerContainer}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: `${profileImg}`,
                  }}
                  style={styles.profileImage}
                />
              </View>
              <View>
                <Text style={styles.nameStyle}>{name}
                  <MaterialCommunityIcons name="chevron-right" size={20} />
                </Text>
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
                  marginTop: vh(5),
                }
                : {
                  top: vh(15) - textInputBottomMargin,
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
                    placeholderTextColor={parrotPlaceholderGrey}
                    value={message}
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
        {toastVisible && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}
      </View>


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
    backgroundColor: parrotCream,
    width: vw(75),
    minHeight: vh(4.5),
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
    // color: "#3c9dde",
    color: parrotLightBlue,
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
    backgroundColor: parrotLightBlue,
    padding: vh(1),
    borderRadius: vh(3),
  },
  buttonClearDisabled: {
    color: "white",
    textAlign: "center",
    backgroundColor: parrotBlueSemiTransparent,
    padding: vh(1),
    borderRadius: vh(3),
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    top: vh(0.1),
    right: vh(0.1),
  },
  toast: {
    position: "absolute",
    bottom: vh(10),
    alignSelf: "center",
    backgroundColor: "rgba(30, 111, 217, 0.9)",
    paddingHorizontal: vw(4),
    paddingVertical: vh(1),
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  toastText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
});
