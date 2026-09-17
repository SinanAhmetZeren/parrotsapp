import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { markMessagesRead } from "../slices/UserSlice";
import ConversationView from "./CoversationView";
import { vh, vw } from "react-native-expo-viewport-units";
import { Ionicons } from "@expo/vector-icons";

const GROUP_COLORS = ["#a020a0", "#6a0dad", "#1e88e5", "#29b6f6", "#00bfa5", "#ffa726", "#e53935"];

function groupInitials(name) {
  return (name || "")
    .split(" ")
    .filter((w) => w)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "G";
}

function groupColor(groupId) {
  return GROUP_COLORS[(groupId ?? 0) % GROUP_COLORS.length];
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return [`${hours}:${minutes}`, `${day}/${month}/${year}`];
}

function GroupPreviewView({ item, onOpenGroup }) {
  const unreadCount = item.unreadCount ?? 0;
  const hasUnread = unreadCount > 0;
  const color = groupColor(item.groupConversationId);
  const initials = groupInitials(item.groupName);
  const [timeStr, dateStr] = formatDate(item.dateTime);

  return (
    <TouchableOpacity
      style={[styles.row, hasUnread && styles.rowUnread]}
      onPress={() => onOpenGroup(item.groupConversationId, item.groupName)}
      activeOpacity={0.8}
    >
      <View style={styles.avatarWrap}>
        <View style={[styles.initialsCircle, { backgroundColor: color }]}>
          <ParrotsStdText style={styles.initialsText}>{initials}</ParrotsStdText>
        </View>
        <View style={styles.groupBadge}>
          <Ionicons name="people" size={9} color="#5C6B7A" />
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.top}>
          <ParrotsStdText style={styles.name} numberOfLines={1}>{item.groupName}</ParrotsStdText>
          <ParrotsStdText style={styles.time}>{timeStr}</ParrotsStdText>
        </View>
        <View style={styles.bottom}>
          <ParrotsStdText style={styles.preview} numberOfLines={1} ellipsizeMode="tail">
            {item.text ? `${item.senderUsername}: ${item.text}` : "No messages yet"}
          </ParrotsStdText>
          {hasUnread
            ? <View style={styles.dot} />
            : <ParrotsStdText style={styles.date}>{dateStr}</ParrotsStdText>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ConversationList({ data, userId, onOpenGroup }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const items = [];
  if (data) {
    data.forEach((message) => {
      if (message.groupConversationId) {
        items.push({ ...message, _type: "group" });
      } else {
        const isSender = message.senderId === userId;
        items.push({
          _type: "dm",
          user: isSender ? message.receiverId : message.senderId,
          userName: isSender ? message.receiverUsername : message.senderUsername,
          userProfileImage: isSender
            ? message.receiverProfileThumbnailUrl || message.receiverProfileUrl
            : message.senderProfileThumbnailUrl || message.senderProfileUrl,
          text: message.text,
          dateTime: message.dateTime,
          publicId: isSender ? message.receiverPublicId : message.senderPublicId,
          unreadCount: message.unreadCount ?? 0,
        });
      }
    });
  }

  const sorted = [...items].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
  const totalUnreadItems = sorted.filter((i) => (i.unreadCount ?? 0) > 0).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        Platform.OS === "ios" && { paddingBottom: insets.bottom + (vh(100) - insets.top - insets.bottom) * 0.08 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {sorted.map((item, index) =>
        item._type === "group" ? (
          <GroupPreviewView
            key={`group-${item.groupConversationId}`}
            item={item}
            onOpenGroup={onOpenGroup}
          />
        ) : (
          <ConversationView
            key={`dm-${item.user}-${index}`}
            profileImg={item.userProfileImage}
            name={item.userName}
            userId={item.user}
            message={item.text}
            time={item.dateTime}
            publicId={item.publicId}
            unreadCount={item.unreadCount ?? 0}
            isLastUnread={(item.unreadCount ?? 0) > 0 && totalUnreadItems === 1}
            onRead={() => dispatch(markMessagesRead())}
          />
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    gap: 7,
    paddingBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E8E3DC",
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  rowUnread: {
    backgroundColor: "#EAF2FD",
    borderColor: "rgba(10,119,234,0.3)",
  },
  avatarWrap: {
    position: "relative",
    flexShrink: 0,
  },
  initialsCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    color: "white",
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 15,
  },
  groupBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E8E3DC",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  top: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    minWidth: 0,
  },
  bottom: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    minWidth: 0,
  },
  name: {
    flex: 1,
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14.5,
    color: "#0A5FBF",
    letterSpacing: -0.1,
  },
  time: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11,
    color: "#5C6B7A",
    flexShrink: 0,
  },
  preview: {
    flex: 1,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12.5,
    color: "#4A5A6A",
  },
  date: {
    fontFamily: "Nunito_700Bold",
    fontSize: 10.5,
    color: "#98A5B2",
    flexShrink: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0A77EA",
    flexShrink: 0,
    alignSelf: "center",
  },
});
