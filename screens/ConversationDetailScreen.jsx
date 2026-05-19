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
  Platform,
} from "react-native";
import { useGetMessagesBetweenUsersQuery } from "../slices/MessageSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import MessagesComponent from "../components/MessagesComponent";
import LoadingLogo from "../components/LoadingLogo";
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Inside your component:
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
  const currentUserProfileImageFull = useSelector((state) => state.users.userProfileImage);
  const currentUserProfileImageThumb = useSelector((state) => state.users.userProfileImageThumbnail);
  const currentUserProfileImage = currentUserProfileImageThumb || currentUserProfileImageFull;
  const { conversationUserId, profileImg, name, publicId } = route.params;
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
  const sendTimestampsRef = useRef([]);
  const insets = useSafeAreaInsets();

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




  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Frontend rate limit: block if 5 messages sent within 5 seconds
    const now = Date.now();
    sendTimestampsRef.current = sendTimestampsRef.current.filter(t => now - t < 5000);
    if (sendTimestampsRef.current.length >= 5) return;
    sendTimestampsRef.current.push(now);

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
    const savedMessage = message;
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

      // rollback optimistic message and restore text
      setMessagesToDisplay((prev) =>
        prev.filter((msg) => msg.dateTime !== sentMessage.dateTime)
      );
      setMessage(savedMessage);
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
          <Text style={styles.currentBidsTitle2}>Something went wrong</Text>
          <Text style={styles.currentBidsTitle2}>Swipe down to retry</Text>
          <Text style={styles.currentBidsTitle3}>Swipe Down to Retry</Text>
        </View>
      </ScrollView>
    );
  }

  if (isLoadingMessages) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <LoadingLogo size={200} />
      </View>
    );
  }

  if (isSuccessMessages) {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }} >
        <TokenExpiryGuard />

        <View style={styles.mainContainer}>
          {/* // HEADER // */}
          <View style={styles.headerStyle}>
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
                  source={{ uri: `${profileImg}` }}
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
          <View style={[styles.messagesWrapper, {
            bottom: textInputBottomMargin ? textInputBottomMargin - vh(8) : vh(0),
            height: vh(76) - (Platform.OS === "ios" ? insets.top + insets.bottom : 0),
          }]}>

            {/* 76 android
            77 ios */}
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
          {/* // MESSAGES COMPONENT // */}

          <View style={[styles.sendRow,
          {
            bottom: textInputBottomMargin ? textInputBottomMargin - vh(8) : vh(0),
            paddingBottom: insets.bottom
          }]}>
            <TextInput
              onChangeText={(text) => setMessage(text)}
              style={styles.textinputStyle}
              multiline
              placeholder="Write a message"
              placeholderTextColor={parrotPlaceholderGrey}
              value={message}
              maxLength={500}
            />
            <TouchableOpacity
              disabled={!message.trim()}
              onPress={() => handleSendMessage()}
              style={message.trim() ? styles.sendBtn : styles.sendBtnDisabled}
            >
              <Feather name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>


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
    left: 0,
    right: 0,
    zIndex: 110,
    paddingLeft: vh(2),
    paddingTop: vh(2),
    backgroundColor: "white",
  },
  mainContainer: {
    backgroundColor: "white",
    padding: vh(2),
  },
  messagesWrapper: {
    marginTop: vh(7),
    backgroundColor: "white",
    marginBottom: vh(0),
  },
  textinputStyle: {
    flex: 1,
    backgroundColor: "white",
    minHeight: vh(5),
    maxHeight: vh(14),
    paddingHorizontal: vw(4),
    paddingVertical: vh(1),
    borderRadius: vh(4),
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: "black",
  },
  sendRow: {
    // position: "absolute",
    // left: 0,
    // right: 0,
    zIndex: 200,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: vw(3),
    marginHorizontal: -vh(2),
    paddingVertical: vh(1),
    backgroundColor: parrotCream,
    gap: vw(2),
  },
  sendBtn: {
    backgroundColor: parrotLightBlue,
    width: vh(5),
    height: vh(5),
    borderRadius: vh(2.5),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  sendBtnDisabled: {
    backgroundColor: parrotBlueSemiTransparent,
    width: vh(5),
    height: vh(5),
    borderRadius: vh(2.5),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  nameStyle: {
    fontFamily: "Nunito_800ExtraBold",
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
    minHeight: vh(50),
    backgroundColor: "green",
    padding: 1
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
    fontFamily: "Nunito_700Bold",
    color: "white",
    fontSize: 13,
  },
});
