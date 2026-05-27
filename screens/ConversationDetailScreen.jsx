/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
  Platform,
} from "react-native";
import { useGetMessagesBetweenUsersQuery } from "../slices/MessageSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { parrotBlueSemiTransparent, parrotLightBlue, parrotLightCream, parrotPlaceholderGrey } from "../assets/color";
import {
  invokeHub, isHubReady,
  register_ReceiveMessage, unregister_ReceiveMessage,
  register_ReceiveMessageRefetch, unregister_ReceiveMessageRefetch,
  register_OnReconnecting, unregister_OnReconnecting,
  register_OnReconnected, unregister_OnReconnected,
} from "../signalr/signalRHub";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
const DeviceInfo = Constants.appOwnership === "expo" ? null : require('react-native-device-info').default;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return [`${hours}:${minutes}`, `${day}/${month}/${year}`];
};

export const ConversationDetailScreen = ({ navigation }) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMsg] = useState("");
  const [message, setMessage] = useState("");
  const [messagesToDisplay, setMessagesToDisplay] = useState([]);
  const scrollViewRef = useRef();
  const sendTimestampsRef = useRef([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.OS === "ios"
    ? (vh(100) - insets.top - insets.bottom) * 0.08
    : vh(8);
  const isTablet = DeviceInfo ? DeviceInfo.isTablet() : false;
  const containerHeight = Platform.OS === "ios" || isTablet
    ? vh(103) - tabBarHeight - insets.top - insets.bottom
    : vh(105) - tabBarHeight;

  const showToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const route = useRoute();
  const currentUserId = useSelector((state) => state.users.userId);
  const { conversationUserId, profileImg, name, publicId } = route.params;

  const { data: messagesData, refetch } = useGetMessagesBetweenUsersQuery(
    { currentUserId, conversationUserId },
    { skip: !currentUserId || !conversationUserId, refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (messagesData) setMessagesToDisplay(messagesData.data);
  }, [messagesData]);

  useEffect(() => {
    if (scrollViewRef.current && messagesToDisplay?.length > 0) {
      requestAnimationFrame(() => scrollViewRef.current?.scrollToEnd({ animated: true }));
    }
  }, [messagesToDisplay]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => setKeyboardHeight(e.endCoordinates.height));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardHeight(0));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  useEffect(() => {
    if (keyboardHeight > 0) {
      requestAnimationFrame(() => scrollViewRef.current?.scrollToEnd({ animated: true }));
    }
  }, [keyboardHeight]);

  useFocusEffect(
    useCallback(() => {
      refetch().then(result => {
        if (result.data) setMessagesToDisplay(result.data.data);
      });
      if (isHubReady()) invokeHub("EnterConversationPage", currentUserId, conversationUserId);
      return () => {
        if (isHubReady()) invokeHub("LeaveConversationPage", currentUserId);
      };
    }, [refetch, currentUserId, conversationUserId])
  );

  useFocusEffect(
    useCallback(() => {
      const handleReceiveMessage = (senderId, content, newTime, senderProfileUrl, senderUsername) => {
        const incoming = {
          senderId,
          text: content,
          dateTime: newTime,
          senderProfileImageUrl: senderProfileUrl,
          senderUsername,
        };
        setMessagesToDisplay((prev) => [...(prev ?? []), incoming]);
      };
      const handleRefetch = async () => { try { await refetch(); } catch (e) { console.error(e); } };
      register_ReceiveMessage(handleReceiveMessage);
      register_ReceiveMessageRefetch(handleRefetch);
      return () => {
        unregister_ReceiveMessage(handleReceiveMessage);
        unregister_ReceiveMessageRefetch(handleRefetch);
      };
    }, [refetch])
  );

  useFocusEffect(
    useCallback(() => {
      const handleReconnecting = () => showToast("Connection lost - Reconnecting...");
      const handleReconnected = () => { setToastVisible(false); showToast("Reconnected"); };
      register_OnReconnecting(handleReconnecting);
      register_OnReconnected(handleReconnected);
      return () => {
        setToastVisible(false);
        unregister_OnReconnecting(handleReconnecting);
        unregister_OnReconnected(handleReconnected);
      };
    }, [])
  );

  const handleSend = async () => {
    if (!message.trim()) return;
    const now = Date.now();
    sendTimestampsRef.current = sendTimestampsRef.current.filter((t) => now - t < 5000);
    if (sendTimestampsRef.current.length >= 5) return;
    sendTimestampsRef.current.push(now);

    scrollViewRef.current?.scrollToEnd({ animated: true });

    const optimistic = {
      senderId: currentUserId,
      receiverId: conversationUserId,
      text: message,
      dateTime: new Date().toISOString(),
    };
    setMessagesToDisplay((prev) => [...(prev ?? []), optimistic]);
    const saved = message;
    setMessage("");
    Keyboard.dismiss();

    try {
      if (!isHubReady()) { setMessage(saved); return; }
      await invokeHub("SendMessage", currentUserId, conversationUserId, saved);
    } catch {
      setMessagesToDisplay((prev) => prev.filter((m) => m !== optimistic));
      setMessage(saved);
      showToast("Message not sent - Please check your connection.");
    }
  };

  return (
    <View style={{ backgroundColor: "orange" }}>
      <View style={[styles.mainContainer, { height: keyboardHeight > 0 ? containerHeight - keyboardHeight + tabBarHeight : containerHeight }]}>
        {/* // HEADER // */}
        <TouchableOpacity
          style={styles.headerStyle}
          onPress={() => navigation.navigate("Messages", {
            screen: "ProfileScreenPublic",
            params: { publicId, userName: name, userId: conversationUserId },
          })}
        >
          <Image source={{ uri: profileImg }} style={styles.profileImage} />
          <Text style={styles.nameStyle} numberOfLines={1}>{name} {">"}</Text>
        </TouchableOpacity>
        {/* // HEADER // */}


        {/* // MESSAGES // */}
        <View style={styles.messagesWrapper}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesList}
            contentContainerStyle={{ paddingBottom: vh(2) }}
            keyboardShouldPersistTaps="handled"
          >
            {messagesToDisplay?.map((msg, index) => {
              const isMe = msg.senderId === currentUserId;
              const [time, date] = formatDate(msg.dateTime);
              const prevMsg = messagesToDisplay[index - 1];
              const prevDate = prevMsg ? formatDate(prevMsg.dateTime)[1] : null;
              const showDateSeparator = date !== prevDate;
              const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId || showDateSeparator;
              return (
                <View key={index}>
                  {showDateSeparator && (
                    <View style={styles.dateSeparator}>
                      <Text style={styles.dateSeparatorText}>{date}</Text>
                    </View>
                  )}
                  {isMe ? (
                    <View style={styles.msgRight}>
                      <Text style={styles.msgText}>{msg.text}</Text>
                      <Text style={styles.timeDisplay}>{time}</Text>
                    </View>
                  ) : (
                    <View style={styles.msgRowLeft}>
                      {isFirstInGroup ? (
                        <TouchableOpacity onPress={() => navigation.navigate("Messages", { screen: "ProfileScreenPublic", params: { publicId: msg.senderPublicId, userName: msg.senderUsername, userId: msg.senderId } })}>
                          <Image
                            source={{ uri: msg.senderProfileThumbnailUrl || msg.senderProfileImageUrl }}
                            style={styles.msgAvatar}
                          />
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.msgAvatarPlaceholder} />
                      )}
                      <View style={[styles.msgColumn, isFirstInGroup && { marginTop: vh(1) }]}>
                        {isFirstInGroup && <Text style={styles.msgSender}>{msg.senderUsername}</Text>}
                        <View style={styles.msgLeft}>
                          <Text selectable style={styles.msgText}>{msg.text}</Text>
                          <Text style={styles.timeDisplay}>{time}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
        {/* // MESSAGES // */}

        <View style={[styles.sendRow, { paddingBottom: insets.bottom }]}>
          <TextInput
            onChangeText={(text) => setMessage(text)}
            style={styles.textinputStyle}
            multiline
            placeholder={`Message ${name}...`}
            placeholderTextColor={parrotPlaceholderGrey}
            value={message}
            maxLength={500}
          />
          <TouchableOpacity
            disabled={!message.trim()}
            onPress={handleSend}
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
};

const styles = StyleSheet.create({
  headerStyle: {
    height: vh(8),
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: vh(2),
    gap: vw(3),
    backgroundColor: "white",
  },
  profileImage: {
    width: vh(5),
    height: vh(5),
    borderRadius: vh(2.5),
  },
  mainContainer: {
    flexDirection: "column",
    backgroundColor: "white",
    // paddingHorizontal: vh(2),
  },
  messagesWrapper: {
    flex: 1,
    backgroundColor: "white",
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: vw(3),
    paddingTop: vh(1),
  },
  msgLeft: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 119, 234, 0.04)",
    borderRadius: vh(4),
    maxWidth: vw(70),
    paddingVertical: vh(0.5),
    paddingHorizontal: vw(3),
    gap: vw(2),
    marginTop: vh(0.4),
  },
  msgRight: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: vh(0.5),
    marginHorizontal: vw(2),
    backgroundColor: "rgba(0, 119, 234, 0.04)",
    borderRadius: vh(4),
    maxWidth: vw(80),
    alignSelf: "flex-end",
    paddingVertical: vh(0.5),
    paddingHorizontal: vw(3),
    gap: vw(2),
  },
  msgRowLeft: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginTop: vh(0.5),
    marginHorizontal: vw(2),
    gap: vw(2),
    maxWidth: vw(85),
  },
  msgAvatar: {
    width: vw(8),
    height: vw(8),
    borderRadius: vw(4),
    marginTop: vh(2),
    flexShrink: 0,
  },
  msgAvatarPlaceholder: {
    width: vw(8),
    flexShrink: 0,
  },
  msgColumn: {
    flexDirection: "column",
    flexShrink: 1,
  },
  msgSender: {
    fontFamily: "Nunito_700Bold",
    color: parrotLightBlue,
    fontSize: 12,
    marginBottom: -vh(0.1),
    marginLeft: vw(3),
  },
  msgText: { flexShrink: 1, fontFamily: "Nunito_700Bold", color: "#333", fontSize: 14, marginRight: vw(2) },
  timeDisplay: {
    fontFamily: "Nunito_700Bold",
    color: "rgba(0, 119, 234, 0.5)",
    fontSize: 11,
    flexShrink: 0,
  },
  dateSeparator: {
    alignSelf: "center",
    backgroundColor: "rgba(0, 119, 234, 0.04)",
    borderRadius: vh(2),
    paddingHorizontal: vw(3),
    paddingVertical: vh(0.4),
    marginVertical: vh(1),
  },
  dateSeparatorText: {
    fontFamily: "Nunito_700Bold",
    color: "rgba(0, 119, 234, 0.5)",
    fontSize: 12,
  },
  textinputStyle: {
    flex: 1,
    backgroundColor: "white",
    minHeight: vh(5),
    maxHeight: vh(14),
    paddingHorizontal: vw(4),
    paddingTop: Platform.OS === "ios" ? vh(1.5) : vh(1),
    paddingBottom: Platform.OS === "ios" ? vh(1.5) : vh(1),
    borderRadius: vh(4),
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: "black",
    textAlignVertical: "center",
  },
  sendRow: {
    zIndex: 200,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: vw(3),
    marginHorizontal: -vh(0),
    paddingVertical: vh(1),
    backgroundColor: parrotLightCream,
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
    flex: 1,
    fontFamily: "Nunito_800ExtraBold",
    color: parrotLightBlue,
    fontSize: 18,
  },
  toast: {
    position: "absolute",
    bottom: vh(2),
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
