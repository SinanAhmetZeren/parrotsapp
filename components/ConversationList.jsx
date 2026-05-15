/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import ConversationView from "./CoversationView";
import { vh, vw } from "react-native-expo-viewport-units";
import { Shadow } from "react-native-shadow-2";
import { parrotLightBlue, parrotPlaceholderGrey, parrotBlueDarkTransparent2, parrotBlueDarkTransparent } from "../assets/color";

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
  const idx = (groupId ?? 0) % GROUP_COLORS.length;
  return GROUP_COLORS[idx];
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
  const color = groupColor(item.groupConversationId);
  const initials = groupInitials(item.groupName);
  const [time, date] = formatDate(item.dateTime);

  return (
    <TouchableOpacity
      style={styles.mainContainer}
      onPress={() => onOpenGroup(item.groupConversationId, item.groupName)}
    >
      <View style={[styles.initialsCircle, { backgroundColor: color }]}>
        <Text style={styles.initialsText}>{initials}</Text>
      </View>
      <View style={styles.nameAndMessage}>
        <Text style={styles.name}>{item.groupName}</Text>
        <Text style={styles.message} numberOfLines={1} ellipsizeMode="tail">
          {item.text ? `${item.senderUsername}: ${item.text}` : "No messages yet"}
        </Text>
      </View>
      <View style={styles.time}>
        <Text style={styles.timeText1}>{time}</Text>
        <Text style={styles.timeText2}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ConversationList({ data, userId, onOpenGroup }) {
  const items = [];

  if (data) {
    data.forEach((message) => {
      if (message.groupConversationId) {
        items.push({ ...message, _type: "group" });
      } else {
        const user = message.senderId !== userId ? message.senderId : message.receiverId;
        const userProfileImage =
          message.senderId !== userId
            ? message.senderProfileThumbnailUrl || message.senderProfileUrl
            : message.receiverProfileThumbnailUrl || message.receiverProfileUrl;
        const userName =
          message.senderId !== userId ? message.senderUsername : message.receiverUsername;
        const publicId =
          message.senderId !== userId ? message.senderPublicId : message.receiverPublicId;
        items.push({
          _type: "dm",
          user,
          userName,
          userProfileImage,
          text: message.text,
          dateTime: message.dateTime,
          publicId,
        });
      }
    });
  }

  const sorted = [...items].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  return (
    <ScrollView style={styles.container}>
      {sorted.map((item, index) =>
        item._type === "group" ? (
          <Shadow
            key={`group-${item.groupConversationId}`}
            distance={8}
            offset={[0, 0]}
            startColor="rgba(0,0,0,0.08)"
            finalColor="rgba(0,0,0,0.13)"
            style={{ borderRadius: vh(3), marginBottom: vh(2) }}
          >
            <GroupPreviewView item={item} onOpenGroup={onOpenGroup} />
          </Shadow>
        ) : (
          <Shadow
            key={`dm-${item.user}-${index}`}
            distance={8}
            offset={[0, 0]}
            startColor="rgba(0,0,0,0.08)"
            finalColor="rgba(0,0,0,0.13)"
            style={{ borderRadius: vh(3), marginBottom: vh(2) }}
          >
            <ConversationView
              profileImg={item.userProfileImage}
              name={item.userName}
              userId={item.user}
              message={item.text}
              time={item.dateTime}
              publicId={item.publicId}
            />
          </Shadow>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: vw(2),
    backgroundColor: "white",
    height: vh(85),
    paddingTop: vh(1),
  },
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: vw(2),
    paddingRight: vw(4),
    paddingVertical: vh(0.6),
    backgroundColor: "white",
    borderRadius: vh(6),
    width: vw(90),
  },
  initialsCircle: {
    width: vw(11),
    height: vw(11),
    borderRadius: vw(6),
    alignItems: "center",
    justifyContent: "center",
    marginRight: vw(2),
    flexShrink: 0,
  },
  initialsText: {
    color: "white",
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 15,
  },
  nameAndMessage: {
    flex: 1,
  },
  name: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: parrotLightBlue,
    marginBottom: vh(0.4),
  },
  message: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: parrotPlaceholderGrey,
  },
  time: {
    alignItems: "flex-end",
    justifyContent: "center",
    paddingLeft: vw(2),
  },
  timeText1: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: parrotBlueDarkTransparent2,
    marginBottom: vh(0.5),
  },
  timeText2: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: parrotBlueDarkTransparent,
  },
});
