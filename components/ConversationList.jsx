/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View } from "react-native";
import ConversationView from "./CoversationView";

export default function ConversationList({ data }) {
  console.log(data);
  const data1 = [
    {
      id: 1,
      profileImg: require("../assets/parrot-looks.jpg"),
      name: "Coco Whistletail",
      message: "Chirping my way through the day! 🦜",
      time: "17:44",
      count: 42,
    },
    {
      id: 2,
      profileImg: require("../assets/parrot-looks2.jpg"),
      name: "Rainbow Sparklebeak",
      message: "Feathers up for a fantastic day! 🌞",
      time: "17:44",
      count: 63,
    },
    {
      id: 3,
      profileImg: require("../assets/parrot-looks3.jpg"),
      name: "Jazz Melodywing",
      message: "Spreading colors in the sky! 🌈",
      time: "11:14",
      count: 28,
    },
    {
      id: 4,
      profileImg: require("../assets/parrot-looks4.jpg"),
      name: "Emerald Echofeather",
      message: "Soaring high above the clouds! ☁️",
      time: "07:46",
      count: 87,
    },
    {
      id: 5,
      profileImg: require("../assets/parrot-looks5.jpg"),
      name: "Zazu Wingwhisper",
      message: "Wondering where the wind takes me! 💨",
      time: "13:19",
      count: 10,
    },
  ];

  const renderConversationViews = () => {
    return data1.map((item) => (
      <ConversationView
        key={item.id}
        profileImg={item.profileImg}
        name={item.name}
        message={item.message}
        time={item.time}
        count={item.count}
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