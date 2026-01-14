/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ConversationView from "./CoversationView";
import { vh, vw } from "react-native-expo-viewport-units";
import { Shadow } from "react-native-shadow-2";

export default function ConversationList({ data, userId }) {
  let transformedMessages = [];
  if (data) {
    transformedMessages = data.map((message) => {
      const user =
        message.senderId !== userId ? message.senderId : message.receiverId;
      const userProfileImage =
        message.senderId !== userId
          ? message.senderProfileUrl
          : message.receiverProfileUrl;
      const userName =
        message.senderId !== userId
          ? message.senderUsername
          : message.receiverUsername;
      const text = message.text;
      const dateTime = message.dateTime;
      const publicId =
        message.senderId !== userId
          ? message.senderPublicId
          : message.receiverPublicId;
      return { user, userName, userProfileImage, text, dateTime, publicId };
    });
  } else {
    console.log("Data is null.");
  }

  const renderConversationViews = () => {
    const sortedData = [...transformedMessages].sort((a, b) => {
      return new Date(b.dateTime) - new Date(a.dateTime);
    });
    console.log("---");
    console.log(sortedData[0]);
    return sortedData.map((item, index) => (
      <Shadow
        distance={7}
        offset={[0, 0]}
        startColor="rgba(0,0,0,0.08)"
        finalColor="rgba(0,0,0,0.23)"
        radius={12}
        style={{ borderRadius: vh(3), marginBottom: vh(1.5) }}
        key={`${item.id}-${item.userName}`}
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
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {renderConversationViews()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: vw(0.5),
    backgroundColor: "white",
    height: vh(85),
    paddingTop: vh(1)
  },
});
