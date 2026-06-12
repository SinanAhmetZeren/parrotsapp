import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View,  ScrollView, Image } from "react-native";
import { useRef, useEffect } from "react";
import { vh, vw } from "react-native-expo-viewport-units";
import { API_URL } from "@env";
import { parrotBlueDarkTransparent, parrotBlueDarkTransparent2, parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotCream, parrotInputTextColor, parrotLightBlue } from "../assets/color";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return [`${hours}:${minutes}`, `${day}/${month}/${year}`];
};

export default function MessagesComponent({
  data,
  userName,
  userProfileImage,
  otherUserProfileImg,
  otherUserName,
  currentUserId,
  scrollViewRef,
}) {
  const renderMessages = () => {
    if (data && Array.isArray(data) && data.length > 0) {
      let lastDate = null;
      return data.map((item, index) => {
        const [time, date] = formatDate(item.dateTime);
        const showDateSeparator = date !== lastDate;
        lastDate = date;
        const isMe = item.senderId === currentUserId;
        return (
          <View key={index}>
            {showDateSeparator && (
              <View style={styles.dateSeparator}>
                <ParrotsStdText style={styles.dateSeparatorText}>{date}</ParrotsStdText>
              </View>
            )}
            {isMe ? (
              <View style={styles.MessageMainContainerRight}>
                <ParrotsStdText selectable style={styles.messageText}>{item.text}</ParrotsStdText>
                <ParrotsStdText style={styles.timeDisplay}>{time}</ParrotsStdText>
              </View>
            ) : (
              <View style={styles.MessageMainContainer}>
                <ParrotsStdText selectable style={styles.messageText}>{item.text}</ParrotsStdText>
                <ParrotsStdText style={styles.timeDisplay}>{time}</ParrotsStdText>
              </View>
            )}
          </View>
        );
      });
    }
    return null;
  };
  // const scrollViewRef = useRef();

  useEffect(() => {
    if (scrollViewRef.current && data && data.length > 0) {
      requestAnimationFrame(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      });
    }
  }, [
    scrollViewRef.current,
    data]);




  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      {renderMessages()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer1: {
    justifyContent: "center",
    marginRight: vw(2),
    marginLeft: vw(2),
  },
  MessageMainContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: vh(0.5),
    marginHorizontal: vw(2),
    backgroundColor: "rgba(0, 119, 234, 0.04)",
    borderRadius: vh(4),
    maxWidth: vw(80),
    alignSelf: "flex-start",
    paddingVertical: vh(0.5),
    paddingHorizontal: vw(3),
    gap: vw(2),
  },
  MessageMainContainerRight: {
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
  messageText: {
    flexShrink: 1,
    fontFamily: "Nunito_700Bold",
    color: "#333",
    fontSize: 14,
    marginRight: vw(2),
  },
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
  container: {
    backgroundColor: "white",
    marginBottom: vh(2),
  },
});
