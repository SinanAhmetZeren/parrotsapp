/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View } from "react-native";
import ConversationView from "./CoversationView";

export default function ConversationList({ data }) {
  // console.log(data[0]);

  const renderConversationViews = () => {
    const sortedData = [...data].sort((a, b) => {
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
    marginBottom: 50,
  },
});
