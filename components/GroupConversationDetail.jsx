/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet,
  ScrollView, Modal, Keyboard,
} from "react-native";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { vh, vw } from "react-native-expo-viewport-units";
import { Feather } from "@expo/vector-icons";
import {
  useGetGroupMessagesQuery,
  useGetGroupByIdQuery,
  useAddGroupMemberMutation,
  useRemoveGroupMemberMutation,
  useExitGroupMutation,
} from "../slices/GroupSlice";
import { useGetUsersByUsernameQuery } from "../slices/UserSlice";
import {
  invokeHub, isHubReady,
  register_ReceiveGroupMessageRefetch, unregister_ReceiveGroupMessageRefetch,
  register_OnReconnecting, unregister_OnReconnecting,
  register_OnReconnected, unregister_OnReconnected,
} from "../signalr/signalRHub";
import {
  parrotBlue, parrotCream, parrotLightBlue, parrotBlueSemiTransparent,
  parrotBlueDarkTransparent, parrotBlueDarkTransparent2, parrotPlaceholderGrey, parrotRed,
} from "../assets/color";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);
  return [`${hours}:${minutes}`, `${day}-${month}-${year}`];
};

export default function GroupConversationDetail({ route, navigation }) {
  console.log("entered GroupConversationDetail");
  const { groupId, groupName } = route.params;
  const currentUserId = useSelector((state) => state.users.userId);

  const [message, setMessage] = useState("");
  const [messagesToDisplay, setMessagesToDisplay] = useState([]);
  const [membersDropdownVisible, setMembersDropdownVisible] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberQuery, setMemberQuery] = useState("");
  const [members, setMembers] = useState([]);
  const [textInputBottomMargin, setTextInputBottomMargin] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMsg] = useState("");
  const scrollViewRef = useRef();
  const sendTimestampsRef = useRef([]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const { data: groupData } = useGetGroupByIdQuery(
    { groupId, userId: currentUserId },
    { skip: !groupId || !currentUserId, refetchOnMountOrArgChange: true }
  );

  const { data: groupMessagesData, refetch: refetchMessages } = useGetGroupMessagesQuery(
    { groupId, userId: currentUserId },
    { skip: !groupId || !currentUserId }
  );

  const { data: searchResults } = useGetUsersByUsernameQuery(memberQuery, {
    skip: memberQuery.length < 3,
  });

  const [addMember] = useAddGroupMemberMutation();
  const [removeMember] = useRemoveGroupMemberMutation();
  const [exitGroup] = useExitGroupMutation();

  const isCreator = (groupData?.CreatorId ?? groupData?.creatorId) === currentUserId;
  const memberUserIds = members.map((m) => m.userId);

  useEffect(() => {
    if (groupMessagesData) setMessagesToDisplay(groupMessagesData);
  }, [groupMessagesData]);

  useEffect(() => {
    const m = groupData?.Members ?? groupData?.members;
    if (m) setMembers(m);
  }, [groupData]);

  useEffect(() => {
    if (scrollViewRef.current && messagesToDisplay?.length > 0) {
      requestAnimationFrame(() => scrollViewRef.current?.scrollToEnd({ animated: true }));
    }
  }, [messagesToDisplay]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => setTextInputBottomMargin(e.endCoordinates.height));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setTextInputBottomMargin(0));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  useEffect(() => {
    if (!groupId) return;
    const handler = (incomingGroupId) => {
      if (incomingGroupId === groupId) refetchMessages();
    };
    register_ReceiveGroupMessageRefetch(handler);
    return () => unregister_ReceiveGroupMessageRefetch(handler);
  }, [groupId, refetchMessages]);

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
      senderUsername: "You",
      text: message,
      dateTime: new Date().toISOString(),
    };
    setMessagesToDisplay((prev) => [...(prev ?? []), optimistic]);
    const saved = message;
    setMessage("");
    Keyboard.dismiss();

    try {
      if (!isHubReady()) { setMessage(saved); return; }
      await invokeHub("SendGroupMessage", currentUserId, groupId, saved);
    } catch {
      setMessagesToDisplay((prev) => prev.filter((m) => m !== optimistic));
      setMessage(saved);
      showToast("Message not sent - Please check your connection.");
    }
  };

  const handleAddMember = async (userId) => {
    const result = await addMember({ groupId, userId, requesterId: currentUserId });
    const updated = result.data?.Members ?? result.data?.members;
    if (updated) setMembers(updated);
    setMemberSearch("");
    setMemberQuery("");
  };

  const handleRemoveMember = async (userId) => {
    const result = await removeMember({ groupId, userId, requesterId: currentUserId });
    const updated = result.data?.Members ?? result.data?.members;
    if (updated) setMembers(updated);
  };

  const handleExitGroup = async () => {
    await exitGroup({ groupId, userId: currentUserId });
    setMembersDropdownVisible(false);
    navigation.goBack();
  };

  const stackedAvatars = members.slice(0, 3);
  const extraCount = members.length > 3 ? members.length - 3 : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.groupAvatar}>
          <Text style={styles.groupAvatarText}>{groupName?.charAt(0)?.toUpperCase() ?? "G"}</Text>
        </View>
        <Text style={styles.headerTitle} numberOfLines={1}>{groupName}</Text>
        <TouchableOpacity onPress={() => setMembersDropdownVisible(v => !v)} style={styles.stackedAvatarsBtn}>
          {stackedAvatars.map((m, i) => (
            <Image
              key={m.userId}
              source={{ uri: m.profileImageThumbnailUrl || m.profileImageUrl }}
              style={[styles.stackedAvatar, { marginLeft: i === 0 ? 0 : -vw(3) }]}
            />
          ))}
          {extraCount > 0 && (
            <View style={[styles.stackedAvatar, styles.extraCountCircle, { marginLeft: -vw(3) }]}>
              <Text style={styles.extraCountText}>+{extraCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Members dropdown */}
      {membersDropdownVisible && (
        <View style={styles.dropdown}>
          {isCreator && (
            <View style={styles.addMemberRow}>
              <TextInput
                style={styles.addMemberInput}
                placeholder="Search by username..."
                placeholderTextColor={parrotPlaceholderGrey}
                value={memberSearch}
                onChangeText={setMemberSearch}
                onSubmitEditing={() => memberSearch.length >= 3 && setMemberQuery(memberSearch)}
              />
              <TouchableOpacity
                style={[styles.searchBtn, memberSearch.length < 3 && styles.searchBtnDisabled]}
                onPress={() => memberSearch.length >= 3 && setMemberQuery(memberSearch)}
                disabled={memberSearch.length < 3}
              >
                <Text style={styles.searchBtnText}>Search</Text>
              </TouchableOpacity>
            </View>
          )}

          {searchResults?.filter((u) => !memberUserIds.includes(u.id ?? u.Id)).map((u) => (
            <View key={u.id ?? u.Id} style={styles.memberRow}>
              <Image source={{ uri: u.profileImageThumbnailUrl || u.profileImageUrl }} style={styles.memberAvatar} />
              <Text style={styles.memberName}>{u.userName}</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => handleAddMember(u.id ?? u.Id)}>
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          ))}

          <ScrollView style={styles.memberList} nestedScrollEnabled>
            {members.map((m) => (
              <View key={m.userId} style={styles.memberRow}>
                <Image source={{ uri: m.profileImageThumbnailUrl || m.profileImageUrl }} style={styles.memberAvatar} />
                <Text style={styles.memberName}>{m.username}</Text>
                {isCreator && m.userId !== currentUserId && (
                  <TouchableOpacity onPress={() => handleRemoveMember(m.userId)}>
                    <Feather name="x" size={18} color={parrotRed} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>

          {!isCreator && (
            <TouchableOpacity style={styles.leaveBtn} onPress={handleExitGroup}>
              <Text style={styles.leaveBtnText}>Leave Group</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesList}
        contentContainerStyle={{ paddingBottom: vh(2) }}
      >
        {messagesToDisplay?.map((msg, index) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <View key={index} style={isMe ? styles.msgRight : styles.msgLeft}>
              <Text style={styles.msgSender}>{isMe ? "You" : msg.senderUsername}</Text>
              <View style={styles.msgBox}>
                <Text style={styles.msgText}>{msg.text}</Text>
              </View>
              <View style={styles.dateBox}>
                <Text style={styles.timeDisplay}>{formatDate(msg.dateTime)[0]}{"  "}</Text>
                <Text style={styles.dateDisplay}>{formatDate(msg.dateTime)[1]}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Send box */}
      <View style={[styles.sendRow, { marginBottom: textInputBottomMargin }]}>
        <TextInput
          onChangeText={setMessage}
          style={styles.textInput}
          multiline
          placeholder="Write a message"
          placeholderTextColor={parrotPlaceholderGrey}
          value={message}
          maxLength={500}
        />
        <TouchableOpacity disabled={!message} onPress={handleSend}>
          <View style={message ? styles.sendBtn : styles.sendBtnDisabled}>
            <Feather name="send" size={22} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {toastVisible && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: vw(4),
    paddingVertical: vh(1.5),
    borderBottomWidth: 1,
    borderBottomColor: "#e8f0f8",
  },
  groupAvatar: {
    width: vw(9),
    height: vw(9),
    borderRadius: vw(4.5),
    backgroundColor: parrotLightBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: vw(3),
  },
  groupAvatarText: {
    color: "white",
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
  },
  stackedAvatarsBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: vw(3),
  },
  stackedAvatar: {
    width: vw(9),
    height: vw(9),
    borderRadius: vw(4.5),
    borderWidth: 2,
    borderColor: "white",
  },
  extraCountCircle: {
    backgroundColor: parrotLightBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  extraCountText: {
    color: "white",
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
  },
  dropdown: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e8f0f8",
    paddingHorizontal: vw(4),
    paddingVertical: vh(1.5),
    maxHeight: vh(45),
    zIndex: 10,
  },
  headerTitle: {
    flex: 1,
    fontFamily: "Nunito_800ExtraBold",
    color: parrotLightBlue,
    fontSize: 18,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: vw(3),
    paddingTop: vh(1),
  },
  msgLeft: {
    marginTop: vh(1),
    backgroundColor: parrotCream,
    borderRadius: vh(4),
    width: vw(80),
    paddingBottom: vh(0.5),
  },
  msgRight: {
    marginTop: vh(1),
    paddingHorizontal: vh(1),
    backgroundColor: parrotCream,
    borderRadius: vh(4),
    width: vw(80),
    alignSelf: "flex-end",
    paddingBottom: vh(0.5),
  },
  msgSender: {
    fontFamily: "Nunito_700Bold",
    color: parrotLightBlue,
    paddingLeft: vw(4),
    paddingTop: vh(0.5),
  },
  msgBox: { paddingHorizontal: vw(4) },
  msgText: { fontFamily: "Nunito_700Bold", color: "#333" },
  dateBox: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginTop: vh(0.3),
    marginRight: vw(3),
  },
  timeDisplay: {
    fontFamily: "Nunito_700Bold",
    color: parrotBlueDarkTransparent2,
    fontSize: 11,
  },
  dateDisplay: {
    fontFamily: "Nunito_700Bold",
    color: parrotBlueDarkTransparent,
    fontSize: 11,
  },
  sendRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: vh(1),
    borderTopWidth: 1,
    borderTopColor: "#e8f0f8",
    gap: vw(2),
  },
  textInput: {
    flex: 1,
    backgroundColor: parrotCream,
    minHeight: vh(4.5),
    maxHeight: vh(12),
    paddingLeft: vh(1.5),
    paddingVertical: vh(0.5),
    borderRadius: vh(2),
    fontFamily: "Nunito_700Bold",
  },
  sendBtn: {
    backgroundColor: parrotLightBlue,
    padding: vh(1),
    borderRadius: vh(3),
  },
  sendBtnDisabled: {
    backgroundColor: parrotBlueSemiTransparent,
    padding: vh(1),
    borderRadius: vh(3),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: vh(3),
    borderTopRightRadius: vh(3),
    padding: vh(2.5),
    maxHeight: vh(70),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vh(1.5),
  },
  modalTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: parrotLightBlue,
  },
  addMemberRow: {
    flexDirection: "row",
    gap: vw(2),
    marginBottom: vh(1),
  },
  addMemberInput: {
    flex: 1,
    backgroundColor: parrotCream,
    borderRadius: vh(2),
    paddingHorizontal: vw(3),
    paddingVertical: vh(0.8),
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
  },
  searchBtn: {
    backgroundColor: parrotBlue,
    borderRadius: vh(2),
    paddingHorizontal: vw(3),
    justifyContent: "center",
  },
  searchBtnDisabled: { opacity: 0.4 },
  searchBtnText: { color: "white", fontFamily: "Nunito_700Bold", fontSize: 14 },
  memberList: { marginTop: vh(1), maxHeight: vh(30) },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vh(0.8),
    gap: vw(3),
  },
  memberAvatar: { width: vw(10), height: vw(10), borderRadius: vw(5) },
  memberName: {
    flex: 1,
    fontFamily: "Nunito_700Bold",
    color: parrotLightBlue,
    fontSize: 15,
  },
  addBtn: {
    backgroundColor: parrotBlue,
    borderRadius: vh(2),
    paddingHorizontal: vw(3),
    paddingVertical: vh(0.5),
  },
  addBtnText: { color: "white", fontFamily: "Nunito_700Bold", fontSize: 13 },
  leaveBtn: {
    backgroundColor: parrotRed,
    borderRadius: vh(2),
    padding: vh(1.5),
    alignItems: "center",
    marginTop: vh(2),
  },
  leaveBtnText: { color: "white", fontFamily: "Nunito_700Bold", fontSize: 16 },
  toast: {
    position: "absolute",
    bottom: vh(2),
    alignSelf: "center",
    backgroundColor: "rgba(30, 111, 217, 0.9)",
    paddingHorizontal: vw(4),
    paddingVertical: vh(1),
    borderRadius: 20,
  },
  toastText: { fontFamily: "Nunito_700Bold", color: "white", fontSize: 13 },
});
