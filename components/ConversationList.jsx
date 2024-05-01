/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View } from "react-native";
import ConversationView from "./CoversationView";

export default function ConversationList({ data, userId }) {
  // console.log(data[0]);
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
      return { user, userName, userProfileImage, text, dateTime };
    });
  } else {
    console.log("Data is null."); // or handle this case as needed
  }

  /*
  const transformedMessages = data.map((message) => {
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
    return { user, userName, userProfileImage, text, dateTime };
  });
*/

  const renderConversationViews = () => {
    const sortedData = [...transformedMessages].sort((a, b) => {
      return new Date(b.dateTime) - new Date(a.dateTime);
    });

    return sortedData.map((item, index) => (
      <ConversationView
        key={index}
        profileImg={item.userProfileImage}
        name={item.userName}
        userId={item.user}
        message={item.text}
        time={item.dateTime}
        count={33}
      />
    ));
  };

  return <View style={styles.container}>{renderConversationViews()}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
});
