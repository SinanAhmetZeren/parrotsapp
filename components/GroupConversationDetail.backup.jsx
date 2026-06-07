/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet,
  ScrollView, Modal, Keyboard, ActivityIndicator,
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
  parrotBlueDarkTransparent, parrotBlueDarkTransparent2, parrotPlaceholderGrey, parrotRed, parrotGreen,
  parrotBlueSemiTransparent2,
  parrotBlueSemiTransparent3,
} from "../assets/color";
import LoadingLogo from "./LoadingLogo";

const GROUP_COLORS = ["#a020a0", "#6a0dad", "#1e88e5", "#29b6f6", "#00bfa5", "#ffa726", "#e53935"];
const groupColor = (id) => GROUP_COLORS[(id ?? 0) % GROUP_COLORS.length];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return [`${hours}:${minutes}`, `${day}/${month}/${year}`];
};

export default function GroupConversationDetail({ route, navigation }) {
  const groupId = route?.params?.groupId;
  const groupName = route?.params?.groupName;
  console.log("entered GroupConversationDetail");
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
  const [addingUserId, setAddingUserId] = useState(null);
  const [addedUserId, setAddedUserId] = useState(null);
  const [removingUserId, setRemovingUserId] = useState(null);
  const [confirmLeave, setConfirmLeave] = useState(false);
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

  const { data: groupMessagesData, refetch: refetchMessages, isLoading: isLoadingMessages } = useGetGroupMessagesQuery(
    { groupId, userId: currentUserId },
    { skip: !groupId || !currentUserId, refetchOnMountOrArgChange: true }
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
      if (String(incomingGroupId) === String(groupId)) refetchMessages();
    };
    register_ReceiveGroupMessageRefetch(handler);
    return () => unregister_ReceiveGroupMessageRefetch(handler);
  }, [groupId, refetchMessages]);

  useFocusEffect(
    useCallback(() => {
      refetchMessages().then(result => {
        if (result.data) setMessagesToDisplay(result.data);
      });
      if (isHubReady()) invokeHub("EnterGroupConversationPage", currentUserId, String(groupId));
      return () => {
        if (isHubReady()) invokeHub("LeaveGroupConversationPage", currentUserId);
      };
    }, [refetchMessages, currentUserId, groupId])
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
    setAddingUserId(userId);
    const result = await addMember({ groupId, userId, requesterId: currentUserId });
    const updated = result.data?.Members ?? result.data?.members;
    setAddingUserId(null);
    setAddedUserId(userId);
    setTimeout(() => {
      if (updated) setMembers(updated);
      setMemberSearch("");
      setMemberQuery("");
      setAddedUserId(null);
    }, 2000);
  };

  const handleRemoveMember = async (userId) => {
    setRemovingUserId(userId);
    const result = await removeMember({ groupId, userId, requesterId: currentUserId });
    const updated = result.data?.Members ?? result.data?.members;
    if (updated) setMembers(updated);
    setRemovingUserId(null);
  };

  const handleExitGroup = async () => {
    await exitGroup({ groupId, userId: currentUserId });
    setMembersDropdownVisible(false);
    navigation.goBack();
  };

  const stackedAvatars = members.slice(0, 3);
  const extraCount = members.length > 3 ? members.length - 3 : 0;

  if (isLoadingMessages) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <LoadingLogo size={200} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.groupAvatar, { backgroundColor: groupColor(groupId) }]}>
          <Text style={styles.groupAvatarText}>{groupName?.split(" ").map(w => w.charAt(0).toUpperCase()).join("")}</Text>
        </View>
        <Text style={styles.headerTitle} numberOfLines={1}>{groupName}</Text>
        <TouchableOpacity onPress={() => { setMembersDropdownVisible(v => !v); setConfirmLeave(false); }} style={styles.stackedAvatarsBtn}>
          {stackedAvatars.map((m, i) => (
            <Image
              key={m.userId}
              source={{ uri: m.profileImageThumbnailUrl || m.profileImageUrl }}
              style={[styles.stackedAvatar, { marginLeft: i === 0 ? 0 : -vw(3) }]}
            />
          ))}
          {extraCount > 0 && (
            <View style={[styles.stackedAvatar, styles.extraCountCircle, { marginLeft: -vw(3), backgroundColor: groupColor(groupId) }]}>
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

          {searchResults?.filter((u) => !memberUserIds.includes(u.id ?? u.Id) || addedUserId === (u.id ?? u.Id)).map((u) => (
            <View key={u.id ?? u.Id} style={styles.memberRow}>
              <Image source={{ uri: u.profileImageThumbnailUrl || u.profileImageUrl }} style={styles.memberAvatar} />
              <Text style={styles.memberName}>{u.userName}</Text>
              <TouchableOpacity style={addedUserId === (u.id ?? u.Id) ? styles.addedBtn : styles.addBtn} disabled={!!addingUserId || !!addedUserId} onPress={() => handleAddMember(u.id ?? u.Id)}>
                {addingUserId === (u.id ?? u.Id)
                  ? <ActivityIndicator size={18} color={parrotBlue} />
                  : addedUserId === (u.id ?? u.Id)
                    ? <Feather name="check" size={18} color="#4caf50" />
                    : <Feather name="plus" size={18} color={parrotBlue} />}
              </TouchableOpacity>
            </View>
          ))}

          <ScrollView style={styles.memberList} nestedScrollEnabled>
            {members.map((m) => (
              <View key={m.userId} style={styles.memberRow}>
                <TouchableOpacity
                  style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: vw(3) }}
                  onPress={() => navigation.navigate("Messages", { screen: "ProfileScreenPublic", params: { publicId: m.publicId, userName: m.username, userId: m.userId } })}>
                  <Image source={{ uri: m.profileImageThumbnailUrl || m.profileImageUrl }} style={styles.memberAvatar} />
                  <Text style={styles.memberName}>{m.username} {">"}</Text>
                </TouchableOpacity>

                {isCreator && m.userId !== currentUserId && (
                  <TouchableOpacity
                    onPress={() => handleRemoveMember(m.userId)}
                    disabled={!!removingUserId}
                    style={styles.removeBtn}
                  >
                    {removingUserId === m.userId
                      ? <ActivityIndicator size={18} color={parrotRed} />
                      : <Feather name="x" size={18} color={parrotRed} />}
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>

          {!isCreator && (
            confirmLeave ? (
              <View style={styles.confirmLeaveRow}>
                <Text style={styles.confirmLeaveText}>Are you sure?</Text>
                <TouchableOpacity style={styles.noStayBtn} onPress={() => setConfirmLeave(false)}>
                  <Text style={styles.leaveBtnText}>No, Stay</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmLeaveBtn} onPress={handleExitGroup}>
                  <Text style={styles.leaveBtnText}>Yes, Leave</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.confirmLeaveRow}>
                <TouchableOpacity style={styles.leaveBtn} onPress={() => setConfirmLeave(true)}>
                  <Text style={styles.leaveBtnText}>Leave Group</Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>
      )}

      {/* Messages */}
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

      {/* Send box */}
      <View style={[styles.sendRow, { marginBottom: textInputBottomMargin || vh(8) }]}>
        <TextInput
          onChangeText={setMessage}
          style={styles.textInput}
          multiline
          placeholder={`Message ${groupName}...`}
          placeholderTextColor={parrotPlaceholderGrey}
          value={message}
          maxLength={500}
          returnKeyType="default"
        />
        <TouchableOpacity disabled={!message.trim()} onPress={handleSend} style={message.trim() ? styles.sendBtn : styles.sendBtnDisabled}>
          <Feather name="send" size={20} color="white" />
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
  sendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: vw(3),
    paddingVertical: vh(1),
    backgroundColor: parrotCream,
    gap: vw(2),
  },
  textInput: {
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
  removeBtn: {
    width: vw(8),
    height: vw(8),
    borderRadius: vw(4),
    backgroundColor: "rgba(220,50,50,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    width: vw(8),
    height: vw(8),
    borderRadius: vw(4),
    backgroundColor: "rgba(0,119,234,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  addedBtn: {
    width: vw(8),
    height: vw(8),
    borderRadius: vw(4),
    backgroundColor: "rgba(76,175,80,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  leaveBtn: {
    backgroundColor: "#F5A623",
    borderRadius: vh(2),
    paddingVertical: vh(0.8),
    paddingHorizontal: vw(6),
    alignItems: "center",
  },
  leaveBtnText: { color: "white", fontFamily: "Nunito_700Bold", fontSize: 13 },
  confirmLeaveRow: {
    flexDirection: "row",
    // backgroundColor: parrotCream,
    paddingVertical: vh(1),
    paddingHorizontal: vw(4),
    borderRadius: vh(2),
    alignItems: "center", justifyContent: "center", gap: vw(3), marginTop: vh(1.5)
  },
  confirmLeaveText: { fontFamily: "Nunito_700Bold", fontSize: 13, color: parrotLightBlue },
  confirmLeaveBtn: { backgroundColor: parrotRed, borderRadius: vh(2), paddingVertical: vh(0.8), paddingHorizontal: vw(4), alignItems: "center" },
  noStayBtn: { backgroundColor: parrotLightBlue, borderRadius: vh(2), paddingVertical: vh(0.8), paddingHorizontal: vw(4), alignItems: "center" },
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
