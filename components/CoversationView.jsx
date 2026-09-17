import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */

import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return [`${hours}:${minutes}`, `${day}/${month}/${year}`];
}

export default function CoversationView({
  profileImg,
  name,
  message,
  time,
  userId,
  publicId,
  unreadCount = 0,
  isLastUnread = false,
  onRead,
}) {
  const navigation = useNavigation();
  const hasUnread = unreadCount > 0;
  const [timeStr, dateStr] = formatDate(time);

  const handleNavigate = () => {
    if (isLastUnread && onRead) onRead();
    navigation.navigate("ConversationDetailScreen", { conversationUserId: userId, profileImg, name, publicId });
  };

  const preview = message?.startsWith("**🦜**")
    ? "Ask Parrots: " + message.replace(/^\*\*🦜\*\*\s*/, "")
    : message?.startsWith("[parrots-bid]")
    ? "Parrots: " + message.replace(/^\[parrots-bid\]\s*/, "")
    : message;

  return (
    <TouchableOpacity
      style={[styles.row, hasUnread && styles.rowUnread]}
      onPress={handleNavigate}
      activeOpacity={0.8}
    >
      <Image style={styles.avatar} resizeMode="cover" source={{ uri: profileImg }} />
      <View style={styles.body}>
        <View style={styles.top}>
          <ParrotsStdText style={styles.name} numberOfLines={1}>{name}</ParrotsStdText>
          <ParrotsStdText style={styles.time}>{timeStr}</ParrotsStdText>
        </View>
        <View style={styles.bottom}>
          <ParrotsStdText style={styles.preview} numberOfLines={1} ellipsizeMode="tail">{preview}</ParrotsStdText>
          {hasUnread
            ? <View style={styles.dot} />
            : <ParrotsStdText style={styles.date}>{dateStr}</ParrotsStdText>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    flexShrink: 0,
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
