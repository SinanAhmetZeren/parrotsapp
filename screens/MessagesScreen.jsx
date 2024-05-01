/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import ConversationList from "../components/ConversationList";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useGetMessagesByUserIdQuery } from "../slices/MessageSlice";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

export default function MessagesScreen({ navigation }) {
  const userId = useSelector((state) => state.users.userId);
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError,
    error,
    isSuccess: isSuccessMessages,
    refetch,
  } = useGetMessagesByUserIdQuery(userId);
  const [receivedMessageData, setReceivedMessageData] = useState("");
  const [transformedMessages, setTransformedMessages] = useState([]);

  const recipientId = userId;
  const hubConnection = useMemo(() => {
    return new HubConnectionBuilder()
      .withUrl(
        `https://measured-wolf-grossly.ngrok-free.app/chathub/11?userId=${userId}`
      )
      .build();
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await refetch();
        } catch (error) {
          console.error("Error refetching messages data:", error);
        }
      };
      fetchData();
      console.log("messages data: ", messagesData);
      return () => {
        // Cleanup function if needed
      };
    }, [refetch, navigation])
  );

  // SIGNALR
  useEffect(() => {
    const startHubConnection = async () => {
      try {
        await hubConnection.start();
        console.log("SignalR connection started successfully.");
      } catch (error) {
        console.error("Failed to start SignalR connection:", error);
      }
    };
    startHubConnection();
    hubConnection.on(
      "ReceiveMessage",
      async (senderId, content, newTime, senderProfileUrl, senderUsername) => {
        setReceivedMessageData([
          senderId,
          content,
          newTime,
          senderProfileUrl,
          senderUsername,
        ]);
      }
    );

    hubConnection.on("ReceiveMessageRefetch", async () => {
      refetch();
    });

    return () => {
      // hubConnection.stop();
    };
  }, []);

  if (isSuccessMessages) {
    console.log("...", messagesData);
    return (
      <View style={styles.container}>
        {messagesData ? (
          <>
            <View style={styles.mainBidsContainer}>
              <View style={styles.currentBidsAndSeeAll}>
                <Text style={styles.currentBidsTitle}>Recent Chats</Text>
              </View>
            </View>

            <View style={styles.flatlist}>
              <ConversationList data={messagesData} userId={userId} />
            </View>
          </>
        ) : (
          <>
            <View style={styles.mainBidsContainer2}>
              <View style={styles.currentBidsAndSeeAll2}>
                <Image
                  source={require("../assets/parrots-logo.jpg")}
                  style={styles.logoImage}
                />

                <Text style={styles.currentBidsTitle2}>No messages yet...</Text>
              </View>
            </View>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  currentBidsTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3c9dde",
    paddingLeft: vw(5),
  },

  currentBidsAndSeeAll: {
    marginTop: vh(2),
    flexDirection: "row",
    paddingRight: vw(10),
  },
  mainBidsContainer: {
    borderRadius: vw(5),
    borderColor: "#93c9ed",
  },
  currentBidsTitle2: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3c9dde",
    paddingTop: vh(3),
  },
  logoImage: {
    height: vh(20),
    width: vh(20),
    borderRadius: vh(10),
  },
  currentBidsAndSeeAll2: {
    marginTop: vh(2),
    alignItems: "center",
    alignSelf: "center",
  },
  mainBidsContainer2: {
    marginTop: vh(7.5),
    borderRadius: vw(5),
  },
  buttonSave: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    backgroundColor: "#186ff1",
    marginTop: vh(1),
    paddingVertical: vh(0.5),
  },
  container: {
    marginTop: vh(5),
    backgroundColor: "white",
    width: vw(100),
    alignSelf: "center",
    height: vh(95),
  },
  recentChats: {
    fontWeight: "700",
    fontSize: 26,
    justifyContent: "center",
    alignSelf: "center",
  },
  flatlist: {
    backgroundColor: "yellow",
    marginTop: vh(2),
    width: vw(94),
    justifyContent: "center",
    alignSelf: "center",
  },
});
