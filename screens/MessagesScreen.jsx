/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, StyleSheet, Text } from "react-native";
// import CoversationView from "../components/CoversationView";
import { vw } from "react-native-expo-viewport-units";
import ConversationList from "../components/ConversationList";

export default function MessagesScreen({ navigation }) {
  //   const { message } = route.params;
  console.log(navigation);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.recentChats}>Recent Chats</Text>
      </View>
      <View style={styles.flatlist}>
        <ConversationList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    //  backgroundColor: "#e9e9e9",
    backgroundColor: "white",
    width: vw(100),
    justifyContent: "center",
    alignSelf: "center",
  },
  recentChats: {
    fontWeight: "700",
    fontSize: 26,
    paddingBottom: 30,
    justifyContent: "center",
    alignSelf: "center",
  },
  flatlist: {
    width: vw(94),
    justifyContent: "center",
    alignSelf: "center",
  },
});
